import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {mapDatesAndFolders, mapDatesAndFiles} from './utils'
import EcgGraph from './EcgGraph';

const App = () => {
  mapDatesAndFolders();
  mapDatesAndFiles('20190506');
  return (
    <div>
      <EcgGraph/>
    </div>
  )
};

export default App;
