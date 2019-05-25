import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  List,
  ListItem,
  withStyles,
  ListItemText,
} from '@material-ui/core/';
import { fetchFileNamesAndDates } from '../reducers/dataFilesReducer';
import Spinner from './Spinner';

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    overflow: 'auto',
    maxHeight: '100vh',
    backgroundColor: theme.palette.background.paper,
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
    if (daysFolderList.length) {
      setSelectedIndex(0);
      fetchFileNamesAndDates(deviceId, daysFolderList[0].link);
    }
  }, [daysFolderList]);

  const gmtToLocale = gmtTime => {
    return new Date(gmtTime.modDate).toLocaleString();
  };

  const handleListItemClick = (event, index, link) => {
    setSelectedIndex(index);
    fetchFileNamesAndDates(deviceId, link);
  };

  if (status === 'fetching') {
    return <Spinner />;
  } else {
    return (
      <div className={classes.root}>
        <List component="nav">
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
      </div>
    );
  }
};

const mapStateToProps = ({ allDaysFolders: { status, daysFolderList }}) => {
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
