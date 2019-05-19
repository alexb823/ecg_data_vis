import React, { useState, useEffect } from 'react';
import { Paper, Grid, CircularProgress, withStyles } from '@material-ui/core/';
import { mapDatesAndFolders, mapDatesAndFileNames, fetchEcg } from './utils';
import DaysList from './DaysList';
import EcgGraph from './EcgGraph';
import FilesList from './FilesList';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    maxWidth: 816,
    marginTop: 40,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

const App = ({ classes }) => {
  const [allDays, setAllDays] = useState([]);
  const [oneDaysFiles, setOneDaysFiles] = useState([]);
  const [ecgDataRef, setEcgDataRef] = useState([]);
  const [ecgData, setEcgData] = useState([]);

  // When the App first mounts list of athe days/folder is set on state
  // and data for the laters ecg is fetched and rendered
  useEffect(() => {
    mapDatesAndFolders()
      .then(days => {
        setAllDays(days);
        return mapDatesAndFileNames(days[0].link);
      })
      .then(latestFiles => {
        setOneDaysFiles(latestFiles);
        return fetchEcg(latestFiles[0]);
      })
      .then(ecgData => {
        setEcgData(ecgData);
      });
  }, []);

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
            <DaysList allDays={allDays} setOneDaysFiles={setOneDaysFiles} />
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

export default withStyles(styles)(App);
