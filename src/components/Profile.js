import React, { Component } from 'react';
import { Grid, Menu, Segment, Icon } from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as logsAction from '../store/action/logsAction';
import UserActivity from './UserActivity';
import CollectionActivity from './CollectionActivity';
import UserProfile from './UserProfile';
import backgroundImage from '../assets/newspapers.png';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'user'
        }
    }



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
                    <Menu.Item size='huge'> Activities <Icon name='calendar alternate outline' /> <hr />
                        <Menu.Menu size='medium'>
                            <Menu.Item
                                name='usage activities'
                                active={this.state.activeItem === 'usage activities'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='collection activities'
                                active={this.state.activeItem === 'collection activities'}
                                onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                    </Menu.Item>
                </Menu>
                </Grid.Column>

                <Grid.Column stretched width={12}>
                
                    {(this.state.activeItem === 'user') 
                        ? <UserProfile /> 
                        : (this.state.activeItem === 'usage activities')
                            ? <Segment style={{marginRight: '15px'}}><UserActivity /></Segment>
                            : <Segment style={{marginRight: '15px'}}><CollectionActivity /></Segment>
                    }
                
                </Grid.Column>
            </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isFirstVisit: state.logs.isFirstVisit,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchCollectionActivityLogs: () => dispatch(logsAction.fetchCollectionActivityLogs()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);