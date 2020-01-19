import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";

import Login from './Login';
import Register from './Register';
import Panel from './Panel/Panel';
import ShowUsers from './Panel/Users/ShowUsers';
import EditUser from './Panel/Users/EditUser';
import AddUser from './Panel/Users/AddUser';
import FlashMessage from "../Utils/FlashMessage";
import UserAuth from "../Utils/UserAuth";
import SendRequest from "../Utils/SendRequest";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let flashMessage = new FlashMessage();
        let sendRequest = new SendRequest();
        let auth = new UserAuth();

        return (
            <Router>
                <Switch>
                    <Route path="/panel/users/add" render={(props) => <AddUser {...props} flashMessage={flashMessage} auth={auth} sendRequest={sendRequest}/>}/>
                    <Route path="/panel/users/:id/edit" render={(props) => <EditUser {...props} flashMessage={flashMessage} auth={auth} sendRequest={sendRequest}/>}/>
                    <Route path="/panel/users" render={(props) => <ShowUsers {...props} flashMessage={flashMessage} auth={auth} sendRequest={sendRequest}/>}/>
                    <Route path="/panel" render={(props) => <Panel {...props} flashMessage={flashMessage} auth={auth} sendRequest={sendRequest}/>}/>
                    <Route path="/register" render={(props) => <Register {...props} flashMessage={flashMessage} sendRequest={sendRequest}/>}/>
                    <Route path="/" render={(props) => <Login {...props} flashMessage={flashMessage} auth={auth} sendRequest={sendRequest}/>}/>
                </Switch>
            </Router>
        );
    }
}
