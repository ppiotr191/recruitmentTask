import React from "react";


export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : '',
            confirmPassword : '',
            errors : {}
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    validationBeforeSubmit(){

        let errors = {};
        if (this.state.password !== this.state.confirmPassword){
            errors = {confirmPassword : 'Password and confirm password should be same'};
        }
        return errors;
    }

    handleLogin(event){
        event.preventDefault();
        this.props.history.replace('/')
    }



    async handleSubmit(event){
        event.preventDefault();
        const beforeSubmitErrors = this.validationBeforeSubmit();

        if (Object.keys(beforeSubmitErrors).length > 0){
            this.setState({'errors' : beforeSubmitErrors});
            return;
        }
        var requestBody = {
            email: this.state.email,
            password: this.state.password
        };

        const responseBody = await this.props.sendRequest.fetch('/api/register', 'POST', null, requestBody);

        if (responseBody.success){
            this.props.flashMessage.setFlash('Registration Successful. Please log in');
            this.props.history.replace('/')
            return;
        }

        this.setState({'errors' : responseBody.errors});
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({ [name] : value});
    }

    render() {
        return (
                <form onSubmit={this.handleSubmit}>
                    <h1 className="mt-5">Register</h1>
                    <div className="form-group">
                        <input type="email" value={this.state.email} onChange={this.handleChange} className={'form-control ' + (this.state.errors.hasOwnProperty('email') ? 'is-invalid' : '')} id="email" name="email"
                               placeholder="Enter email" />
                        {   this.state.errors.hasOwnProperty('email') &&
                            <small id="passwordHelp" className="text-danger">{this.state.errors.email}</small>}
                    </div>
                    <div className="form-group">
                        <input type="password" value={this.state.password} onChange={this.handleChange} className={'form-control ' + (this.state.errors.hasOwnProperty('password') ? 'is-invalid' : '')} id="password" name="password"
                               placeholder="Password" />
                        {   this.state.errors.hasOwnProperty('password') &&
                        <small id="passwordHelp" className="text-danger">{this.state.errors.password}</small>}
                    </div>
                    <div className="form-group">
                        <input type="password" value={this.state.confirmPassword} onChange={this.handleChange} className={'form-control ' + (this.state.errors.hasOwnProperty('confirmPassword') ? 'is-invalid' : '')} id="confirmPassword" name="confirmPassword"
                               placeholder="Confirm Password" />
                        {   this.state.errors.hasOwnProperty('confirmPassword') &&
                        <small id="passwordHelp" className="text-danger">{this.state.errors.confirmPassword}</small>}
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>&nbsp;
                    <button className="btn btn-success" onClick={this.handleLogin}>Login</button>
                </form>
        );
    }
}
