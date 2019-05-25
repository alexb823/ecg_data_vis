import axios from 'axios';
import { baseUrl, parseRhythm } from './utils';

// // Action types
const RHYTHM_DATA_REQUEST = 'RHYTHM_DATA_REQUEST';
const RHYTHM_DATA_FAILURE = 'RHYTHM_DATA_FAILURE';
const GOT_RHYTHM_DATA = 'GOT_RHYTHM_DATA';

// // Action creators
const rhythmDataRequest = () => {
  return {
    type: RHYTHM_DATA_REQUEST,
  };
};

const rhythmDataFailure = error => {
  return {
    type: RHYTHM_DATA_FAILURE,
    error,
  };
};

const gotRhythmData = rhythmData => {
  return {
    type: GOT_RHYTHM_DATA,
    rhythmData,
  };
};

// // State
const INITIAL_STATE = { status: 'initial', rhythmData: [] };

// // Reducer
export const rhythm = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RHYTHM_DATA_REQUEST:
      return { status: 'fetching', rhythmData: [] };
    case RHYTHM_DATA_FAILURE:
      return { status: 'failed', rhythmData: action.error };
    case GOT_RHYTHM_DATA:
      return { status: 'fetched', rhythmData: action.rhythmData };
    default:
      return state;
  }
};

// // Thunks
export const fetchRhythm = (deviceId, dataFilesArr) => {
  let rhythmFileRef = dataFilesArr.find(obj =>
    obj.name.endsWith('_rhythm.xml')
  );
  let timeStamp = Date.parse(rhythmFileRef.modDate);

  return dispatch => {
    dispatch(rhythmDataRequest());

    return axios
      .get(`${baseUrl}/${deviceId}/${rhythmFileRef.linkEx}/${rhythmFileRef.name}`)
      .then(response => parseRhythm(response.data))
      // .then(rhythmData => dispatch(gotRhythmData(rhythmData)))
      .catch(error => dispatch(rhythmDataFailure(error)));
  };
};
