import { ADD_FEATURE_STARTED, ADD_FEATURE_FULFILLED, ADD_FEATURE_REJECTED,
          GET_QUALITY_STARTED, GET_QUALITY_FULFILLED, GET_QUALITY_REJECTED,
          GET_TYPE_STARTED, GET_TYPE_FULFILLED, GET_TYPE_REJECTED,
          GET_PATTERN_STARTED, GET_PATTERN_FULFILLED, GET_PATTERN_REJECTED,
          GET_COLOR_STARTED, GET_COLOR_FULFILLED, GET_COLOR_REJECTED,
          GET_SIZE_STARTED, GET_SIZE_FULFILLED, GET_SIZE_REJECTED,
          GET_UNIT_STARTED, GET_UNIT_FULFILLED, GET_UNIT_REJECTED,
          CHANGE_FEATURE_STARTED, CHANGE_FEATURE_FULFILLED, CHANGE_FEATURE_REJECTED,
          DELETE_FEATURE_STARTED, DELETE_FEATURE_FULFILLED, DELETE_FEATURE_REJECTED,
          ADD_QUALITY, ADD_TYPE, ADD_PATTERN, ADD_COLOR, ADD_SIZE, ADD_UNIT,
          CLOSE_QUALITY, CLOSE_TYPE, CLOSE_PATTERN, CLOSE_COLOR, CLOSE_SIZE, CLOSE_UNIT,
          CHOOSE_QUALITY, CHOOSE_TYPE, CHOOSE_PATTERN, CHOOSE_COLOR, CHOOSE_SIZE, CHOOSE_UNIT, CHOOSE_COLOR_FOR_SUB,
          INPUT_KEY, INPUT_DESC, FILL_DATA, CLEAR_DATA, ERROR_INPUT_FEATURE, CLEAR_ALL_FEATURES
          } from "./../actions/FeatureActions";

const initialState = {
    features: [],
    qualities: [],
    types: [],
    patterns: [],
    colors: [],
    sizes: [],
    units: [],
    quality: null,
    type: null,
    pattern: null,
    color: [],
    colorForSub: null,
    size: null,
    unit: null,
    isFetchingQuality: false,
    fetchingQualityError: null,
    isFetchingType: false,
    fetchingTypeError: null,
    isFetchingPattern: false,
    fetchingPatternError: null,
    isFetchingColor: false,
    fetchingColorError: null,
    isFetchingSize: false,
    fetchingSizeError: null,
    isFetchingUnit: false,
    fetchingUnitError: null,
    isAddingFeature: false,
    addingFeatureError: null,
    isChangingFeature: false,
    changingFeatureError: null,
    isDeletingFeature: false,
    deletingFeatureError: null,
    addQuality: false,
    addType: false,
    addPattern: false,
    addColor: false,
    addSize: false,
    addUnit: false,
    key: null,
    description: null,
    currentId: null,
    generatedSku: null,
    addButton: false,
    updateButton: false,
    errorInput: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_FEATURE_STARTED: {
            return { ...state, isAddingFeature: true };
        }
        case ADD_FEATURE_FULFILLED: {
            const data = action.payload;
            return { ...state, isAddingFeature: false, addQuality: false, addType: false, addPattern: false,
                      addColor: false, addSize: false, addUnit: false, addingFeatureError: null };
        }
        case ADD_FEATURE_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingFeature: false, addingFeatureError: error, addQuality: false, addType: false, addPattern: false,
                      addColor: false, addSize: false, addUnit: false };
        }
        case GET_QUALITY_STARTED: {
            return { ...state, isFetchingQuality: true };
        }
        case GET_QUALITY_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingQuality: false, qualities: data };
        }
        case GET_QUALITY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingQuality: false, fetchingQualityError: error };
        }
        case GET_TYPE_STARTED: {
            return { ...state, isFetchingType: true };
        }
        case GET_TYPE_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingType: false, types: data };
        }
        case GET_TYPE_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingType: false, fetchingTypeError: error };
        }
        case GET_PATTERN_STARTED: {
            return { ...state, isFetchingPattern: true };
        }
        case GET_PATTERN_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPattern: false, patterns: data };
        }
        case GET_PATTERN_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPattern: false, fetchingPatternError: error };
        }
        case GET_COLOR_STARTED: {
            return { ...state, isFetchingColor: true };
        }
        case GET_COLOR_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingColor: false, colors: data };
        }
        case GET_COLOR_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingColor: false, fetchingColorError: error };
        }
        case GET_SIZE_STARTED: {
            return { ...state, isFetchingSize: true };
        }
        case GET_SIZE_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingSize: false, sizes: data };
        }
        case GET_SIZE_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingSize: false, fetchingSizeError: error };
        }
        case GET_UNIT_STARTED: {
            return { ...state, isFetchingUnit: true };
        }
        case GET_UNIT_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingUnit: false, units: data };
        }
        case GET_UNIT_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingUnit: false, fetchingUnitError: error };
        }
        case CHANGE_FEATURE_STARTED: {
            return { ...state, isChangingFeature: true };
        }
        case CHANGE_FEATURE_FULFILLED: {
            const data = action.payload;
            return { ...state, isChangingFeature: false, addQuality: false, addType: false, addPattern: false,
                      addColor: false, addSize: false, addUnit: false, changingFeatureError: null };
        }
        case CHANGE_FEATURE_REJECTED: {
            const error = action.payload.data;
            return { ...state, isChangingFeature: false, changingFeatureError: error, addQuality: false, addType: false, addPattern: false,
                      addColor: false, addSize: false, addUnit: false };
        }
        case DELETE_FEATURE_STARTED: {
            return { ...state, isDeletingFeature: true };
        }
        case DELETE_FEATURE_FULFILLED:{
            return { ...state, isDeletingFeature: false, deletingFeatureError: null };
        }
        case DELETE_FEATURE_REJECTED: {
            const err = action.payload;
            return { ...state, isDeletingFeature: false, deletingFeatureError: err };
        }
        case ADD_QUALITY : {
           const data = action.payload;
           return { ...state, addQuality: true, addingFeatureError: null, addButton: data.addButton, updateButton: data.updateButton };
        }
        case ADD_TYPE : {
            const data = action.payload;
           return { ...state, addType: true, addingFeatureError: null, addButton: data.addButton, updateButton: data.updateButton };
        }
        case ADD_PATTERN : {
            const data = action.payload;
           return { ...state, addPattern: true, addingFeatureError: null, addButton: data.addButton, updateButton: data.updateButton };
        }
        case ADD_COLOR : {
            const data = action.payload;
           return { ...state, addColor: true, addingFeatureError: null, addButton: data.addButton, updateButton: data.updateButton };
        }
        case ADD_SIZE : {
            const data = action.payload;
           return { ...state, addSize: true, addingFeatureError: null, addButton: data.addButton, updateButton: data.updateButton };
        }
        case ADD_UNIT : {
            const data = action.payload;
           return { ...state, addUnit: true, addingFeatureError: null, addButton: data.addButton, updateButton: data.updateButton };
        }
        case CLOSE_QUALITY : {
           return { ...state, addQuality: false, addingFeatureError: null, errorInput: null };
        }
        case CLOSE_TYPE : {
           return { ...state, addType: false, addingFeatureError: null, errorInput: null };
        }
        case CLOSE_PATTERN : {
           return { ...state, addPattern: false, addingFeatureError: null, errorInput: null};
        }
        case CLOSE_COLOR : {
           return { ...state, addColor: false, addingFeatureError: null, errorInput: null };
        }
        case CLOSE_SIZE : {
           return { ...state, addSize: false, addingFeatureError: null, errorInput: null };
        }
        case CLOSE_UNIT : {
           return { ...state, addUnit: false, addingFeatureError: null, errorInput: null };
        }
        case CHOOSE_QUALITY:{
            const data = action.payload;
            return { ...state, quality: data};
        }
        case CHOOSE_TYPE:{
            const data = action.payload;
            return { ...state, type: data};
        }
        case CHOOSE_PATTERN:{
            const data = action.payload;
            return { ...state, pattern: data};
        }
        case CHOOSE_COLOR:{
            const data = action.payload;
            return { ...state, color: data};
        }
        case CHOOSE_COLOR_FOR_SUB:{
            const data = action.payload;
            return { ...state, colorForSub: data};
        }
        case CHOOSE_SIZE:{
            const data = action.payload;
            return { ...state, size: data};
        }
        case CHOOSE_UNIT:{
            const data = action.payload;
            return { ...state, unit: data};
        }
        case INPUT_KEY: {
            const data = action.payload;
            return { ...state, key: data};
        }
        case INPUT_DESC: {
            const data = action.payload;
            return { ...state, description: data};
        }
        case FILL_DATA:{
           const data = action.payload;
           return { ...state, key: data.key, description: data.description, currentId: data.id};
        }
        case CLEAR_DATA:{
           return { ...state, key: null, description: null};
        }
        case CLEAR_ALL_FEATURES:{
            return { ...state, quality: null, type: null, pattern: null, color: [], size: null, unit: null };
        }
        case ERROR_INPUT_FEATURE: {
            const error = action.payload;
            return {...state, errorInput: error };
        }
        default: {
            return state;
        }
    }
}
