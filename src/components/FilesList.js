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
import { fetchEcg } from '../reducers/ecgDataReducer';
import { fetchRhythm } from '../reducers/rhythmDataReducer';

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    maxHeight: 254,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
});


const FilesList = ({
  classes,
  deviceId,
  status,
  dataFileFolderList,
  fetchEcg,
  fetchRhythm,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (dataFileFolderList.length && deviceId && status !== 'fetching') {
      setSelectedIndex(0);
      Promise.all([
        fetchEcg(deviceId, dataFileFolderList[0]),
        fetchRhythm(deviceId, dataFileFolderList[0]),
      ]);
    }
  }, [dataFileFolderList]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    Promise.all([
      fetchEcg(deviceId, dataFileFolderList[index]),
      fetchRhythm(deviceId, dataFileFolderList[index]),
    ]);
  };

  if (status === 'fetching' || status === 'failed') {
    return <Spinner />;
  } else if (!dataFileFolderList.length) {
    return null;
  } else {
    return (
        <List component="nav" className={classes.root}>
          {dataFileFolderList.map((fileArr, idx) => (
            <ListItem
              key={fileArr[0].filesKey}
              button
              selected={selectedIndex === idx}
              onClick={event => handleListItemClick(event, idx)}
            >
              <ListItemText
                primary={new Date(fileArr[0].modDate).toLocaleString([], {
                  hour12: false,
                })}
              />
            </ListItem>
          ))}
        </List>
    );
  }
};

const mapStateToProps = ({
  dataFilesFolders: { status, dataFileFolderList },
}) => {
  return { status, dataFileFolderList };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchEcg: (deviceId, dataFilesArr) =>
      dispatch(fetchEcg(deviceId, dataFilesArr)),
    fetchRhythm: (deviceId, dataFilesArr) =>
      dispatch(fetchRhythm(deviceId, dataFilesArr)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FilesList));
