import React from "react";
import Navbar from "../../../Components/Navbar";


export default class ShowUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users : [],
            removeRecordName : '',
            removeRecordId : '',
        };

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.remove = this.remove.bind(this);
    }

    async componentDidMount(){
        const token = this.props.auth.getToken();

        const responseBody = await this.props.sendRequest.fetch('/api/users', 'GET', token);

        if (false === responseBody){
            this.props.auth.setToken('');
            this.props.history.replace("/");
            return;
        }

        this.setState({users : responseBody})
    }

    add(event) {
        event.preventDefault();
        this.props.history.replace('/panel/users/add');
    }

    edit(event, id) {
        event.preventDefault();
        this.props.history.replace('/panel/users/' + id + '/edit')
    }

    remove(event, id, name) {
        event.preventDefault();
        this.setState({removeRecordId : id, removeRecordName: name})
        $('#removeUserModal').modal();
    }

    async removeAccept(event){

        event.preventDefault();
        const token = this.props.auth.getToken();

        const responseBody = await this.props.sendRequest.fetch('/api/users/' + this.state.removeRecordId, 'DELETE', token);

        if (false === responseBody){
            this.props.auth.setToken('');
            this.props.history.replace("/");
            return;
        }
        this.componentDidMount();      //refresh
        $('#removeUserModal').modal('hide');
    }

    render(){
        if (!this.props.auth.getToken()){
            this.props.history.replace('/');
        }

        return (
            <div>
                <Navbar {...this.props} />
                <div className="pt-5">
                    <h1 className="mt-5">Users</h1>
                    <button className="btn btn-success" onClick={this.add} ><i className="far fa-plus-square"></i>&nbsp;Add user</button>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Email</th>
                            <th scope="col">Roles</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map((user, i) => {
                            return (<tr key={i.toString()}>
                            <th scope="row">{user.id}</th>
                            <td>{user.username}</td>
                            <td>{user.roles.join(', ')}</td>
                            <td>
                            <button className="btn btn-success" onClick={(event) => this.edit(event, user.id)} ><i className="far fa-edit"></i></button>&nbsp;
                            <button className="btn btn-danger" onClick={(event) => this.remove(event, user.id, user.username)} ><i className="far fa-trash-alt"></i></button>
                            </td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="modal fade" id="removeUserModal" tabIndex="-1" role="dialog"
                     aria-labelledby="removeUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="removeUserModalLabel">Are you sure?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure to remove '{this.state.removeRecordName}' record?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-danger" onClick={(event) => this.removeAccept(event)}>Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}
