import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as logsAction from '../store/action/logsAction';
import {Message, Feed, Dimmer, Loader, Icon } from 'semantic-ui-react';

class UserActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActivityLoading: false
        }
    }

    async componentDidMount() {
        this.setState({isActivityLoading: true})
        await this.props.fetchUserActivityLogs();
        this.setState({isActivityLoading: false})
    }

    render() {
        const {logsData} = this.props;
        return (this.state.isActivityLoading) 
                ? (
                    <Dimmer active>
                    <Loader size='small' />
                    </Dimmer>
                )
                : (<div>
                { (logsData.length === 0) ? 
                    (
                        <Message style={{ width: '50%', marginLeft: '25%'}} info>
                            <Message.Header>No activities right now!</Message.Header>
                            <p>Explore the app</p>
                        </Message>
                    )
                    : (
                        <Feed>
                        {logsData.map((item) => (
                                <Feed.Event>
                                    <Feed.Label>
                                        <div style={{
                                            display: 'inline-block',
                                            position: 'relative',
                                            width: '40px',
                                            height: '40px',
                                            overflow: 'hidden',
                                            borderRadius: '50%'
                                        
                                        }}>
                                        <img 
                                        src={
                                            (this.props.profileImage !== null) 
                                            ? this.props.profileImage 
                                            : 'https://react.semantic-ui.com/images/avatar/large/matthew.png' 
                                        } 
                                        alt="userProfilePic"
                                        style={{
                                            width: 'auto',
                                            height: '100%',
                                            marginLeft: '-2.5px',
                                        }}/>
                                        </div>
                                    </Feed.Label>
                                    <Feed.Content>
                                        <Feed.Summary>
                                            <Feed.User>Usage Activity: </Feed.User> <Icon name='history' size='small' /> {item.content} {item.usage.entryTime}
                                            <Feed.Date>used for {item.usage.activeMinutes} minutes</Feed.Date>
                                        </Feed.Summary>
                                    </Feed.Content>
                                </Feed.Event>
                        ))}
                        </Feed>
                    )
                }
                </div>
            )
    }
}
const mapStateToProps = state => {
    return {
        logsData: state.logs.userActivityLogs,
        profileImage: state.user.userData.userProfilePicture
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserActivityLogs: () => dispatch(logsAction.fetchUserActivityLogs()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserActivity);

// width: '30px',
// height: '30px',
// borderRadius: '50%',
// position: 'relative',
// overflow: 'hidden',


// minWidth: '100%',
// minHeight: '100%',
// width: 'auto',
// height: 'auto',
// position: 'absolute',
// left: '30%',
// top: '30%',
// WebkitTransform: 'translate(-50%, -50%)',
// MozTransform: 'translate(-50%, -50%)',
// MsTransform: 'translate(-50%, -50%)',
// transform: 'translate(-50%, -50%)',
