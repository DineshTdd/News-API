import React, { Component } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import UserActivity from './UserActivity';
import UserProfile from './UserProfile';
import backgroundImage from '../assets/newspapers.png';

class Profile extends Component {

    state = { activeItem: 'user' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        return (
            <div style={{backgroundImage: `url(${backgroundImage})`, width: '100%', minHeight: '39.5em',}}>
            <Grid >
                <Grid.Column width={4}>
                <Menu size='huge'pointing secondary vertical>
                    <Menu.Item
                    icon='id badge outline'
                    name='user'
                    active={this.state.activeItem === 'user'}
                    onClick={this.handleItemClick}
                    />
                    <Menu.Item
                    icon='calendar alternate outline'
                    name='activities'
                    active={this.state.activeItem === 'activities'}
                    onClick={this.handleItemClick}
                    />
                </Menu>
                </Grid.Column>

                <Grid.Column stretched width={12}>
                
                    {(this.state.activeItem === 'user') ? <UserProfile /> : <Segment style={{marginRight: '15px'}}><UserActivity /></Segment>}
                
                </Grid.Column>
            </Grid>
            </div>
        )
    }
}

export default Profile;