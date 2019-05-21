import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Paper, Grid, CircularProgress, withStyles } from '@material-ui/core/';
import MainAppBar from './MainAppBar';

const App = () => {
  const [devices, setDevices] = useState([])
  return (
    <Router>
    <MainAppBar/>
    </Router>
    )
}

export default App;
