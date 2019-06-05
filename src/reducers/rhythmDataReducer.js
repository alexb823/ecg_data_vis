import axios from 'axios';
import { baseUrl } from './utils';

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

const rhythmDataFailure = () => {
  return {
    type: RHYTHM_DATA_FAILURE,
  };
};

const gotRhythmData = rhythmData => {
  return {
    type: GOT_RHYTHM_DATA,
    rhythmData,
  };
};

// // State
const INITIAL_STATE = { status: 'initial', rhythmData: {} };

// // Reducer
export const rhythm = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RHYTHM_DATA_REQUEST:
      return { status: 'fetching', rhythmData: {} };
    case RHYTHM_DATA_FAILURE:
      return { status: 'failed', rhythmData: {} };
    case GOT_RHYTHM_DATA:
      return { status: 'fetched', rhythmData: action.rhythmData };
    default:
      return state;
  }
};


// // Thunks
// helper func
// sends the xml file to the server api and returns it in json form
export const parseRhythm = (xml) => {
  return axios.post('/api/xmlToJson', {xml})
  .then(response => response.data.OUTPUT)
}

// Returns the rhythm obj for a specific file
export const fetchRhythm = (deviceId, dataFilesArr) => {
  const rhythmFileRef = dataFilesArr.find(obj => obj.name.endsWith('_rhythm.xml'));
  // Taking the timeStamp from ECG file instead of Rhythm file, because the
  // modified time sometimes has 1sec diff and then events and ecg graph a out of alignment
  const ecgFileRef = dataFilesArr.find(obj => obj.name.endsWith('_smoothECG.txt'));
  let timeStamp = ecgFileRef.utc;

  return dispatch => {
    dispatch(rhythmDataRequest());

    return axios
      .get(`${baseUrl}/${deviceId}/${rhythmFileRef.linkEx}/${rhythmFileRef.name}`)
      .then(response => parseRhythm(response.data))
      .then(rhythmData => dispatch(gotRhythmData({timeStamp, ...rhythmData})))
      .catch(() => dispatch(rhythmDataFailure()));
  };
};
