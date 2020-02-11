import React , { Component } from 'react';
import { Form, Card, Button, Dimmer, Loader, Icon } from 'semantic-ui-react';
import './Styles/CardStyles.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as authAction from '../store/action/authAction';

class Login extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            email: '',
            password: '',
            isUserLoggingIn: false
        }
        this.change = this.change.bind(this);
    }

    componentDidMount() {
        this.setState({isUserLoggingIn: false})
        this._isMounted = true;
    }

    componentWillUnmount() {
        this.setState({isUserLoggingIn: false})
        this._isMounted = false;
     }

    change(e) {
        this._isMounted && this.setState({
            [e.target.name]: e.target.value
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        await this.setState({isUserLoggingIn: true})
        if(this.state.email.trim().length === 0 || this.state.password.trim().length === 0 ) {
            alert('Please fill in the required fields and proceed!')
            await this.setState({isUserLoggingIn: false})
        } else {
            const userDetails = this.state;
            this.setState({
                email: '',
                password: ''
                })
            await this.props.userLogin(userDetails);
            this._isMounted && await this.setState({isUserLoggingIn: false})
        }
    }
    
    render() {
        
        const {isUserLoggingIn} = this.state;
            
                return (isUserLoggingIn) 
                ? (
                    <Dimmer active>
                      <Loader size='massive' />
                    </Dimmer>
                )
            
                :  (<div  className='divStyle'>
                
                    <Card className='cardStyle'>
                        <Card.Content>
                            <Card.Header>Login into News App</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Card.Description>
                            
                            <Form onSubmit={async (event) => {await this.handleSubmit(event)}}>
                                <Form.Input
                                value={this.state.email}
                                fluid
                                label='Email'
                                placeholder='Email Address'
                                id='email'
                                name='email'
                                onChange={async (event) => {await this.change(event)}}
                                />
                                <Form.Input
                                value={this.state.password}
                                fluid
                                label='Password'
                                type='password'
                                id='password'
                                placeholder='Password'
                                name='password'
                                onChange={async (event) => {await this.change(event)}}
                                />
                                <Button type="submit" style={{float: 'right'}}><Icon name="sign-in" />Login</Button>
                                <Link style={{marginTop: '10px',float: 'left'}} to="/Signup" >Click to Signup</Link>
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
         userLogin:(userDetails) => dispatch(authAction.userLogin(userDetails)),
    };
  };

export default connect(null ,mapDispatchToProps)(Login);

