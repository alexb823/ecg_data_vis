import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {fetchModifiedDates, fetchDateStr, mapDates} from './utils'
import EcgGraph from './EcgGraph';

const App = () => {
  mapDates()
  return (
    <div>
      <EcgGraph/>
    </div>
  )
};

export default App;
