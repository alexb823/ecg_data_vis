import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, withStyles, ListItemText, Paper,
  Typography } from '@material-ui/core/';
import { fetchFileNamesAndDates } from '../reducers/dataFilesReducer';
import Spinner from './Spinner';

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    maxHeight: 880,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    height: 898,
    color: theme.palette.text.primary,
  },
  title: {
    color: theme.palette.text.primary,
  },
});

const DaysList = ({
  classes,
  deviceId,
  status,
  daysFolderList,
  fetchFileNamesAndDates,
}) => {
  //which list item is selected
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (daysFolderList.length && status !== 'fetching') {
      setSelectedIndex(0);
      fetchFileNamesAndDates(deviceId, daysFolderList[0].link);
    }
  }, [daysFolderList]);

  // Helper func to get local time
  const gmtToLocale = dayFolder => {
    return new Date(dayFolder.modDate).toLocaleString([], { hour12: false });
  };

  const handleListItemClick = (event, index, link) => {
    setSelectedIndex(index);
    fetchFileNamesAndDates(deviceId, link);
  };

  if (status === 'fetching' || status === 'failed') {
    return <Spinner />;
  } else if (!daysFolderList.length) {
    return null;
  } else {
    return (
      <Paper className={classes.paper}>
        <List component="nav" className={classes.root}>
          {daysFolderList.map((dayFolder, index) => (
            <ListItem
              key={dayFolder.id}
              button
              selected={selectedIndex === index}
              onClick={event =>
                handleListItemClick(event, index, dayFolder.link)
              }
            >
              <ListItemText primary={gmtToLocale(dayFolder)} />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
};

const mapStateToProps = ({ allDaysFolders: { status, daysFolderList } }) => {
  return { status, daysFolderList };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFileNamesAndDates: (deviceId, folderName) =>
      dispatch(fetchFileNamesAndDates(deviceId, folderName)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DaysList));
