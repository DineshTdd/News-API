import * as todoActions from '../action/_todo';

// Setting up the local storage
if(localStorage.getItem('todoList') === null || localStorage.getItem('todoActiveList') === null || localStorage.getItem('todoCompletedList') === null) {
    localStorage.setItem('todoList', JSON.stringify([]));
    localStorage.setItem('todoActiveList', JSON.stringify([]));
    localStorage.setItem('todoCompletedList', JSON.stringify([]));
}

const tl = JSON.parse(localStorage.getItem('todoList')) || [];
const tal = JSON.parse(localStorage.getItem('todoActiveList')) || [];
const tcl = JSON.parse(localStorage.getItem('todoCompletedList')) || [];

const initialState = {
    todoList: tl,
    todoActiveList: tal,
    todoCompletedList: tcl
};

export default ( state = initialState, action ) => {
    switch ( action.type ) {
        case todoActions.ADD_TODO:
            var len = state.todoList.length;
            localStorage.setItem('todoList', JSON.stringify(state.todoList.concat({id: (len + 1),todo: action.payload.todo, completed: false})));
            return {
                ...state,
                todoList: state.todoList.concat({id: (len + 1),todo: action.payload.todo, completed: false})
            };
        case todoActions.DELETE_TODO:
            var newArray = state.todoList.filter(x => (x.id !== action.payload.id))
            var count = 0;
            newArray = newArray.map(x => {
                x.id = ++count
                return x;                
            })
            localStorage.setItem('todoList', JSON.stringify(newArray));
            return {
                ...state,
                todoList: newArray
            }
        case todoActions.ALL_TODOS:
            localStorage.setItem('todoList', JSON.stringify(state.todoList.filter(x => x)))
            return {
                ...state,
                todoList: state.todoList.filter(x => x)
            }
        case todoActions.ACTIVE_TODOS:
            localStorage.setItem('todoActiveList', JSON.stringify(state.todoList.filter(x => !x.completed)))
            return {
                ...state,
                todoActiveList: state.todoList.filter(x => !x.completed)
            }
        case todoActions.COMPLETED_TODOS:
            localStorage.setItem('todoCompletedList', JSON.stringify(state.todoList.filter(x => x.completed)))
            return {
                ...state,
                todoCompletedList: state.todoList.filter(x => x.completed)
            }
        case todoActions.CLEAR_COMPLETED_TODOS:
            localStorage.setItem('todoList', JSON.stringify(state.todoList.filter(x => !x.completed)))
            localStorage.setItem('todoCompletedList', JSON.stringify([]))
            return {
                ...state,
                todoList: state.todoList.filter(x => !x.completed),
                todoCompletedList: []
            }
        case todoActions.TOGGLE_COMPLETED:
            localStorage.setItem('todoList', JSON.stringify(state.todoList.map( x => {
                if (x.id === action.payload.id) {
                    let newx= x;
                    newx.completed = !newx.completed
                    return newx;
                } else {
                    return x;
                }
            })))
            return {
                ...state,
                todoList: JSON.parse(localStorage.getItem('todoList'))
            }
        case todoActions.EDIT_TODO:
            localStorage.setItem('todoList', JSON.stringify(state.todoList.map( x => {
                if (x.id === action.payload.id) {
                    let newx= x;
                    newx.completed = false
                    newx.todo = action.payload.todo
                    return newx;
                } else {
                    return x;
                }
            })))
            return {
                ...state,
                todoList: JSON.parse(localStorage.getItem('todoList'))
            }
        default:
            return state;
    }
};
