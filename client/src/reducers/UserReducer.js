import {  ADD_USER_STARTED, ADD_USER_FULFILLED, ADD_USER_REJECTED,
          GET_USERS_STARTED, GET_USERS_FULFILLED, GET_USERS_REJECTED,
          DELETE_USER_STARTED, DELETE_USER_FULFILLED, DELETE_USER_REJECTED,
          GET_PENDING_USERS_STARTED, GET_PENDING_USERS_FULFILLED, GET_PENDING_USERS_REJECTED,
          UPDATE_USER_STARTED, UPDATE_USER_FULFILLED, UPDATE_USER_REJECTED,
          SET_UPDATING_USER_FULFILLED, CLEAR_USER_FULFILLED, CHANGE_PASSWORD, CLOSE_PASSWORD, TRACK_CURRENT, TRACK_NEW,
          CHANGE_PASSWORD_STARTED, CHANGE_PASSWORD_FULFILLED, CHANGE_PASSWORD_REJECTED,
          CHANGE_NAME, CLOSE_NAME, CHANGE_EMAIL, CLOSE_EMAIL, CHANGE_NUMBER, CLOSE_NUMBER,
          TRACK_NAME, TRACK_NUMBER, TRACK_EMAIL, ERROR_INPUT_USER,
          CHANGE_INFO_STARTED, CHANGE_INFO_FULFILLED, CHANGE_INFO_REJECTED, GET_USER,
          GET_USER_STARTED, GET_USER_FULFILLED, GET_USER_REJECTED
          } from "./../actions/UserActions";

const initialState = {
    users: [],
    user: null,
    isAddingUser: false,
    addingUserError: null,
    isFetchingUsers: false,
    fetchingUsersError: null,
    isDeletingUser: false,
    deletingsUserError: null,
    isFetchingUser: false,
    fetchingUserError: null,
    isUpdatingUser: false,
    updatingUserError: null,
    companies: [],
    passChange: false,
    currentPass: null,
    newPass: null,
    isChangingPass: false,
    changingPassError: null,
    nameChange: false,
    newName: null,
    numberChange: false,
    newNumber: null,
    emailChange: false,
    newEmail: null,
    isUpdatingInfo: false,
    updatingInfoError: null,
    errorInput: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_USER_STARTED: {
            return { ...state, isAddingUser: true };
        }
        case ADD_USER_FULFILLED: {
            const data = action.payload;
            const newUser = state.users.concat([data]);
            return { ...state, isAddingUser: false, users: newUser, addingUserError: null };
        }
        case ADD_USER_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingUser: false, addingUserError: error };
        }
        case GET_USERS_STARTED: {
            return { ...state, isFetchingUsers: true, addingUserError: null };
        }
        case GET_USERS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingUsers: false, users: data };
        }
        case GET_USERS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingUsers: false, fetchingUsersError: error };
        }
        case GET_USER_STARTED: {
            return { ...state, isFetchingUser: true };
        }
        case GET_USER_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingUser: false, user: data };
        }
        case GET_USER_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingUser: false, fetchingUserError: error };
        }
        case DELETE_USER_STARTED: {
            return { ...state, isDeletingUser: true };
        }
        case DELETE_USER_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingUser: false };
        }
        case DELETE_USER_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingUser: false, deletingsUserError: error };
        }
        case UPDATE_USER_STARTED: {
            return { ...state, isUpdatingUser: true };
        }
        case UPDATE_USER_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingUser: false, user: null };
        }
        case UPDATE_USER_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingUser: false, updatingUserError: error };
        }
        case SET_UPDATING_USER_FULFILLED: {
            const id = action.payload;
            const newUser = state.users.filter(function (element) {
                return element.id == id;
            })[0];
            return {...state, user: newUser };
        }
        case CLEAR_USER_FULFILLED:{
            return { ...state, user: null };
        }
        case CHANGE_PASSWORD_STARTED: {
           return {...state, isChangingPass : true};
        }
        case CHANGE_PASSWORD_FULFILLED: {
           const data = action.payload;
           alert(data);
           return {...state, isChangingPass : false, passChange: false};
        }
        case CHANGE_PASSWORD_REJECTED: {
            const error = action.payload.data
           return {...state, isChangingPass : false, changingPassError: error};
        }
        case CHANGE_INFO_STARTED: {
           return {...state, isUpdatingInfo : true};
        }
        case CHANGE_INFO_FULFILLED: {
           const data = action.payload;
           return {...state, isUpdatingInfo : false, nameChange: false, numberChange: false, emailChange: false};
        }
        case CHANGE_INFO_REJECTED: {
            const error = action.payload.data
           return {...state, isUpdatingInfo : false, updatingInfoError: error, nameChange: false, numberChange: false, emailChange: false};
        }
        case GET_USER: {
            const data = action.payload;
            return {...state, user: data};
        }
        case CHANGE_PASSWORD: {
           return {...state, passChange : true, nameChange: false, numberChange: false, emailChange: false};
        }
        case CLOSE_PASSWORD: {
           return {...state, passChange : false, changingPassError: null, currentPass: null, newPass: null, errorInput: null};
        }
        case CHANGE_NAME: {
           return {...state, nameChange : true, passChange: false, numberChange: false, emailChange: false};
        }
        case CLOSE_NAME: {
           return {...state, nameChange : false, changingNameError: null, newName: null, errorInput: null};
        }
        case CHANGE_NUMBER: {
           return {...state, numberChange : true, passChange: false, nameChange: false, emailChange: false};
        }
        case CLOSE_NUMBER: {
           return {...state, numberChange : false, changingNumberError: null, newNumber: null, errorInput: null};
        }
        case CHANGE_EMAIL: {
           return {...state, emailChange : true, passChange: false, nameChange: false, numberChange: false};
        }
        case CLOSE_EMAIL: {
           return {...state, emailChange : false, changingEmailError: null, newEmail: null, errorInput: null};
        }
        case TRACK_CURRENT: {
           const data = action.payload;
           return {...state, currentPass : data};
        }
        case TRACK_NEW: {
           const data = action.payload;
           return {...state, newPass : data};
        }
        case TRACK_NAME: {
           const data = action.payload;
           return {...state, newName : data};
        }
        case TRACK_NUMBER: {
           const data = action.payload;
           return {...state, newNumber : data};
        }
        case TRACK_EMAIL: {
           const data = action.payload;
           return {...state, newEmail : data};
        }
        case ERROR_INPUT_USER: {
            const error = "Invalid Input";
            return {...state, errorInput: error };
        }
        default: {
            return state;
        }
    }
}
