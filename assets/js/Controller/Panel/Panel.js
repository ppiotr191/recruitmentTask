import React from "react";
import Navbar from '../../Components/Navbar';

export default class Panel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount(){

        const token = this.props.auth.getToken();
        const responseBody = await this.props.sendRequest.fetch('/api/panel', 'GET', token);

        if (false === responseBody){
            this.props.auth.setToken('');
            this.props.history.replace("/");
            return;
        }

        let permission = 'User';
        if (-1 !== responseBody.roles.indexOf('ROLE_ADMIN')){
            permission = 'Admin'
        }
        this.setState({username : responseBody.email, permission : permission})

    }

    render(){
        if (!this.props.auth.getToken()){
            this.props.history.replace('/');
        }

        return (
            <div>
                <Navbar {...this.props} />
                <div className="pt-5">
                    <h1 className="mt-5">Hello {this.state.username} !</h1>
                    <h1>Your permission is : {this.state.permission} !</h1>
                </div>

            </div>);

    }

}