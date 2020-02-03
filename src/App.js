import React, {Component} from 'react';
import { Menu, Container, Dropdown, Button, Icon } from 'semantic-ui-react';
import {categories} from './constants/categories';
import {countries} from './constants/countries';
import { connect } from 'react-redux';


import News from './components/News';
import Collection from './components/Collection';
import Profile from './components/Profile';
import * as newsActions from './store/action/action';
import * as authAction from './store/action/authAction';


class App extends Component {
  state = {
    isCollection: false,
    isProfile: false,
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
  const { activeItem, isCollection, isProfile } = this.state
  return (
    <div>
    <Menu pointing fluid stackable inverted>
      <Container>
        <Menu.Item 
          name='header'
          active={activeItem === 'header'}
          onClick={(event, {name}) => this.setState({isCollection: false, isProfile: false, activeItem: name})} 
          header>
          <Button size="massive"inverted animated='fade'>
            <Button.Content visible><p>News_Api</p></Button.Content>
            <Button.Content hidden><Icon size="big" name="newspaper outline"/></Button.Content>
          </Button>
        </Menu.Item>
        <div
        style={{display: (isCollection === false && isProfile === false) ? 'block' : 'none' }}>
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
        style={{ display: (isCollection === false && isProfile === false) ? 'block' : 'none' }}>
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
            onClick={(event, {name}) => this.setState({isCollection: true, isProfile: false, activeItem: name})}
            >
          
          </Menu.Item>
          <Dropdown inline item text='More'>
          <Dropdown.Menu>
            <Dropdown.Item
            name='profile'
            active={activeItem === 'profile'}
            onClick={(event, {name}) => this.setState({isCollection: false, isProfile: true, activeItem: name})}
            >
            <Icon name="user circle outline"/>Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              
                <Button onClick={(e) => {this.logout(e)}} primary><Icon name="sign-out"/>Logout</Button>
              
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </Menu.Menu>
      </Container>
    </Menu>

    {(isProfile) ? <Profile /> : (!isCollection) ? <News /> : <Collection />}
    
    </div>
  );
  }
}

const mapStateToProps = state => {
  return {
    data: state.news.data
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
