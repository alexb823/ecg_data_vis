import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, withStyles, ListItemText, Grid, CircularProgress } from '@material-ui/core/';
// import {fetchAllDaysFolders} from '../reducers/daysFoldersReducer';
import {fetchdFileNamesAndDates} from '../reducers/dataFilesReducer';

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    overflow: 'auto',
    maxHeight: "100vh",
    backgroundColor: theme.palette.background.paper,
  },
});

const DaysList = ({ classes, deviceId, allDaysFolders, fetchdFileNamesAndDates }) => {
  //which list item is selected
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  useEffect(() => {
    if (allDaysFolders.length) fetchdFileNamesAndDates(deviceId, allDaysFolders[0].link);
  }, [allDaysFolders]);

  const gmtToLocale = gmtTime => {
    return new Date(gmtTime.modDate).toLocaleString();
  };

  const handleListItemClick = (event, index, link) => {
    setSelectedIndex(index);
    // mapDatesAndFileNames(deviceId, link).then(files => setOneDaysFiles(files))
    fetchdFileNamesAndDates(deviceId, link)
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


const mapStateToProps = ({allDaysFolders}) => {
  return {allDaysFolders}
}

const mapDispatchToProps = dispatch => {
  return {
    // fetchAllDaysFolders: (deviceId) => dispatch(fetchAllDaysFolders(deviceId)),
    fetchdFileNamesAndDates: (deviceId, folderName) => dispatch(fetchdFileNamesAndDates(deviceId, folderName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DaysList));




