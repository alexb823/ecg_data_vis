import React, { useState, useEffect } from 'react';
import { Paper, Grid, CircularProgress, Typography } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { mapDatesAndFolders, mapDatesAndFileNames, fetchEcg } from './utils';
import { connect } from 'react-redux';
import {fetchAllDaysFolders} from '../reducers/daysFoldersReducer';

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

  useEffect(() => {
    fetchAllDaysFolders(deviceId)
  }, [match.params.deviceId]);
  
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
            <DaysList deviceId={deviceId} />
          </Grid>
          
          

          <Grid item xs={12} md={9} align="center">
            <Typography variant="h4" gutterBottom style={{marginTop: '40px'}}>
            {deviceId}
            </Typography>
            <Paper className={classes.paper}>
             <EcgGraph deviceId={deviceId}/>
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
               
               <FilesList deviceId={deviceId}/>
               
              </Grid>

              {/* <Grid item xs={12} md={5} align="left">
            </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllDaysFolders: (deviceId) => dispatch(fetchAllDaysFolders(deviceId)),
  }
}


export default connect(null, mapDispatchToProps)(withStyles(styles)(Dashboard));




