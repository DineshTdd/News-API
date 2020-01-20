import React, {Component} from 'react';
import ModalClose from './ModalClose';
import {connect} from 'react-redux';
import {Container, Card, Image, Button, Icon } from 'semantic-ui-react';
import * as collectionActions from '../store/action/collectionAction';

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

    render() {
        const {news_data} = this.props;
        return (
            <div>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <ModalClose title={'Create News Article'} news_item={''} text={'Create Article'} />
            </div>
            <div style={{margin: '10px'}}>
                <Container>
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
                                <Card.Content textAlign="right" extra>
                                    {item.source} <br />
                                    <Button animated='horizontal' size='small' onClick={ (e) => this.handleDelete(e,item.articleurl)}><Button.Content hidden><Icon name='trash' /></Button.Content>
                                        <Button.Content visible>
                                            <Icon name='trash alternate outline' />
                                        </Button.Content></Button>
                                    <ModalClose title={'Update News Article'} news_item={item} size={'mini'} text={<Icon name='edit'/>} ></ModalClose>
                                </Card.Content>
                            </Card>
                        ))
                        }
                    </Card.Group>
                </Container>
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        news_data: state.collections.newsCollection
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchNewsFromPG: () => dispatch(collectionActions.getNewsFromPG()),
        deleteNewsFromPG: (articleurl) => dispatch(collectionActions.deleteNewsFromPG(articleurl)),
        toggleIsEditing: () => dispatch({type: collectionActions.TOGGLE_IS_EDITING}),
        setFormValues: (item) => dispatch({type: collectionActions.SET_FORM_VALUES, payload: {news_item: item}}),
        updateNewsArticle: () => dispatch(collectionActions.updateNewsToPG()),
        clearFormValues: () => dispatch({type: collectionActions.CLEAR_FORM_VALUES})
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Collection);