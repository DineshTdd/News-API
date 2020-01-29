import React , { Component } from 'react';
import { Form, Card, Button } from 'semantic-ui-react';
import Background from '../assets/collection-newspapers.jpg';
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
        let width = window.screen.availWidth;
        let cardSize= '';
        let marginRight= '';
        let marginLeft = '';
        let paddingLeft = 'auto';
        if (width > 720) {
        cardSize ='60%';
        marginRight= null
        marginLeft=null
        } else if (width < 720 && width > 550) {
        cardSize = '85%';
        marginRight = 'auto';
        marginLeft = '0';
        paddingLeft = '10rem';
        } else if (width < 550 ) {
            cardSize= '18rem';
            marginRight = 'auto';
            marginLeft = '0';
            paddingLeft = '75px';
        }
        const divStyle = { 
            flex: 1,
            minHeight: '100%', 
            minWidth: '1024px', 
            width: '100%', 
            height: 'auto', 
            position: 'fixed', 
            backgroundSize: 'cover',
            backgroundImage: `url(${Background})`,  
            display:'flex',
            justifyContent:'center',
            alignItems:'center', 
            padding: '170px',
            paddingLeft: paddingLeft    
        }
        const cardStyle= {
            width: cardSize,
            maxWidth: 400,
            maxHeight: 400,
            marginRight: marginRight,
            marginLeft: marginLeft,
            shadowColor: 'black',
            shadowOpacity: 0.26,
            shadowOffset: {width: 0, height: 2},
            elevation: 5,
            shadowRadius: 10,
            borderRadius: 10,
        }
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
                        <Button type="submit" style={{float: 'right'}}>Signup</Button>
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