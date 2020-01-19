import React from "react";


export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : '',
            error : ''
        };
        this.handleRegister = this.handleRegister.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleRegister(event){
        event.preventDefault();
        this.props.history.replace('/register')
    }

    async handleSubmit(event){
        event.preventDefault();

        let requestBody = {
            username: this.state.email,
            password: this.state.password
        };

        const responseBody = await this.props.sendRequest.fetch('/api/login', 'POST', null, requestBody);

        if (false === responseBody){
            this.props.auth.setToken('');
            this.props.history.replace("/");
            return;
        }

        if (responseBody.error){
            this.setState({error : responseBody.error});
            return;
        }

        this.props.auth.setToken(responseBody.apiToken);
        this.props.auth.setRoles(responseBody.roles);
        this.props.history.replace('/panel')
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({ [name] : value});
    }

    render() {

        let flashMessage = this.props.flashMessage.getFlash();

        return (
                <form onSubmit={this.handleSubmit}>

                    <h1 className="mt-5">Login</h1>
                    {
                        flashMessage &&
                        <div className="alert alert-success" role="alert">
                            {flashMessage}
                        </div>}
                    {
                        this.state.error &&
                        <div className="alert alert-danger" role="alert">
                            {this.state.error}
                        </div>}
                    <div className="form-group">
                        <input type="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="email" name="email"
                               placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <input type="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="password" name="password"
                               placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>&nbsp;
                    <button className="btn btn-success" onClick={this.handleRegister}>Register</button>
                </form>
        );
    }
}
