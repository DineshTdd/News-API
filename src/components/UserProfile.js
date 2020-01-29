import React, {Component} from 'react';
import {Card, Image } from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userAction from '../store/action/userAction';

class UserProfile extends Component {

    async componentDidMount() {
        await this.props.fetchUserDetails();
    }

    render() {
        const { userData } = this.props;
        const date = new Date(new Date(userData.userJoinedOn).getTime()).toGMTString()
        return (
            <Card>
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                <Card.Content>
                <Card.Header>{userData.userName}</Card.Header>
                <Card.Meta>
                <span className='date'>Joined in {date.toLocaleString()}</span>
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