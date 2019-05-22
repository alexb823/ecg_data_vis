import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, withStyles, ListItemText, Grid, CircularProgress } from '@material-ui/core/';
// import {fetchAllDaysFolders} from '../reducers/daysFoldersReducer';

// import { mapDatesAndFileNames } from './utils';

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    overflow: 'auto',
    maxHeight: "100vh",
    backgroundColor: theme.palette.background.paper,
  },
});

// allDays, setOneDaysFiles

const DaysList = ({ classes, deviceId, allDaysFolders }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const gmtToLocale = gmtTime => {
    return new Date(gmtTime.modDate).toLocaleString();
  };

  const handleListItemClick = (event, index, link) => {
    setSelectedIndex(index);
    // mapDatesAndFileNames(deviceId, link).then(files => setOneDaysFiles(files))
  };
  
  if (!allDaysFolders.length) {
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
        <List component="nav">
          {allDaysFolders.map((dayFolder, index) => (
            <ListItem
              key={dayFolder.id}
              button
              selected={selectedIndex === index}
              onClick={event => handleListItemClick(event, index, dayFolder.link)}
            >
              <ListItemText primary={gmtToLocale(dayFolder)} />
            </ListItem>
          ))}
        </List>
      </div>
    )
  }
};

// const mapDispatchToProps = dispatch=> {
//   return {
//     fetchAllDaysFolders: (deviceId) => dispatch(fetchAllDaysFolders(deviceId)),
//   }
// }

const mapStateToProps = ({allDaysFolders}) => {
  return {allDaysFolders}
}

export default connect(mapStateToProps)(withStyles(styles)(DaysList));




