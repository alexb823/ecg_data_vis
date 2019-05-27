import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Paper, Grid, Typography, Divider } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { fetchAllDaysFolders } from '../reducers/daysFoldersReducer';

import DaysList from './DaysList';
import EcgGraph from './EcgGraph';
import FilesList from './FilesList';
import CardiacRhythm from './CardiacRhythm';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    marginTop: theme.spacing(2),
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    height: 514,
    textAlign: 'left',
    color: theme.palette.text.primary,
    backgroundImage: `url(${'Grid_sm.svg'})`,
    backgroundSize: '21px 21px',
    backgroundRepeat: 'repeat',
  },
  paperSide: {
    height: 898,
    color: theme.palette.text.primary,
  },
  paperBottom: {
    // padding: theme.spacing(2),
    // textAlign: 'center',
    height: 320,
    color: theme.palette.text.primary,
  },
  title: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
        spacing={3}
      >
        <Grid item xs={12} md={3} align="center">
          <Paper className={classes.paperSide}>
            <Typography variant="subtitle1" className={classes.title}>
              Available Reports
            </Typography>
            <Divider variant="middle" />
            <DaysList deviceId={deviceId} />
          </Paper>
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
            spacing={3}
            style={{ marginTop: '20px' }}
          >
            <Grid item xs={12} md={5} align="center">
              <Paper className={classes.paperBottom}>
                <Typography variant="subtitle1" className={classes.title}>
                  Reports
                </Typography>
                <Divider variant="middle" />
                <FilesList deviceId={deviceId} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={7} align="center">
              <Paper className={classes.paperBottom}>
                <Typography variant="subtitle1" className={classes.title}>
                  Cardiac Rhythm
                </Typography>
                <Divider variant="middle" />
                <CardiacRhythm deviseId={deviceId} />
              </Paper>
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
