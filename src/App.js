import React, {Component} from 'react';
import { Menu, Container, Dropdown, Button, Icon } from 'semantic-ui-react';
import {categories} from './constants/categories';
import {countries} from './constants/countries';
import { connect } from 'react-redux';


import News from './components/News';
import Collection from './components/Collection';
import Profile from './components/Profile';
import Todo from './components/todo/todo';
import * as newsActions from './store/action/action';
import * as authAction from './store/action/authAction';


class App extends Component {
  state = {
    isCollection: false,
    isProfile: false,
    isTodo: false,
    activeItem: 'header'
  }

  componentDidMount() {
    this.props.changeData();
  }

  logout(e) {
    e.preventDefault();
    this.props.removeUserSession();
  }
  

  // Renders News and Collection component with common Menu
  render() {
  const { activeItem, isCollection, isProfile, isTodo } = this.state
  return (
    <div>
    <Menu pointing fluid stackable inverted>
      <Container>
        <Menu.Item 
        style={{width: '22%'}}
          name='header'
          active={activeItem === 'header'}
          onClick={(event, {name}) => this.setState({isCollection: false, isProfile: false, isTodo: false, activeItem: name})} 
          header>
          <Button style={{height: '50px',width: '100%', marginLeft: '25%'}} size="massive"inverted animated='fade'>
            <Button.Content visible><p>News_App</p></Button.Content>
            <Button.Content hidden><Icon size="big" name="newspaper outline"/></Button.Content>
          </Button>
        </Menu.Item>
        <div
        style={{display: (isCollection === false && isProfile === false && isTodo === false) ? 'block' : 'none' }}>
        <Menu.Item>
        <Icon size="small" name="filter"/>
        <Dropdown
              openOnFocus inline item fluid
              placeholder='Category'
              options={ categories } 
              onChange = {async (event, {value} ) => {
                this.props.changeCategory(value);
                await this.props.changeData();
              }}
            />
        </Menu.Item>
        </div>
        <div
        style={{ display: (isCollection === false && isProfile === false && isTodo === false) ? 'block' : 'none' }}>
        <Menu.Item>
        <Dropdown
          className='icon' icon='world'
          labeled inline item search selection openOnFocus
          options={countries}
          placeholder='Select Country'
          onChange = {async (event, {value} ) => {
            this.props.changeCountry(value);
            await this.props.changeData();
          } }
        />
        </Menu.Item>
        </div>
        <Menu.Menu position='right'>
          <Menu.Item 
            name='collection'
            active={activeItem === 'collection'}
            onClick={(event, {name}) => this.setState({isCollection: true, isProfile: false, isTodo: false, activeItem: name})}
            >
          <Icon name="archive"/>Collection
          </Menu.Item>
          <Dropdown fluid item text='More'>
          <Dropdown.Menu>
            <Dropdown.Item
              name='todos'
              active={activeItem === 'todos'}
              onClick={(event, {name}) => this.setState({isCollection: false, isProfile: false, isTodo: true, activeItem: name})}
            >
              <Icon name="tasks"/>Todos
            </Dropdown.Item>
            <Dropdown.Item
            name='profile'
            active={activeItem === 'profile'}
            onClick={(event, {name}) => this.setState({isCollection: false, isProfile: true, isTodo: false, activeItem: name})}
            >
            <div style={{display: 'inline-block' }}>
            <div style={{
                display: 'inline-block',
                position: 'relative',
                width: '30px',
                height: '30px',
                overflow: 'hidden',
                borderRadius: '50%',
                float: 'left'
            
            }}>
            <img 
            src={
                (this.props.userProfilePicture !== null) 
                ? this.props.userProfilePicture 
                : 'https://react.semantic-ui.com/images/avatar/large/matthew.png' 
            } 
            alt="userProfilePic"
            style={{
                width: 'auto',
                height: '100%',
                marginLeft: '-2.5px',
            }}/>
            </div>
            <div style={{ padding: '7px' ,float: 'right'}}>Profile</div></div>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item style={{width: '250px'}}>
                <Button style={{width: '100%'}} onClick={(e) => {this.logout(e)}} primary><Icon name="sign-out"/>Logout</Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </Menu.Menu>
      </Container>
    </Menu>

    {(isTodo)? <Todo /> : (isProfile) ? <Profile /> : (!isCollection) ? <News /> : <Collection />}
    
    </div>
  );
  }
}

const mapStateToProps = state => {
  return {
    data: state.news.data,
    userProfilePicture: state.user.userData.userProfilePicture
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeCategory: (value) => dispatch({type: newsActions.CHANGE_CATEGORY, payload: {value}}),
    changeCountry: (value) => dispatch({type: newsActions.CHANGE_COUNTRY, payload: {value}}),
    changeData: () => dispatch(newsActions.fetchNews()),
    removeUserSession: () => dispatch(authAction.removeUserSession())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
