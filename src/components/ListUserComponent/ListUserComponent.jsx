import React, { Component } from 'react';
import UserService from '../../services/UserService';

class ListUserComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            users: []
        }
    }

    componentDidMount(){
        UserService.getUsers().then((res) => {
            this.setState({users: res.data})
        });
    }

    render() {
        return (
            <div>
                <h2 className='text-center'>Users List</h2>
                <div className='row'>
                    <table className='table table-stripped table-bordered'>
                        <thead>
                            <tr>
                                <th>User first Name</th>
                                <th>User surname</th>
                                <th>User birth</th>
                                <th>User rol</th>

                            </tr>
                        </thead>

                        <tbody>
                            {
                                this.state.users.map(
                                    user => 
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.surname}</td>
                                        <td>{user.date_of_birth}</td>
                                        <td>{user.rolId}</td>

                                    </tr>
                                )
                            }
                        </tbody>

                    </table>
                </div>
            </div>
        );
    }
}

export default ListUserComponent;