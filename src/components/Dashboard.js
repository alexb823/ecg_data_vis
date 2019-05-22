import React, { useState, useEffect } from 'react';
import { Paper, Grid, CircularProgress } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { mapDatesAndFolders, mapDatesAndFileNames, fetchEcg } from './utils';
import { connect } from 'react-redux';
import {fetchAllDaysFolders} from '../reducers/devicesReducer';

import DaysList from './DaysList';
import EcgGraph from './EcgGraph';
import FilesList from './FilesList';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    // maxWidth: 768,
    width: 768,
    marginTop: 40,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundImage: `url(${"Grid_sm.svg"})`,
    backgroundSize: '21px 21px',
    backgroundRepeat: 'repeat',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

const Dashboard = ({ classes, match, fetchAllDaysFolders }) => {
  const {deviceId} = match.params;

  const [allDays, setAllDays] = useState([]);
  const [oneDaysFiles, setOneDaysFiles] = useState([]);
  const [ecgDataRef, setEcgDataRef] = useState([]);
  const [ecgData, setEcgData] = useState([]);

  // When the App first mounts list of athe days/folder is set on state
  // and data for the laters ecg is fetched and rendered
  useEffect(() => {
    fetchAllDaysFolders(deviceId)
      .then(latestFiles => {
        setOneDaysFiles(latestFiles);
        return fetchEcg(deviceId, latestFiles[0]);
      })
      .then(ecgData => {
        setEcgData(ecgData);
      });
  }, [match.params.deviceId]);

  // useEffect(() => {
  //   mapDatesAndFolders(deviceId)
  //     .then(days => {
  //       setAllDays(days);
  //       return mapDatesAndFileNames(deviceId, days[0].link);
  //     })
  //     .then(latestFiles => {
  //       setOneDaysFiles(latestFiles);
  //       return fetchEcg(deviceId, latestFiles[0]);
  //     })
  //     .then(ecgData => {
  //       setEcgData(ecgData);
  //     });
  // }, [match.params.deviceId]);

  // console.log('days files', oneDaysFiles);
  // console.log('all days', allDays);
  if (!allDays.length) {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ width: '100vw', height: '100vh' }}
      >
        <Grid item>
          <CircularProgress className={classes.progress} />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={24}
        >
          <Grid item xs={12} md={3}>
            <DaysList deviceId={deviceId} allDays={allDays} setOneDaysFiles={setOneDaysFiles} />
          </Grid>

          <Grid item xs={12} md={9} align="center">
            <Paper className={classes.paper}>
              {ecgData.length ? (
                <EcgGraph ecgData={ecgData} />
              ) : (
                <CircularProgress className={classes.progress} />
              )}
            </Paper>

            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-start"
              spacing={24}
              style={{ marginTop: '20px' }}
            >
              <Grid item xs={12} md={4} align="left">
                <FilesList
                  deviceId={deviceId}
                  oneDaysFiles={oneDaysFiles}
                  setEcgDataRef={setEcgDataRef}
                  setEcgData={setEcgData}
                />
              </Grid>

              {/* <Grid item xs={12} md={5} align="left">
            </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllDaysFolders: (deviceId) => dispatch(fetchAllDaysFolders(deviceId))
  }
}
export default withStyles(styles)(Dashboard);
