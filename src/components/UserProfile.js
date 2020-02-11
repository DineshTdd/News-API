import React, {Component} from 'react';
import {Card, Image, Icon, Button } from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userAction from '../store/action/userAction';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state ={
            file : this.props.userData.userProfilePicture,
            fileName: ''
        }
    }

    async componentDidMount() {
        await this.props.fetchUserDetails();
    }

    fileLoader(file) {
        let self = this;
        var reader = new FileReader();
        reader.onload =  async function(event) {
            await self.setState({file: event.target.result})
          };
        reader.readAsDataURL(file);
    }

    async fileSelectedHandler(e) {
        e.preventDefault();  
        const {files} = e.target;
        if (!["image/png","image/gif","image/jpg","image/jpeg"].includes(files[0].type)) {
            return alert('Please upload a valid image file!')
        }
        if(files[0].size > 3500000) {
            return alert('Please upload a image file of size less than 1MB!')
        }
        this.fileLoader(files[0]);
        this.setState({fileName: files[0].name})
        await this.props.setProfilePicture(files[0]);

    }

    render() {
        const { userData } = this.props;
        const {file} = this.state;
        let date = new Date(new Date(userData.userJoinedOn).getTime() - new Date(userData.userJoinedOn).getTimezoneOffset()*60*1000);
        date = date.toGMTString();
        date = date.slice(0, -4); // removes GMT
        return (
            <Card style={{height: 'auto'}}>
                <Image src={(file) ? this.state.file : (userData.userProfilePicture) ? userData.userProfilePicture : 'https://react.semantic-ui.com/images/avatar/large/matthew.png'  } wrapped ui={false}/>
                <Card.Content>
                <div>
                <input 
                    accept=".png, .jpg, .jpeg, .gif"
                    style={{display: 'none'}} 
                    type="file" 
                    onChange={(e) => this.fileSelectedHandler(e)}
                    ref={fileInput => this.fileInput = fileInput} />
                <Card.Header style={{float: 'left', fontWeight: 'bold'}}><Icon name='user' size='small' />{userData.userName}</Card.Header>
                <Button style={{fontSize: '10px', float: 'right'}} onClick={() => {this.fileInput.click()}}>
                <Icon.Group size='large'>
                <Icon name="image" />
                <Icon corner name='add' />
                </Icon.Group></Button>
                </div>
                <br /><br />
                <Card.Meta>
                <Icon name='like' size='small' />
                <span className='date'>{(userData.userJoinedOn) ? `Joined on ${date}` : 'Loading...'}</span>
                </Card.Meta>
                <Card.Description>
                <Icon name='mail' size='small' />
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
        fetchUserDetails: () => dispatch(userAction.fetchUserDetails()),
        setProfilePicture: (file) => dispatch(userAction.setProfilePicture(file))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);