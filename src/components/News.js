import React, {Component} from 'react';
import {Segment, Responsive, Container, Card, Image, Pagination, Button, Icon, Message, Modal } from 'semantic-ui-react';
import SpringCard from './SpringCard';
import {connect} from 'react-redux';
import backgroundImage from '../assets/newspaper-pieces-vintage.jpg';
import './Styles/TextTruncate.css';

import * as newsActions from '../store/action/action';
import * as collectionActions from '../store/action/collectionAction';

class News extends Component {

  constructor(props) {
    super(props)
    this.handleButtonPress = this.handleButtonPress.bind(this)
    this.handleButtonRelease = this.handleButtonRelease.bind(this)
    this.state = {
      category: '',
      country: '',
      totalPage: 10,
      activePage:1,
      news_data: this.props.news_data,
      isWelcomeMessageVisible: true,
      isFirstVisit: this.props.isFirstVisit,
      isModalOpen: false,
      newsSrc: '',
      newsTitle: '',
      newsImageSrc: ''
    }
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

    handleButtonPress (newsSrc, newsTitle) {
      this.buttonPressTimer = setTimeout(() => {
        this.setState({isModalOpen: true, newsSrc, newsTitle})
      }, 1000);
    }
  
    handleButtonRelease () {
      clearTimeout(this.buttonPressTimer);
    }

    close = () => this.setState({ isModalOpen: false })

    Iframe = (props) => {
      return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
    }

    // Renders news item fetched from NEWSAPI
    render () {
        const {news_data} = this.props;
        const iframe = (src) => `<iframe height="400px" style="width: 100%;" scrolling="yes" title="fx." src="${src}" frameborder="no" allowtransparency="true" allowfullscreen="true"</iframe>`; 
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
              {(this.state.isModalOpen)
                ? (
                  <Modal size='large' dimmer='blurring' open={this.state.isModalOpen} onClose={this.close} closeIcon>
                    <Modal.Header>{this.state.newsTitle}</Modal.Header>
                    <Modal.Content style={{ height: '100%', width: '100%' }}>
                      <Modal.Description style={{ height: '100%', width: '100%' }}>
                      <Segment.Group style={{ height: '100%', width: '100%' }} raised>
                        <Responsive as={Segment}><this.Iframe iframe={iframe(this.state.newsSrc)} /></Responsive>
                      </Segment.Group>
                      </Modal.Description>
                    </Modal.Content>
                  </Modal>
                )
                : (null)
              }
            <div style={{display:'flex',justifyContent:'center',alignItems:'center', paddingTop: '20px', paddingBottom: '20px'}}>
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
                    <Card.Group doubling centered stackable>
                        {news_data.map((item)=> (
                          <SpringCard key={ item.key }>
                          <Card style={{ width: '100%' }}
                              onTouchStart={() => this.handleButtonPress(item.url, item.title)} 
                              onTouchEnd={this.handleButtonRelease} 
                              onMouseDown={() => this.handleButtonPress(item.url, item.title)} 
                              onMouseUp={this.handleButtonRelease} 
                              onMouseLeave={this.handleButtonRelease}
                              href={ item.url } target="_blank" centered raised>
                                <Image bordered src={ (item.urlToImage) ? item.urlToImage : 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fi.ytimg.com%2Fvi%2FvzchjdTNWa0%2Fmaxresdefault.jpg&f=1&nofb=1' }  />
                                <Card.Content>
                                    <Card.Header>{ item.title }</Card.Header>
                                    <Card.Meta textAlign="right">{item.author}</Card.Meta>
                                    <Card.Description className="multiline-ellipsis">{item.description}</Card.Description>
                                </Card.Content>
                                <Card.Content textAlign="right" extra>
                                    { item.sourceName } <br />
                                    <Button style={{float: 'right', height: '25px'}}
                                        onClick={ (e) => this.handleBookmark(e,item)} 
                                        animated='vertical'>
                                        <Button.Content hidden><Icon name='bookmark' /></Button.Content>
                                        <Button.Content visible>
                                            <Icon name='bookmark outline' />
                                        </Button.Content>
                                    </Button>
                                </Card.Content>
                            </Card>
                            </SpringCard>
                        ))
                        }
                    </Card.Group>
                    ) }
                </Container>
                {(this.props.isNewsFetching) ? 
                     (
                    <div style={{ paddingLeft: '5%', paddingRight: '5%'}}>
                        <Message icon color='black' >
                        <Icon name='circle notched' loading />
                        <Message.Content>
                          <Message.Header>Just a moment!</Message.Header>
                          We are fetching that content for you.
                        </Message.Content>
                      </Message>
                    </div>) : (null) }
            </div>   
            <div style={{display:'flex',justifyContent:'center',alignItems:'center', paddingTop: '20px',paddingBottom: '20px'}}>
                <Pagination
                inverted
                activePage={this.props.activePage}
                onPageChange={async (e, {activePage}) => {
                    this.props.changeActivePage(activePage);
                    await this.props.changeData();
                }}
                totalPages={this.props.totalPage} />
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

// eslint-disable-next-line no-lone-blocks
{/* <Iframe url={item.url}
                          width="450px"
                          height="450px"
                          id="myId"
                          className="myClassname"
                          display="initial"
                          position="relative"/>  */}