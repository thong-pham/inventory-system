import { USER_LOGIN_STARTED, USER_LOGIN_FULFILLED, USER_LOGIN_REJECTED, USER_LOGOUT_FULFILLED } from "./../actions/AuthActions";
import { USER_REGISTER_STARTED, USER_REGISTER_FULFILLED, USER_REGISTER_REJECTED } from "./../actions/AuthActions";
import { VIEW_COMPANIES } from "./../actions/AuthActions";

const initialState = {
    token: null,
    user: null,
    isLoggingIn: false,
    loggingInError: null,
    isRegisteringIn: false,
    registeringInError: null,
    companies: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case "persist/REHYDRATE": {
            const data = action.payload;          
            if (data) {
              data.auth.loggingInError = null;
              return {...state, ...data.auth};
            }
            return state;
        }
        case USER_LOGIN_STARTED: {
            return { ...state, isLoggingIn: true };
        }
        case USER_LOGIN_FULFILLED: {
            const { user, token } = action.payload;
            return { ...state, isLoggingIn: false, loggingInError: null, user: user, token: token };
        }
        case USER_LOGIN_REJECTED: {
            const error = action.payload.data;
            return { ...state, isLoggingIn: false, loggingInError: error };
        }
        case USER_LOGOUT_FULFILLED: {
            return { ...state, token: null, user: null };
        }
        case USER_REGISTER_STARTED: {
            return { ...state, isLoggingIn: true };
        }
        case USER_REGISTER_FULFILLED: {
            const { user, token } = action.payload;
            return { ...state, isLoggingIn: false, loggingInError: null, user: user, token: token };
        }
        case USER_REGISTER_REJECTED: {
            const error = action.payload.data;
            return { ...state, isLoggingIn: false, loggingInError: error };
        }
        case VIEW_COMPANIES: {
           const data = action.payload;
           return {...state, companies : data};
        }
        default: {
            return state;
        }
    }
}
