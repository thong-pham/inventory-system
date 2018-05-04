import { ADD_COMPANY_STARTED, ADD_COMPANY_FULFILLED, ADD_COMPANY_REJECTED,
         GET_COMPANIES_STARTED, GET_COMPANIES_FULFILLED, GET_COMPANIES_REJECTED,
         DELETE_COMPANY_STARTED, DELETE_COMPANY_FULFILLED, DELETE_COMPANY_REJECTED,
         GET_PENDING_COMPANIES_STARTED, GET_PENDING_COMPANIES_FULFILLED, GET_PENDING_COMPANIES_REJECTED,
         UPDATE_COMPANY_STARTED, UPDATE_COMPANY_FULFILLED, UPDATE_COMPANY_REJECTED,
         SET_UPDATING_COMPANY_FULFILLED
         } from "./../actions/CompanyActions";

const initialState = {
    companies: [],
    isAddingCompany: false,
    addingCompanyError: null,
    isFetchingCompanies: false,
    fetchingCompaniesError: null,
    isDeletingCompany: false,
    deletingsCompaniesError: null,
    pendingCompanies: [],
    isFetchingPendingCompanies: false,
    fetchingPendingCompaniesError: null,
    company: null,
    isUpdatingCompany: false,
    updatingCompaniesError: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_COMPANY_STARTED: {
            return { ...state, isAddingCompany: true };
        }
        case ADD_COMPANY_FULFILLED: {
            const data = action.payload;
            const newCompany = state.companies.concat([data]);
            return { ...state, isAddingCompany: false, companies: newCompany };
        }
        case ADD_COMPANY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingCompany: false, addingCompanyError: error };
        }
        case GET_COMPANIES_STARTED: {
            return { ...state, isFetchingCompanies: true };
        }
        case GET_COMPANIES_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingCompanies: false, companies: data };
        }
        case GET_COMPANIES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingCompanies: false, fetchingCompaniesError: error };
        }
        case DELETE_COMPANY_STARTED: {
            return { ...state, isDeletingCompany: true };
        }
        case DELETE_COMPANY_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingCompany: false };
        }
        case DELETE_COMPANY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingCompany: false, deletingsCompaniesError: error };
        }
        case GET_PENDING_COMPANIES_STARTED: {
            return { ...state, isFetchingPendingCompanies: true };
        }
        case GET_PENDING_COMPANIES_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingCompanies: false, pendingCompanies: data };
        }
        case GET_PENDING_COMPANIES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingCompanies: false, fetchingPendingCompaniesError: error };
        }
        case UPDATE_COMPANY_STARTED: {
            return { ...state, isUpdatingCompany: true };
        }
        case UPDATE_COMPANY_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingCompany: false, company: null };
        }
        case UPDATE_COMPANY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingCompany: false, updatingCompaniesError: error };
        }
        case SET_UPDATING_COMPANY_FULFILLED: {
            const id = action.payload;
            const inv = state.inventories.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { company: inv });
        }
        default: {
            return state;
        }
    }
}
