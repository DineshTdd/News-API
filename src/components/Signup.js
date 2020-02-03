import React , { Component } from 'react';
import { Form, Card, Button, Icon } from 'semantic-ui-react';
import { divStyle , cardStyle } from '../constants/Styles.js';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as authAction from '../store/action/authAction';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: ''
        }
        this.change = this.change.bind(this);
    }

    async change(e) {
        await this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        if(this.state.email.trim().length === 0 || this.state.name.trim().length === 0 || 
        this.state.password.trim().length === 0 ) {
            alert('Please fill in the required fields and proceed!')
        } else {
            const userDetails = this.state;
            await this.setState({name: '',
            email: '',
            password: ''})
            await this.props.userSignup(userDetails);  
        }
    }
    
    render() {
        
        return (
            <div  style={divStyle}>

            <Card style={cardStyle}>
                <Card.Content>
                    <Card.Header>Signup for News App</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Card.Description>
                    
                    <Form onSubmit={async (event) => {await this.handleSubmit(event)}}>
                    <Form.Input
                        value={this.state.name}
                        fluid
                        label='Name'
                        placeholder='Enter your name'
                        id='name'
                        name='name'
                        onChange={async (event) => {await this.change(event)}}
                        />
                        <Form.Input
                        value={this.state.email}
                        fluid
                        label='Email'
                        placeholder='Email Address'
                        id='email'
                        name='email'
                        onChange={(e) => this.change(e)}
                        />
                        <Form.Input
                        value={this.state.password}
                        fluid
                        label='Password'
                        type='password'
                        id='password'
                        placeholder='Password'
                        name='password'
                        onChange={(e) => this.change(e)}
                        />
                        <Button type="submit" style={{float: 'right'}}><Icon name="user outline"/>Signup</Button>
                        <Link style={{padding: '10px',float: 'left'}} to="/" >If existing user</Link>
                    </Form>
                    
                    </Card.Description>
                </Card.Content>
            </Card>
            </div>
        )
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
         userSignup:(userDetails) => dispatch(authAction.userSignup(userDetails)),
    };
  };

export default connect(null ,mapDispatchToProps)(Signup);
