import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import MainAppBar from './Navbar/MainAppBar';
import {fetchFolderNames} from './utils';
import Dashboard from './Dashboard';
import Home from './Home';

const App = () => {
  const [devices, setDevices] = useState([]);
  
  useEffect(()=> {
    fetchFolderNames().then(devices => setDevices(devices))
  }, []);
  
  console.log('hello')
  return (
    <div>
    <Router>
    <MainAppBar devices={devices}/>
    <Route path='/:deviceId' exact component={Dashboard} />
    </Router>
    </div>
    )
};

export default App;
