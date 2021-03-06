import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';

class CreateNote extends Component {

    state = {
        users: [],
        userSelected: '',
        title: '',
        content: '',
        date: new Date(),
        editing: false,
        _id: ''
    }

    async componentDidMount() {
        const res = await axios.get('http://localhost:4000/api/users');
        this.setState({
            users: res.data.map(user => user.username),
            userSelected: res.data[0].username
        })
        // console.log(this.state.users);
        const { id } = this.props.match.params;
        console.log(id);
        if(id) {
            const res = await axios.get(`http://localhost:4000/api/notes/${id}`);
            console.log(res.data);
            const {title, content, date, author } = res.data;
            this.setState({
                title,
                content,
                date: new Date(date),
                userSelected: author,
                editing: true,
                _id: id
            })
        }
        
    };

    onSubmit = async (e) => {
        e.preventDefault();

        const { userSelected, 
                title, 
                content, 
                date, 
                editing,
                _id 
              } = this.state;
        //console.log(userSelected, title, content);
        const newNote = {
            title,
            content,
            date,
            author: userSelected
        }
        //console.log(newNote);
        console.log(editing);
        if(editing) {
            await axios.put(`http://localhost:4000/api/notes/${_id}`, newNote);
        } else {
            const res = await axios.post('http://localhost:4000/api/notes', newNote);
            console.log(res);
        }
        
        window.location.href = '/';
    }

    onInputChange = (e) => {
        // console.log(e.target.name ,e.target.value);
        this.setState({
            //userSelected: e.target.value,
            [e.target.name]: e.target.value
        })
    }

    onChangeDate = (date) => {
        this.setState({
            date: date
        })
    }

    render() {

        const users = this.state.users;
        //const { userSelected, title, content } = this.state;
        //console.log(userSelected, title, content);

        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    <h4>Create a Note</h4>
                    {/* SELECT USER */}
                    <div className="form-group">
                        <select
                            className="form-control"
                            name="userSelected"
                            onChange={this.onInputChange}
                            value={this.state.userSelected}
                        >
                            {
                                users.map(user => 
                                    <option key={user} value={user}>
                                        {user}
                                    </option>
                                )
                            }
                        </select>
                    </div>

                    <div className="form-group"> 
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Title" 
                            name="title"
                            onChange={this.onInputChange}
                            value={this.state.title}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <textarea 
                            name="content"
                            className="form-control"
                            placeholder="Content"
                            onChange={this.onInputChange}
                            value={this.state.content}
                            required
                        >
                        </textarea>
                    </div>

                    <div className="form-group">
                        <DatePicker
                            className="form-control"
                            selected={this.state.date}
                            onChange={this.onChangeDate}
                        />
                    </div>

                    <form onSubmit={this.onSubmit}>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateNote;