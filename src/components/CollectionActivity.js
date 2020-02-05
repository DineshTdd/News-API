import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as logsAction from '../store/action/logsAction';
import {Message, Feed, Dimmer, Loader, Icon, Button } from 'semantic-ui-react';

class CollectionActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActivityLoading: false
        }
    }

    async componentDidMount() {
        this.setState({isActivityLoading: true})
        await this.props.fetchCurrentCollectionLogs();
        this.setState({isActivityLoading: false})
        if (this.props.isFirstVisit) {
            this.setState({isActivityLoading: true})
            await this.props.fetchCollectionActivityLogs();
            this.setState({isActivityLoading: false})
        }
    }

    render() {
        const { currentCollectionLogs,collectionLogsData, remainingCollectionLogs} = this.props;
        const totalCollectionLogsData = currentCollectionLogs.concat(collectionLogsData);
        return (this.state.isActivityLoading) 
                ? (
                    <Dimmer active>
                    <Loader size='small' />
                    </Dimmer>
                )
                : (<div>
                { (collectionLogsData.length === 0) ? 
                    (
                        <Message style={{ width: '50%', marginLeft: '25%'}} info>
                            <Message.Header>No activities right now!</Message.Header>
                            <p>Explore the app</p>
                        </Message>
                    )
                    : (
                        <Feed>
                        {totalCollectionLogsData.map((item) =>{
                            let Time = new Date(new Date(item.date).getTime() - new Date(item.date).getTimezoneOffset()*60*1000);
                            Time =  Time.toGMTString().slice(0, -4);
                            return (                                
                                <Feed.Event key={item._id}>
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
                                            <Feed.User>Collection Activity: </Feed.User> <Icon name='history' size='small' /> {item.content} on {Time}
                                            <Feed.Date>{item.articleUrl}</Feed.Date>
                                        </Feed.Summary>
                                    </Feed.Content>
                                </Feed.Event>
                        )})}
                        </Feed>
                    )
                }
                {(remainingCollectionLogs > 0) 
                    ? (<Button style={{ marginLeft: '40%', width: '120px'}} onClick={this.props.fetchCollectionActivityLogs}>Load More</Button>)
                    : (null)
                }
                </div>
            )
    }
}
const mapStateToProps = state => {
    return {
        collectionLogsData: state.logs.userCollectionLogs,
        currentCollectionLogs: state.logs.currentCollectionLogs,
        remainingCollectionLogs: state.logs.remainingCollectionLogs,
        isFirstVisit: state.logs.isFirstVisit,
        profileImage: state.user.userData.userProfilePicture
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchCollectionActivityLogs: () => dispatch(logsAction.fetchCollectionActivityLogs()),
        fetchCurrentCollectionLogs: () => dispatch(logsAction.fetchCurrentCollectionLogs())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionActivity);
