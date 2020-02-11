import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as logsAction from '../store/action/logsAction';
// import UsageActivityChart from '../components/UsageActivityChart';
import Chart from './Chart/Barchart/Chart';
import Pie from './Chart/Piechart/Pie';
import { timeParse } from 'd3-time-format';
import './Styles/NumericStyle.css'
import {Message, Feed, Dimmer, Loader, Icon, Segment } from 'semantic-ui-react';

class UserActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActivityLoading: false,
        }
    }

    async componentDidMount() {
        this.setState({isActivityLoading: true})
        await this.props.fetchUserActivityLogs();
        this.setState({isActivityLoading: false})
        
    }

    render() {
        const {logsData} = this.props;
        let { graphData } = this.props;
        let averageTime = 0;
        graphData = graphData.filter((datum,index) => index<7)
        graphData.map(item => {averageTime += item.totalDuration; return item})
        averageTime = Math.ceil(averageTime / graphData.length)
        let barData = [];
        const parseDate = timeParse("%Y-%m-%d");
        graphData.map((datum) => barData.push({x: parseDate(datum.date), y: datum.totalDuration}))
        barData.sort((a, b) => new Date(a.x) - new Date(b.x))
        return (this.state.isActivityLoading) 
                ? (
                    <Dimmer active>
                    <Loader size='small' /><br></br>
                    <h5>Loading activity...</h5>
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
                        <div>
                        <Segment>
                            <h3>Time on NewsApp</h3>
                            <div style={{ textAlign: 'center' }}>
                                <p className="averageTime">{averageTime}m</p>
                                <p style={{fontWeight: "bold"}}>Daily Average</p>
                                <p>Average time you spent per day using the news app in the last week</p>
                            </div>
                            <div >
                            {/* <UsageActivityChart width={null} height={null} /> */}
                            <Chart />
                            <div style={{marginLeft: '30%'}}>
                            <Pie
                                data={barData}
                                width={200}
                                height={200}
                                innerRadius={60}
                                outerRadius={100}
                            /> </div>
                            </div>
                        </Segment>
                        <Feed>
                        {logsData.map((item) => (
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
                                            <Feed.User>Usage Activity: </Feed.User> <Icon name='history' size='small' /> {item.content} {item.usage.entryTime}
                                            <Feed.Date>used for {item.usage.activeMinutes}</Feed.Date>
                                        </Feed.Summary>
                                    </Feed.Content>
                                </Feed.Event>
                        ))}
                        </Feed>
                        </div>
                    )
                }
                </div>
            )
    }
}
const mapStateToProps = state => {
    return {
        logsData: state.logs.userActivityLogs,
        graphData: state.logs.graph,
        profileImage: state.user.userData.userProfilePicture
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserActivityLogs: () => dispatch(logsAction.fetchUserActivityLogs()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserActivity);

