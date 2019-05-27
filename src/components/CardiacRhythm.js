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
import { mapRhythmData } from './utils';

const styles = theme => ({
  root: {
    width: '100%',
    maxHeight: 254,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
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
    );
  }
};

const mapStateToProps = ({ rhythm: { status, rhythmData } }) => {
  return {
    status,
    rhythmList: mapRhythmData(rhythmData),
  };
};


export default connect(mapStateToProps)(withStyles(styles)(CardiacRhythm));
