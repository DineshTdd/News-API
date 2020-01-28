import React, {Component} from 'react';
import { Menu, Container, Dropdown, Button } from 'semantic-ui-react';
import {categories} from './constants/categories';
import {countries} from './constants/countries';
import { connect } from 'react-redux';

import News from './components/News';
import Collection from './components/Collection';
import * as newsActions from './store/action/action';
import * as authAction from './store/action/authAction';


class App extends Component {
  state = {
    isCollection: false
  }

  componentDidMount() {
    this.props.changeData();
  }

  async logout(e) {
    e.preventDefault();
    await this.props.removeUserSession();
  }

  // Renders News and Collection component with common Menu
  render() {
  return (
    <div>
    <Menu fluid stackable inverted>
      <Container>
        <Menu.Item onClick={(event, data) => this.setState({isCollection: false})} header>
        <p>News_Api</p>
        </Menu.Item>
        <Dropdown
              openOnFocus
              inline item placeholder='Category'
              options={ categories } 
              onChange = {async (event, {value} ) => {
                this.props.changeCategory(value);
                await this.props.changeData();
              }}
            />
        <Dropdown
              openOnFocus
              inline item placeholder='Countries'
              options={ countries } 
              onChange = {async (event, {value} ) => {
                this.props.changeCountry(value);
                await this.props.changeData();
              } }
        />
        <Menu.Menu position='right'>
          <Menu.Item onClick={(event, data) => this.setState({isCollection: true})}>
            <p>My Collection</p>
          </Menu.Item>
          <Menu.Item onClick={(event, data) => this.setState()}>
            <Button onClick={(e) => {this.logout(e)}} primary>Logout</Button>
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
    {(!this.state.isCollection) ? <News /> : <Collection />}
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
