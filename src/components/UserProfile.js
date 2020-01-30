import React, {Component} from 'react';
import {Card, Image, Icon } from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userAction from '../store/action/userAction';

class UserProfile extends Component {

    async componentDidMount() {
        await this.props.fetchUserDetails();
    }

    render() {
        const { userData } = this.props;
        let date = new Date(new Date(userData.userJoinedOn).getTime()).toGMTString();
        date = date.toLocaleString().slice(0, -3); // removes GMT
        return (
            <Card>
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false}/>
                <Card.Content>
                <div>
                <Card.Header style={{float: 'left'}}>{userData.userName}</Card.Header>
                <Icon.Group style={{float: 'right'}} size='large'>
                <Icon name="image" />
                <Icon corner name='add' />
                </Icon.Group>
                </div>
                <br />
                <Card.Meta>
                <span className='date'>Joined on {date}</span>
                </Card.Meta>
                <Card.Description>
                {userData.userEmail}
                </Card.Description>
                </Card.Content>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        userData: state.user.userData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserDetails: () => dispatch(userAction.fetchUserDetails())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);