import axios from 'axios';
import { baseUrl, parseListOfLinks } from './utils';

const GOT_ALL_DEVICES = 'GOT_ALL_DEVICES';

const gotAllDevices = devices => {
  return {
    type: GOT_ALL_DEVICES,
    devices,
  };
};

export const devicesReducer = (state = [], action) => {
  switch (action.type) {
    case GOT_ALL_DEVICES:
      return action.devices;
    default:
      return state;
  }
};

// Thunks
// gets all the device IDs
export const getAllDevices = () => {
  return dispatch => {
    return axios
      .get(`${baseUrl}`)
      .then(response => parseListOfLinks(response.data))
      .then(devices => devices.reverse())
      .then(devices => dispatch(gotAllDevices(devices)));
  };
};
