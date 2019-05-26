import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  List,
  ListItem,
  withStyles,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core/';
import Spinner from './Spinner';
import { fetchRhythm } from '../reducers/rhythmDataReducer';
import { mapRhythmData } from './utils';

const styles = theme => ({
  root: {
    width: '100%',
    maxHeight: 270,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    // padding: theme.spacing.unit * 2,
    height: 320,
    color: theme.palette.text.primary,
  },
  title: {
    color: theme.palette.text.primary,
  },
  listText: {
    textTransform: 'capitalize',
  },
});

const CardiacRhythm = ({ classes, deviceId, status, rhythmList }) => {
  useEffect(() => {}, [rhythmList]);

  // console.log(rhythmList);

  if (status === 'fetching' || status === 'failed') {
    return <Spinner />;
  } else {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.title}>
          Cardiac Rhythm
        </Typography>
        <List className={classes.root}>
          {rhythmList.map(rhythm => (
            <ListItem key={rhythm.eventUtc + rhythm.descriptionFull}>
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant="subtitle1"
                    noWrap
                    className={classes.listText}
                  >{`${rhythm.eventLocTime} - ${rhythm.descriptionFull}`}</Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
};

const mapStateToProps = ({ rhythm: { status, rhythmData } }) => {
  return {
    status,
    rhythmList: mapRhythmData(rhythmData),
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     fetchEcg: (deviceId, dataFilesArr) =>
//       dispatch(fetchEcg(deviceId, dataFilesArr)),
//     fetchRhythm: (deviceId, dataFilesArr) =>
//       dispatch(fetchRhythm(deviceId, dataFilesArr)),
//   };
// };

export default connect(mapStateToProps)(withStyles(styles)(CardiacRhythm));
