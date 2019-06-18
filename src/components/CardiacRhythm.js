import React, { useState, useEffect } from 'react';
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
import {selectedAnEvent } from '../reducers/highlightedEventReducer';


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


const CardiacRhythm = ({ classes, deviceId, rhythm, status, rhythmEventList, selectedAnEvent }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  useEffect(() => {
    setSelectedIndex(-1);
    selectedAnEvent({});
  }, [rhythm]);
  
  const handleListItemClick = (index, rhythmEvent) => {
    setSelectedIndex(index);
    selectedAnEvent(rhythmEvent);
  }

  if (status === 'fetching' || status === 'failed') {
    return <Spinner />;
  } else {
    return (
        <List className={classes.root}>
          {rhythmEventList.map((rhythmEvent, index) => (
            <ListItem
            key={rhythmEvent.eventUtc + rhythmEvent.descriptionFull}
            button
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index, rhythmEvent)}
              >
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant="subtitle1"
                    noWrap
                    className={classes.listText}
                  >{`${rhythmEvent.eventLocTime} - ${rhythmEvent.descriptionFull}`}</Typography>
                }
              />
            </ListItem>
          ))}
        </List>
    );
  }
};


const mapStateToProps = ({ rhythm }) => {
  return {
    rhythm,
    status: rhythm.status,
    rhythmEventList: mapRhythmData(rhythm.rhythmData),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectedAnEvent: (rhythmEvent) => dispatch(selectedAnEvent(rhythmEvent)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CardiacRhythm));

