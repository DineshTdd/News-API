import React, {Component} from 'react';
import ModalClose from './ModalClose';
import {connect} from 'react-redux';
import {Container, Card, Image, Button, Icon, Rating, Message } from 'semantic-ui-react';
import * as collectionActions from '../store/action/collectionAction';
import backgroundImage from '../assets/torn-newspaper.jpg'

class Collection extends Component {
    componentDidMount() {
        this.props.fetchNewsFromPG();
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

    render() {
        const {news_data, isCollectionFetching} = this.props;
        return (
        <div style={{  backgroundImage: `url(${backgroundImage})`, width:'100%', height: '100%' }}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <ModalClose title={'Create News Article'} news_item={''} text={'Create Article'} />
            </div>
            <div style={{margin: '10px'}}>
                <Container>
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
                            <Card href={item.articleurl} target="_blank" key={item.publishedat} centered raised>
                                <Image 
                                bordered
                                src={
                                    item.imageurl
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
        updateArticleRating: (rating, articleUrl) => dispatch(collectionActions.updateArticleRatingToPG(rating, articleUrl))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Collection);