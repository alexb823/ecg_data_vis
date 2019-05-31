import axios from 'axios';
import { baseUrl, parseSmoothECG, resampleArray } from './utils';

// // Action types
const ECG_DATA_REQUEST = 'ECG_DATA_REQUEST';
const ECG_DATA_FAILURE = 'ECG_DATA_FAILURE';
const GOT_ECG_DATA = 'GOT_ECG_DATA';

// // Action creators
const ecgDataRequest = () => {
  return {
    type: ECG_DATA_REQUEST,
  };
};

const ecgDataFailure = () => {
  return {
    type: ECG_DATA_FAILURE,
  };
};

const gotEcgData = ecgDataArr => {
  return {
    type: GOT_ECG_DATA,
    ecgDataArr,
  };
};

// // State
const INITIAL_STATE = { status: 'initial', ecgDataArr: [] };

// // Reducer
export const ecgData = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ECG_DATA_REQUEST:
      return { status: 'fetching', ecgDataArr: [] };
    case ECG_DATA_FAILURE:
      return { status: 'failed', ecgDataArr: [] };
    case GOT_ECG_DATA:
      return { status: 'fetched', ecgDataArr: action.ecgDataArr };
    default:
      return state;
  }
};

// // Thunks
// Get the ecg data txt file and parse the text
// Map the x & y data points
// Returns an array of objects with x and y values for the ecg graph
// Original sample rate is 4ms, but after applying resampleArray its 16ms
// timeStamp increment should be 4 * val passed into resampleArray func
export const fetchEcg = (deviceId, dataFilesArr) => {
  const ecgFileRef = dataFilesArr.find(obj => obj.name.endsWith('_smoothECG.txt'));
  let timeStamp = ecgFileRef.utc;

  return dispatch => {
    dispatch(ecgDataRequest());

    return axios
      .get(`${baseUrl}/${deviceId}/${ecgFileRef.linkEx}/${ecgFileRef.name}`)
      .then(response => parseSmoothECG(response.data))
      .then(ecg => resampleArray(ecg, 4))
      .then(resampledEcg =>
        resampledEcg.map(microvolts => {
          const dataPoint = { x: timeStamp, y: microvolts };
          timeStamp += 16;
          return dataPoint;
        })
      )
      .then(ecgDataArr => dispatch(gotEcgData(ecgDataArr)))
      .catch(() => dispatch(ecgDataFailure()));
  };
};
