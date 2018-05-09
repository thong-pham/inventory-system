import { ADD_FEATURE_STARTED, ADD_FEATURE_FULFILLED, ADD_FEATURE_REJECTED,
          GET_QUALITY_STARTED, GET_QUALITY_FULFILLED, GET_QUALITY_REJECTED,
          GET_TYPE_STARTED, GET_TYPE_FULFILLED, GET_TYPE_REJECTED,
          GET_PATTERN_STARTED, GET_PATTERN_FULFILLED, GET_PATTERN_REJECTED,
          GET_COLOR_STARTED, GET_COLOR_FULFILLED, GET_COLOR_REJECTED,
          GET_SIZE_STARTED, GET_SIZE_FULFILLED, GET_SIZE_REJECTED,
          GET_UNIT_STARTED, GET_UNIT_FULFILLED, GET_UNIT_REJECTED,
          DELETE_FEATURE_STARTED, DELETE_FEATURE_FULFILLED, DELETE_FEATURE_REJECTED,
          ADD_QUALITY, ADD_TYPE, ADD_PATTERN, ADD_COLOR, ADD_SIZE, ADD_UNIT,
          CHOOSE_QUALITY, CHOOSE_TYPE, CHOOSE_PATTERN, CHOOSE_COLOR, CHOOSE_SIZE, CHOOSE_UNIT,
          INPUT_KEY, INPUT_DESC
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
    color: null,
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
    generatedSku: null
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
           return { ...state, addQuality: !state.addQuality, addingFeatureError: null };
        }
        case ADD_TYPE : {
           return { ...state, addType: !state.addType, addingFeatureError: null};
        }
        case ADD_PATTERN : {
           return { ...state, addPattern: !state.addPattern, addingFeatureError: null};
        }
        case ADD_COLOR : {
           return { ...state, addColor: !state.addColor, addingFeatureError: null};
        }
        case ADD_SIZE : {
           return { ...state, addSize: !state.addSize, addingFeatureError: null};
        }
        case ADD_UNIT : {
           return { ...state, addUnit: !state.addUnit, addingFeatureError: null};
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
        default: {
            return state;
        }
    }
}
