import axios from 'axios';
import { baseUrl, parseListOfLinks } from './utils';

// // Action types
const DEVICES_REQUEST = 'DEVICES_REQUEST';
const DEVICES_FAILURE = 'DEVICES_FAILURE';
const GOT_ALL_DEVICES = 'GOT_ALL_DEVICES';

// // Action creators
const devicesRequest = () => {
  return {
    type: DEVICES_REQUEST,
  };
};

const devicesFailure = error => {
  return {
    type: DEVICES_FAILURE,
    error,
  };
};

const gotAllDevices = devices => {
  return {
    type: GOT_ALL_DEVICES,
    devices,
  };
};

// // State
const INITIAL_STATE = { status: 'initial', deviceList: [] };

// // Reducer
export const allDevices = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEVICES_REQUEST:
      return { status: 'fetching', deviceList: [] };
    case DEVICES_FAILURE:
      return { status: 'failed', deviceList: '' };
    case GOT_ALL_DEVICES:
      return { status: 'fetched', deviceList: action.devices };
    default:
      return state;
  }
};

// // Thunks
// gets all the device IDs
export const getAllDevices = () => {
  return dispatch => {
    dispatch(devicesRequest());
    return axios
      .get(`${baseUrl}`)
      .then(response => parseListOfLinks(response.data))
      .then(devices => devices.reverse())
      .then(devices => dispatch(gotAllDevices(devices)))
      .catch(error => dispatch(devicesFailure(error)));
  };
};
