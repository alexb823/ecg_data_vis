import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainAppBar from './Navbar/MainAppBar';
import { getAllDevices } from '../reducers/devicesReducer';
import Dashboard from './Dashboard';

const App = ({ getAllDevices }) => {
  // const [devices, setDevices] = useState([]);

  useEffect(() => {
    getAllDevices();
  }, []);

  console.log('hello');
  return (
    <div>
      <Router>
        <MainAppBar />
        <Route path="/:deviceId" exact component={Dashboard} />
      </Router>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    getAllDevices: () => dispatch(getAllDevices()),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(App);
