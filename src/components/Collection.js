import React, {Component} from 'react';
import ModalClose from './ModalClose';
import {connect} from 'react-redux';
import {Container, Card, Image, Button, Icon, Rating, Message, Modal, Responsive, Segment } from 'semantic-ui-react';
import * as collectionActions from '../store/action/collectionAction';
import backgroundImage from '../assets/torn-newspaper.jpg'

class Collection extends Component {

    constructor(props) {
        super(props)
        this.handleButtonPress = this.handleButtonPress.bind(this)
        this.handleButtonRelease = this.handleButtonRelease.bind(this)
        this.state = {
          isModalOpen: false,
          newsSrc: '',
          newsTitle: '',
          newsImageSrc: ''
        }
      }

    async componentDidMount() {
        this.props.changeIsCollectionFetching(true);
        await this.props.fetchNewsFromPG();
        this.props.changeIsCollectionFetching(false);
    }

    // Handles user's delete request
    handleDelete = async (e,articleurl) => {
        e.preventDefault();
        await this.props.deleteNewsFromPG(articleurl);
        await this.props.fetchNewsFromPG();
    };

    // Handles user's edit request
    handleEdit = async (e, item) => {
        e.preventDefault(); 
        await this.props.setFormValues(item);
    };

    handleRate = async (e, ratingObject, articleUrl) => {
        e.preventDefault();
        const {rating: articleRating} = ratingObject;
        await this.props.updateArticleRating(articleRating, articleUrl);
        await this.props.fetchNewsFromPG();
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

    render() {
        const {news_data, isCollectionFetching} = this.props;
        const iframe = (src) => `<iframe height="400px" style="width: 100%;" scrolling="yes" title="fx." src="${src}" frameborder="no" allowtransparency="true" allowfullscreen="true"</iframe>`; 
        return (
        <div style={{  backgroundImage: `url(${backgroundImage})`, width:'100%', minHeight: '50em', height: '100%' }}>
            {
                (news_data.length === 0)
                ? (
                    <Message style={{ width: '50%', marginLeft: '25%'}} info>
                        <Message.Header>Populate your collection!</Message.Header>
                        <p>Try bookmarking news articles or create your own.</p>
                    </Message>
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
            <div style={{display:'flex',justifyContent:'center',alignItems:'center', height: '100%'}}>
                <ModalClose title={'Create News Article'} news_item={''} text={(<p>Create Article &nbsp;<Icon name='pencil alternate' /></p>)} />
            </div>
            <div style={{margin: '10px'}}>
                <Container style={{height: '100%'}}>
                    { (isCollectionFetching) ?
                    (<div style={{height: '100vh'}}>
                        <Message icon color='black' >
                            <Icon name='circle notched' loading />
                            <Message.Content>
                                <Message.Header>Just a moment!</Message.Header>
                                We are fetching that content for you.
                            </Message.Content>
                        </Message>
                    </div>)
                    : (
                    <Card.Group>
                        {news_data.map((item)=> (
                            <Card
                                onTouchStart={() => this.handleButtonPress(item.articleurl, item.title)} 
                                onTouchEnd={this.handleButtonRelease} 
                                onMouseDown={() => this.handleButtonPress(item.articleurl, item.title)} 
                                onMouseUp={this.handleButtonRelease} 
                                onMouseLeave={this.handleButtonRelease}
                                href={item.articleurl} target="_blank" key={item.publishedat} centered raised>
                                <Image 
                                bordered
                                src={
                                    (item.imageurl.trim() !== '')
                                    ? item.imageurl
                                    : 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fi.ytimg.com%2Fvi%2FvzchjdTNWa0%2Fmaxresdefault.jpg&f=1&nofb=1'
                                } />
                                <Card.Content>
                                    <Card.Header>{item.title}</Card.Header>
                                    <Card.Meta textAlign="right">{item.author}</Card.Meta>
                                    <Card.Description>{item.description}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div style={{padding: '10px'}}>
                                        <Rating defaultRating={item.articlerating} style={{float: 'left'}} maxRating={5} onRate={(e,ratingObject) => {this.handleRate(e,ratingObject,item.articleurl)}} clearable/>
                                        <p style={{float: 'right', marginTop: '1px'}}>{item.source}</p> 
                                    </div>
                                    <br />
                                    <div style={{float: 'right'}}>
                                        <Button animated='horizontal' size='small' onClick={ (e) => this.handleDelete(e,item.articleurl)}>
                                            <Button.Content hidden>
                                                <Icon name='trash' />
                                            </Button.Content>
                                            <Button.Content visible>
                                                <Icon name='trash alternate outline' />
                                            </Button.Content>
                                        </Button>
                                        <ModalClose title={'Update News Article'} news_item={item} size={'mini'} text={<Icon name='edit'/>} ></ModalClose>
                                    </div>
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
        news_data: state.collections.newsCollection,
        isCollectionFetching: state.collections.isCollectionFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchNewsFromPG: () => dispatch(collectionActions.getNewsFromPG()),
        deleteNewsFromPG: (articleurl) => dispatch(collectionActions.deleteNewsFromPG(articleurl)),
        toggleIsEditing: () => dispatch({type: collectionActions.TOGGLE_IS_EDITING}),
        setFormValues: (item) => dispatch({type: collectionActions.SET_FORM_VALUES, payload: {news_item: item}}),
        updateNewsArticle: () => dispatch(collectionActions.updateNewsToPG()),
        clearFormValues: () => dispatch({type: collectionActions.CLEAR_FORM_VALUES}),
        updateArticleRating: (rating, articleUrl) => dispatch(collectionActions.updateArticleRatingToPG(rating, articleUrl)),
        changeIsCollectionFetching: (value) => dispatch({
            type: collectionActions.CHANGE_ISCOLLECTIONFETCHING,
            payload: {value: value}
        })
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Collection);