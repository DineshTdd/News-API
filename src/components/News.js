import React, {Component} from 'react';
import {Container, Card, Image, Pagination, Button, Icon, Message } from 'semantic-ui-react';
import {connect} from 'react-redux';
import backgroundImage from '../assets/newspaper-pieces-vintage.jpg';

import * as newsActions from '../store/action/action';
import * as collectionActions from '../store/action/collectionAction';

class News extends Component {

    state = {
        category: '',
        country: '',
        totalPage: 10,
        activePage:1,
        news_data: this.props.news_data,
        isWelcomeMessageVisible: true,
        isFirstVisit: this.props.isFirstVisit
      }
    
      // initial fetching of news from NEWSAPI and state is initialized
      componentDidMount() {
        this.props.changeData();
        this.setState({category: this.props.category, country: this.props.country, totalPage: this.props.totalPage, activePage: this.props.activePage});
      }

      handleBookmark = async (e,item) => {
        e.preventDefault();
        // Handling missing fields of NEWSAPI article before saving to PG
        const news_item = {
            author: (item.author) ? item.author : ' ' ,
            title: (item.title) ? item.title : ' ' ,
            imageUrl: (item.urlToImage) ? item.urlToImage : ' ' ,
            description: (item.description) ? item.description : ' ' ,
            articleUrl: (item.url) ? item.url : ' ' ,
            sourceName: (item.sourceName) ? item.sourceName : ' ' 
        };
        this.props.addToCollection(news_item, 'news from api')
    };

    handleDismiss = () => {
      this.setState({ isWelcomeMessageVisible: undefined })
      this.props.toggleIsFirstVisit(false)
    }

    // Renders news item fetched from NEWSAPI
    render () {
        const {news_data} = this.props;
        return (
            <div style={{ backgroundImage: `url(${backgroundImage})`, height: 'auto' }} >
              {
                (this.state.isWelcomeMessageVisible && this.state.isFirstVisit) ? 
                (
                <Message 
                  color='blue'
                  icon='smile'
                  style={{ width: '50%', marginLeft: '25%'}}
                  onDismiss={this.handleDismiss}
                  header='It is nice to have you here!'
                  content='Surf through the global happenings!'
                />
              )
              : null
              }
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Pagination
                inverted
                activePage={this.props.activePage}
                onPageChange={async (e, {activePage}) => {
                    this.props.changeActivePage(activePage);
                    await this.props.changeData();
                }}
                totalPages={this.props.totalPage} />
            </div>
            <div style={{margin: '10px'}}>
                <Container >
                    { (this.props.isNewsFetching)
                    ? (
                    <div style={{height: '100vh'}}>
                        <Message icon color='black' >
                        <Icon name='circle notched' loading />
                        <Message.Content>
                          <Message.Header>Just a moment!</Message.Header>
                          We are fetching that content for you.
                        </Message.Content>
                      </Message>
                    </div>
                      )
                    : (
                    <Card.Group>
                        {news_data.map((item)=> (
                            <Card href={ item.url } target="_blank" key={ item.key }centered raised>
                                <Image bordered src={ (item.urlToImage) ? item.urlToImage : 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fi.ytimg.com%2Fvi%2FvzchjdTNWa0%2Fmaxresdefault.jpg&f=1&nofb=1' }  />
                                <Card.Content>
                                    <Card.Header>{ item.title }</Card.Header>
                                    <Card.Meta textAlign="right">{item.author}</Card.Meta>
                                    <Card.Description>{item.description}</Card.Description>
                                </Card.Content>
                                <Card.Content textAlign="right" extra>
                                    { item.sourceName } <br />
                                    <Button style={{float: 'right'}}
                                        onClick={ (e) => this.handleBookmark(e,item)} 
                                        animated='vertical'>
                                        <Button.Content hidden><Icon name='bookmark' /></Button.Content>
                                        <Button.Content visible>
                                            <Icon name='bookmark outline' />
                                        </Button.Content>
                                    </Button>
                                </Card.Content>
                            </Card>
                        ))
                        }
                    </Card.Group>
                    ) }
                </Container>
            </div>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
      category: state.news.category,
      country: state.news.country,
      totalPage: state.news.totalPage,
      activePage: state.news.activePage,
      news_data: state.news.data,
      isNewsFetching: state.news.isNewsFetching,
      isFirstVisit: state.news.isFirstVisit
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      changeCategory: (value) => dispatch({type: newsActions.CHANGE_CATEGORY, payload: {value}}),
      changeCountry: (value) => dispatch({type: newsActions.CHANGE_COUNTRY, payload: {value}}),
      changeActivePage: (value) => dispatch({type: newsActions.CHANGE_ACTIVE_PAGE, payload: {value}}),
      changeData: () => dispatch(newsActions.fetchNews()),
      addToCollection: (news_item) => dispatch(collectionActions.saveNewsToPG(news_item)),
      toggleIsFirstVisit: (value) => dispatch({type: newsActions.TOGGLE_ISFIRSTVISIT, payload: {value} })
    };
  };

export default connect(mapStateToProps, mapDispatchToProps )(News);