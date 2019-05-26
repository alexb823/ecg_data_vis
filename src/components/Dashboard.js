import React, { useEffect } from 'react';
import { Paper, Grid, Typography } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { fetchAllDaysFolders } from '../reducers/daysFoldersReducer';

import DaysList from './DaysList';
import EcgGraph from './EcgGraph';
import FilesList from './FilesList';
import CardiacRhythm from './CardiacRhythm';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex:  2001,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    // width: 'auto',
    height: 514,
    marginTop: 20,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    backgroundImage: `url(${'Grid_sm.svg'})`,
    backgroundSize: '21px 21px',
    backgroundRepeat: 'repeat',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

const Dashboard = ({ classes, match, fetchAllDaysFolders }) => {
  const { deviceId } = match.params;

  useEffect(() => {
    fetchAllDaysFolders(deviceId);
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
          <Paper className={classes.paper}>
          <Typography variant="h6"> {deviceId}</Typography>
          <Grid container justify="center" alignItems="center">
            <EcgGraph deviceId={deviceId} />
            </Grid>
          </Paper>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={24}
            style={{ marginTop: '20px' }}
          >
            <Grid item xs={12} md={5} align="center">
              <FilesList deviceId={deviceId} />
            </Grid>

            <Grid item xs={12} md={7} align="center">
              <CardiacRhythm deviseId={deviceId}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllDaysFolders: deviceId => dispatch(fetchAllDaysFolders(deviceId)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Dashboard));
