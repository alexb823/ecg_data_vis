import React from 'react';
import axios from 'axios';
import {parseListOfDevises} from './utils';

const App = () => {
  axios
    .get('/wxapp2/ecgdata/liveecg')
    .then(response => parseListOfDevises(response.data))
    .then(arr => console.log(arr));
  return <div>Hello</div>;
};

export default App;
