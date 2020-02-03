import React, {Component} from 'react';
import './todo.css';
import { connect } from 'react-redux';

import Card from '../Card/Card';
import * as todoActions from '../../store/action/_todo';


class Todo extends Component {
    // Local State
    state = {
        todoInput: '',
        todoList: this.props.todoList.slice(0),
        isSwiping: false,
        todoEditId: 0,
        todoEditInput: ''
    }

    //Handling Long press event for editing todos
    handleButtonPress = this.handleButtonPress.bind(this)
    handleButtonRelease = this.handleButtonRelease.bind(this)
      handleButtonPress (id, todo) {
        this.buttonPressTimer = setTimeout(() => {
            this.setState({todoEditId: id, todoEditInput: todo});
        }, 1000);
      }
    
      handleButtonRelease () {
        clearTimeout(this.buttonPressTimer);
      }

    handleKeyPress = async (event) => {
        if(event.key === 'Enter') {
            if ((this.state.todoInput.trim()).length === 0) {
                this.setState({todoInput: ''});
                return;
            }
            await this.props.onAddTodo(this.state.todoInput);
            await this.props.getActiveTodos();
            this.props.getCompletedTodos();
            this.setState({todoInput: '', todoList: this.props.todoList.filter(x => x)});
        }
    };

    //Deleting todo
    onDelete = async (id) => {
        await this.props.onDeleteTodo(id);
        this.setState({todoList: this.props.todoList.filter(x => x), todoEditId: 0, todoEditInput: ''});
    };

    //Adding todo
    todoInputChangeHandler = (event) => {
        this.setState({todoInput: event.target.value});
    };

    //Fetching all todos from Redux Store and setting local state
    allTodos = async () => {
        await this.props.getAllTodos();
        this.setState({todoList: this.props.todoList.filter(x => x), todoEditId: 0, todoEditInput: ''});
    };

    //Fetching only Active todos from Redux Store and setting local state
    activeTodos = async () => {
        await this.props.getActiveTodos();
        this.setState({todoList: this.props.todoActiveList.filter(x => x), todoEditId: 0, todoEditInput: ''});
    };

    //Fetching Completed todos from Redux Store and local state
    completedTodos = async () => {
        await this.props.getCompletedTodos();
        this.setState({todoList: this.props.todoCompletedList.filter(x => x), todoEditId: 0, todoEditInput: ''});
    };

    //Clearing the completed todos from list
    clearCompletedTodos = async () => {
        await this.props.clearCompletedTodos();
        await this.props.getCompletedTodos();
        await this.props.getAllTodos();
        this.setState({todoList: this.props.todoList.filter(x => x), todoEditId: 0, todoEditInput: ''});
    };

    //Swipe each todo to toggle between active/complete state
    toggleCompleted = async (id) => {
        await this.props.onToggleCompleted(id);
        await this.props.getAllTodos();
        await this.props.getCompletedTodos();
        await this.props.getActiveTodos();
        this.setState({todoList: this.props.todoList.filter(x => x), todoEditId: 0, todoEditInput: ''});
    }

    //After long press todo edit is captured and handled
    todoEditChangeHandler = (event) => {
        this.setState({todoEditInput: event.target.value})
    }

    handleEditKeyPress = async (event) => {
        if(event.key === 'Enter') {
            if ((this.state.todoEditInput.trim()).length === 0) {
                this.setState({todoEditInput: ''});
                this.setState({todoEditId: 0});
                await this.props.getAllTodos();
                await this.props.getActiveTodos();
                await this.props.getCompletedTodos();
                return;
            }
            await this.props.onEditTodo(this.state.todoEditId, this.state.todoEditInput);
            await this.props.getAllTodos();
            await this.props.getActiveTodos();
            await this.props.getCompletedTodos();
            this.setState({todoEditInput: '', todoEditId: 0, todoList: this.props.todoList.filter(x => x)});
        }
    };

    render () {
        let Footer;
        // Finding out whether active todos exists
        let activeItemIndicator = (<div className="item-indicator">
        <span>{this.props.todoActiveList.length} {(this.props.todoActiveList.length === 1)? 'item left' : 'items left'}</span>
        </div>) ;
        // Checking whether completed todos exist and loading clear completed option
        let clearCompleted = '';
        if (this.props.todoCompletedList.length > 0) {
            clearCompleted = (<div className="clear-completed">
                <button onClick={this.clearCompletedTodos} title="Clear completed" className="clear-button" type="button">Clear</button>
            </div>);
        }

        // Setting up footer based on todoList
        if (this.props.todoList.length === 0) {
            Footer = '';
        } else {
            if (this.props.todoList.length === 0) {
                activeItemIndicator = '';
            }
            Footer = (<div className="Footer">
            {activeItemIndicator}               
            <div className="button-container">
                <button type="button" onClick={this.allTodos}>All</button>
                <button type="button" onClick={this.activeTodos}>Active</button>
                <button type="button" onClick={this.completedTodos}>Completed</button>
            </div>
            {clearCompleted}
            </div>);
        }
        return (
        <div>
            <h1 className="App">Todos</h1>
        <div className="flex-container">
            <div className="container">
            <Card className="backdrop dimension">
                <div>
                <div className="Header">
                    <input type="text"
                        onClick={() => {this.setState({todoEditInput: '', todoEditId: 0})}}
                        onChange={this.todoInputChangeHandler} 
                        onKeyPress={this.handleKeyPress} 
                        value={this.state.todoInput} 
                        placeholder="What needs to be done?"
                    />
                </div>
                <div className="card-content">
                    <div className="todos-container">
                    {this.state.todoList.slice(0).reverse().map(todo => (
                        // Capturing swipe and long press events for both PC and Mobile
                        <div className="item-container" key={todo.id}
                        onMouseDown={() => {
                            this.setState({isSwiping: false});
                            this.handleButtonPress(todo.id, todo.todo);
                          }}
                          onMouseMove={() => {
                              this.setState({isSwiping: true});
                          }}
                          onMouseUp={e => {
                              this.handleButtonRelease();
                            if (this.state.isSwiping && e.button === 0) {
                              this.toggleCompleted(todo.id)
                            }
                            this.setState({isSwiping: false});
                          }}
                          onMouseLeave={this.handleButtonRelease}
                          onTouchStart={() => {
                              this.setState({isSwiping: false});
                              this.handleButtonPress(todo.id, todo.todo);
                          }}
                          onTouchMove={() => {
                              this.setState({isSwiping: true});
                          }}
                          onTouchEnd={e => {
                            this.handleButtonRelease();
                            if (this.state.isSwiping) {
                              this.toggleCompleted(todo.id)
                            }
                            this.setState({isSwiping: false});
                          }}
                        >
                        <div  className="todos">
                            {/* Rendering todo item based on edit mode or normal mode */}
                            <div className="todo-item">
                            {
                                (todo.id === this.state.todoEditId) ?
                                <input 
                                    ref={input => input && input.focus()}
                                    type="text" defaultValue={todo.todo}
                                    onKeyPress={this.handleEditKeyPress}
                                    onChange={this.todoEditChangeHandler}
                                    onFocus={() => {this.setState({todoEditInput: todo.todo, todoEditId: todo.id})}}
                                    onBlur={() => {this.setState({todoEditInput: '', todoEditId: 0})}}
                                />
                                : <div className={todo.completed ? 'strike apply' : 'strike'}>{todo.todo}</div>
                            }
                            </div>
                            <div className="delete-button-container">
                                <div>
                            <button className="delete-button" onClick={() => {this.onDelete(todo.id)}} type="button">X</button>
                                </div>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                {Footer}
                </div>
            </Card>
             </div>
        </div>
        </div>
    );
    };
};


const mapStateToProps = state => {
    return {
        todoList: state.todo.todoList,
        todoActiveList: state.todo.todoActiveList,
        todoCompletedList: state.todo.todoCompletedList
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddTodo: (todo) => dispatch({type: todoActions.ADD_TODO, payload: {todo}}),
        onDeleteTodo: (id) => dispatch({type: todoActions.DELETE_TODO, payload: {id}}),
        getAllTodos: () => dispatch({type: todoActions.ALL_TODOS}),
        getActiveTodos: () => dispatch({type: todoActions.ACTIVE_TODOS}),
        getCompletedTodos: () => dispatch({type: todoActions.COMPLETED_TODOS}),
        clearCompletedTodos: () => dispatch({type: todoActions.CLEAR_COMPLETED_TODOS}),
        onToggleCompleted: (id) => dispatch({type: todoActions.TOGGLE_COMPLETED, payload: {id}}),
        onEditTodo: (id, todo) => dispatch({type: todoActions.EDIT_TODO, payload: {id, todo}})
    };
};

// Connecting Store State to Component Props
export default connect(mapStateToProps, mapDispatchToProps)(Todo);