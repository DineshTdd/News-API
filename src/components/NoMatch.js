import React, { Component } from 'react';
import { Message, Icon } from 'semantic-ui-react';
import { Redirect } from "react-router";

class NoMatch extends Component {
    state = {
      redirect: false
    }
  
    componentDidMount() {
      this.id = setTimeout(() => this.setState({ redirect: true }), 3000)
    }
  
    componentWillUnmount() {
      clearTimeout(this.id)
    }
  
    render() {
      return this.state.redirect
        ? <Redirect to="/" />
        : (
          <div style={{display: 'flex', paddingTop: '5px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Message
              style={{ width: '50%' }}
              floating
              icon 
              color='black' >
              <Icon name='circle notched' loading />
              <Message.Content>
                <Message.Header>Just a moment!</Message.Header>
                You're being redirected...
              </Message.Content>
            </Message>
            <div style={{ marginTop: '1%' }}>
              <img alt='Page Not Found...' src='https://lh3.googleusercontent.com/proxy/iLMdmiqexIZtAPx2Pnr0MoWUNJvldqve9BKpRrF0MiEFy7NapospAnd85OnyFWWRU159t1VwzmZLS6agrE9PFr3hy0iOBqe6P5jTRRoUHw' />
            </div>
          </div>
        )
    }
  }

  export default NoMatch;