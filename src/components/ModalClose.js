import React, {Component} from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { connect } from 'react-redux';

import FormComponent from './FormComponent';
import * as collectionActions from '../store/action/collectionAction';

class ModalClose extends Component{
  state = { 
    modalOpen: false,
    messageOnSave: ''
  }
  // Handles modal open and when in edit mode - sets form values
  handleOpen = async (e, news_item) => {
    e.preventDefault();
    if(news_item){
      await this.props.setFormValues(news_item);
    }
    this.setState({ modalOpen: true })
  }
  //Handles close of modal
  handleClose = () => {
    this.props.toggleIsEditing(false)
    this.setState({ modalOpen: false });
    if (this.props.isValidated) {
      this.props.toggleIsValidated();
      this.props.changeStatusCode(400);
      this.setState({messageOnSave: ''})
      this.props.clearFormValues();
    }
  }
  // Handles saving of an article in collection
  onSave = async () => {
    // creates new article to PG if in edit mode
    if (!this.props.isEditing) {
    await this.props.createNewsInPG(this.props.formValues);
    await this.props.toggleIsValidated();
    if (this.props.status === 200) {
      this.setState({ messageOnSave: 'News article added to your collection!'})
      this.props.fetchNewsFromPG();
    } else {
      this.setState({ messageOnSave: 'Fill in all the values and try again!'})
    }
    await this.props.clearFormValues();
  } else if (this.props.isEditing) { // Updates news article in PG when in update mode
      await this.props.updateNewsArticle();
      await this.props.toggleIsValidated();
      if (this.props.status === 200) {
        this.setState({ messageOnSave: 'News article added to your collection!'})
        this.props.fetchNewsFromPG();
      } else {
        this.setState({ messageOnSave: 'Fill in all the values and try again!'})
      }
      await this.props.clearFormValues();
    }
  };
  // @desc: renders a modal with form component 
  // @usage: for both edit and create article
  render() {
    return(
      <Modal trigger={<Button size={(this.props.size) ? this.props.size : 'medium'} onClick={(e) => {this.handleOpen(e, this.props.news_item)}}>{this.props.text}</Button>}
      open={this.state.modalOpen}
       closeIcon
       onClose={this.handleClose}>
        <Header icon='save' content={this.props.title} />
        <Modal.Content>
          {(!this.props.isValidated) ? <FormComponent news_item={this.props.news_item} /> : <h1>{this.state.messageOnSave}</h1>}
        </Modal.Content>
        <Modal.Actions>
        {(!this.props.isValidated) ? (<Button color='red'  onClick={this.handleClose}>
            <Icon name='remove'/> Cancel
          </Button>) :null }
          {(!this.props.isValidated) ? (<Button color='green' onClick={this.onSave}>
            <Icon name='checkmark' /> Save
          </Button>) : (<Button onClick={this.handleClose} color='blue'>Ok</Button>)}
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    formValues: state.collections.formValues,
    status: state.collections.status,
    isValidated: state.collections.isValidated,
    isEditing: state.collections.isEditing,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    createNewsInPG:(formValues) => dispatch(collectionActions.saveNewsToPG(formValues)),
    fetchNewsFromPG: () => dispatch(collectionActions.getNewsFromPG()),
    toggleIsValidated: () => dispatch({type: collectionActions.TOGGLE_IS_VALIDATED}),
    toggleIsEditing: (value) => dispatch({type: collectionActions.TOGGLE_IS_EDITING, payload: {isEditing: value}}),
    changeStatusCode: (value) => dispatch({type: collectionActions.CHANGE_STATUS, payload: {statuscode: value}}),
    updateNewsArticle: () => dispatch(collectionActions.updateNewsToPG()),
    setFormValues: (item) => dispatch({type: collectionActions.SET_FORM_VALUES, payload: {news_item: item}}),
    clearFormValues: () => dispatch({type: collectionActions.CLEAR_FORM_VALUES})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalClose);