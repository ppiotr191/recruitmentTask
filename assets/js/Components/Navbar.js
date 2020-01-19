import React from "react";


export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.logout = this.logout.bind(this);
        this.navHome = this.navHome.bind(this);
        this.navUsers = this.navUsers.bind(this);
    }

    async componentDidMount(){
        const roles = this.props.auth.getRoles();

        let permission = 'User';
        if (-1 !== roles.indexOf('ROLE_ADMIN')){
            permission = 'Admin'
        }
        this.setState({ permission : permission})
    }

    logout(event){
        event.preventDefault();
        this.props.auth.setToken('');
        this.props.history.replace('/');
    }

    navHome(event){
        event.preventDefault();
        this.props.history.replace('/panel');
    }

    navUsers(event){
        event.preventDefault();
        this.props.history.replace('/panel/users');
    }

    render(){
        if (!this.props.auth.getToken()){
            this.props.history.replace('/');
        }

        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <a className="navbar-brand" href="/panel">Panel</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                            aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="#" onClick={this.navHome}>Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className={'nav-link ' + ('User' === this.state.permission ? 'disabled' : '')} href="#" onClick={this.navUsers} >Users</a>
                            </li>
                        </ul>
                        <button onClick={this.logout} className="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>
                    </div>

                </nav>
            </div>
        );
    }
}
