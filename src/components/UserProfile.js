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
        await this.fileLoader(files[0]);
        await this.setState({fileName: files[0].name})
        await this.props.setProfilePicture(files[0]);
    }

    render() {
        const { userData } = this.props;
        const {file} = this.state;
        let date = new Date(new Date(userData.userJoinedOn).getTime()).toGMTString();
        date = date.toLocaleString().slice(0, -3); // removes GMT
        return (
            <Card>
                <Image src={(file) ? this.state.file : userData.userProfilePicture} wrapped ui={false}/>
                <Card.Content>
                <div>
                <input 
                    accept=".png, .jpg, .jpeg, .gif"
                    style={{display: 'none'}} 
                    type="file" 
                    onChange={(e) => this.fileSelectedHandler(e)}
                    ref={fileInput => this.fileInput = fileInput} />
                <Card.Header style={{float: 'left', padding: '5px', fontWeight: 'bold'}}>{userData.userName}</Card.Header>
                <Button style={{fontSize: '10px', float: 'right'}} onClick={() => {this.fileInput.click()}}>
                <Icon.Group size='large'>
                <Icon name="image" />
                <Icon corner name='add' />
                </Icon.Group></Button>
                </div>
                <br /><br />
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
        fetchUserDetails: () => dispatch(userAction.fetchUserDetails()),
        setProfilePicture: (file) => dispatch(userAction.setProfilePicture(file))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);