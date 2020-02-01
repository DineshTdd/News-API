import React, {Component} from 'react'
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';

import * as collectionActions from '../store/action/collectionAction';

class FormComponent extends Component {
    state = {
        formValues: {
            author: this.props.formValues.author,
            title: this.props.formValues.title,
            imageUrl: this.props.formValues.imageUrl,
            description: this.props.formValues.description,
            articleUrl: this.props.formValues.articleUrl,
            sourceName: this.props.formValues.sourceName
        }
    }
    checkImage(src) {
      var img = new Image();
      img.src = src.target.value;
      img.onload = function() {
        return;
      };
      img.onerror = function() {
        alert('Please enter a valid image URL')
      };
    }
    
    async isValidURL(string) {
      var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
      if (res !== null) {this.props.changeIsFormValid(true); return;}
      await this.props.changeIsFormValid(false);
      await alert('Please enter a valid URL')
    };
  // @desc: Form is rendered within a modal
  // @usage: for both creating and editing article in collection
  render() {
    return (
    <Form>
    <Form.Field>
    <Form.Field>
      <label>Author</label>
      <input placeholder='Author' defaultValue={(this.props.news_item !== '') ? this.props.news_item.author : ''} onChange={async (event) => { 
        await this.setState({formValues: {...this.state.formValues, author: event.target.value}});
        this.props.updateStoreFormValues(this.state.formValues);
      }
        } />
    </Form.Field>
      <label>Title</label>
      <input placeholder='Title' defaultValue={(this.props.news_item !== '') ? this.props.news_item.title : ''} onChange={async (event) => {
        await this.setState({formValues: {...this.state.formValues, title: event.target.value}});
        this.props.updateStoreFormValues(this.state.formValues);
        }} />
    </Form.Field>
    <Form.Field>
      <label>Image Url</label>
      <input placeholder='Image Url' defaultValue={(this.props.news_item !== '') ? this.props.news_item.imageurl : ''} 
      onBlur={(e) => this.checkImage(e)}
      onChange={async (event) => {
        await this.setState({formValues: {...this.state.formValues, imageUrl: event.target.value}});
        this.props.updateStoreFormValues(this.state.formValues);
        }} />
    </Form.Field>
    <Form.Field>
      <label>Description</label>
      <input placeholder='Description' defaultValue={(this.props.news_item !== '') ? this.props.news_item.description : ''} onChange={async (event) => {
        await this.setState({formValues: {...this.state.formValues, description: event.target.value}});
        this.props.updateStoreFormValues(this.state.formValues);
        }} />
    </Form.Field>
    <Form.Field >
      <label>Article Url</label>
      <input disabled={(this.props.isEditing) ? true : false} placeholder='Article Url' defaultValue={(this.props.news_item !== '') ? this.props.news_item.articleurl : ''} 
      onBlur={(e) => this.isValidURL(e.target.value)}
      onChange={async (event) => {
        await this.setState({formValues: {...this.state.formValues, articleUrl: event.target.value}});
        this.props.updateStoreFormValues(this.state.formValues);
        }} />
    </Form.Field>
    <Form.Field>
      <label>Source</label>
      <input placeholder='Source' defaultValue={(this.props.news_item !== '') ? this.props.news_item.source : ''} onChange={async (event) => {
        await this.setState({formValues: {...this.state.formValues, sourceName: event.target.value}})
        this.props.updateStoreFormValues(this.state.formValues);
      }} />
    </Form.Field>

  </Form>
)
    }
}

const mapStateToProps = state => {
    return {
      formValues: state.collections.formValues,
      isEditing: state.collections.isEditing,
      isFormValid: state.collections.isFormValid
    };
  };
  
const mapDispatchToProps = dispatch => {
    return {
         updateStoreFormValues:(formValues) => dispatch({type: collectionActions.UPDATE_FORM_VALUES, payload: {formValues}}),
         changeIsFormValid: (value) => dispatch({type: collectionActions.CHANGE_ISFORMVALID, payload: {value}})
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(FormComponent);