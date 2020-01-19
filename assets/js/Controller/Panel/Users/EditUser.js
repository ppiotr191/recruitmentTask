import React from "react";
import Navbar from "../../../Components/Navbar";


export default class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : {
                email : '',
                password : '',
                confirmPassword : '',
            },
            userMapValues : {
                role : 'ROLE_USER',
            },
            message : null,
            errors : {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleMapValuesChange = this.handleMapValuesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount(){

        const token = this.props.auth.getToken();
        const responseBody = await this.props.sendRequest.fetch('/api/users/' + this.props.match.params.id, 'GET', token);

        responseBody.password = '';
        let userMapValues = this.state.userMapValues;
        if (-1 !== responseBody.roles.indexOf('ROLE_ADMIN')){
            userMapValues.role = 'ROLE_ADMIN';
        }

        let message = this.props.flashMessage.getFlash('User was added!');

        this.setState({user : responseBody, userMapValues : userMapValues, message : message})

    }

    async handleSubmit(event){
        event.preventDefault();

        const token = this.props.auth.getToken();
        this.setState({message : null});

        var requestBody = {
            email: this.state.user.email,
            password: this.state.user.password,
            roles : [this.state.userMapValues.role]
        };

        const responseBody = await this.props.sendRequest.fetch('/api/users/' + + this.props.match.params.id, 'PUT', token, requestBody);

        if (false === responseBody){
            this.props.auth.setToken('');
            this.props.history.replace("/");
            return;
        }

        if (responseBody.errors){
            this.setState({'errors' : responseBody.errors});
            return;
        }

        this.setState({message : 'User was changed!'});
    }

    handleChange(event) {
        const {name, value} = event.target;
        let user = this.state.user;
        user[name] = value;

        this.setState({ user : user});
    }

    handleMapValuesChange(event) {
        const {name, value} = event.target;
        let mapValuesChange = this.state.userMapValues;
        mapValuesChange[name] = value;

        this.setState({ userMapValues : mapValuesChange});
    }

    render(){
        if (!this.props.auth.getToken()){
            this.props.history.replace('/');
        }

        return (
            <div>
                <Navbar {...this.props} />
                <form className="mt-5" onSubmit={this.handleSubmit}>
                    <div className="pt-5">
                        <h1>Edit</h1>
                    </div>
                    {
                        this.state.message &&
                        <div className="alert alert-success" role="alert">
                            {this.state.message}
                        </div>}
                    <div className="form-group">
                        <input type="email" value={this.state.user.email} onChange={this.handleChange} className={'form-control ' + (this.state.errors.hasOwnProperty('email') ? 'is-invalid' : '')} id="email" name="email"
                               placeholder="Enter email" />
                        {   this.state.errors.hasOwnProperty('email') &&
                        <small id="passwordHelp" className="text-danger">{this.state.errors.email}</small>}
                    </div>
                    <div className="form-group">
                        <input type="password" value={this.state.user.password} onChange={this.handleChange} className={'form-control ' + (this.state.errors.hasOwnProperty('password') ? 'is-invalid' : '')} id="password" name="password"
                               placeholder="Password" />
                        {   this.state.errors.hasOwnProperty('password') &&
                        <small id="passwordHelp" className="text-danger">{this.state.errors.password}</small>}
                    </div>
                    <div className="form-group">
                        <select value={this.state.userMapValues.role} onChange={this.handleMapValuesChange} className="form-control"  id="role" name="role">
                            <option value="ROLE_USER">ROLE_USER</option>
                            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                        </select>
                    </div>


                    <button type="submit" className="btn btn-primary">Submit</button>&nbsp;
                </form>
            </div>);

    }
}
