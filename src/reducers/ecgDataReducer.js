import axios from 'axios';
import { baseUrl, parseSmoothECG } from './utils';

const GOT_ECG_DATA = 'GOT_ECG_DATA';

const gotEcgData = ecgData => {
  return {
    type:GOT_ECG_DATA,
    ecgData,
  };
};

export const ecgDataReducer = (state = [], action) => {
  switch (action.type) {
    case GOT_ECG_DATA:
      return action.ecgData;
    default:
      return state;
  }
};

// Thunks
// Get the ecg data txt file and parse the text
// Map the x & y data points
// Returns an array of objects with x and y values for the ecg graph
export const fetchEcg = (deviceId, dataFilesArr) => {
  let ecgFileRef = dataFilesArr.find(obj => obj.name.endsWith('_smoothECG.txt'));
  let timeStamp = Date.parse(ecgFileRef.modDate);
  
  return dispatch => {
      return axios
        .get(`${baseUrl}/${deviceId}/${ecgFileRef.linkEx}/${ecgFileRef.name}`)
        .then(response => parseSmoothECG(response.data))
        .then(ecg =>
          ecg.map(microvolts => {
            const dataPoint = { x: timeStamp, y: microvolts };
            timeStamp += 4;
            return dataPoint;
          })
        )
        .then(ecgData => dispatch(gotEcgData(ecgData)))
    }
};


