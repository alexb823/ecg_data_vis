import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  List,
  ListItem,
  withStyles,
  ListItemText,
  Paper,
} from '@material-ui/core/';
import { fetchEcg } from '../reducers/ecgDataReducer';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    overflow: 'auto',
    maxHeight: '100vh',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    // padding: theme.spacing.unit * 2,
    marginTop: 20,
    maxWidth: 360,
    // textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

const FilesList = ({ classes, deviceId, dataFilesFolders, fetchEcg }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (dataFilesFolders.length && deviceId) {
      setSelectedIndex(0);
      fetchEcg(deviceId, dataFilesFolders[0]);
    }
  }, [deviceId, dataFilesFolders]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    fetchEcg(deviceId, dataFilesFolders[index]);
  };

  if (!dataFilesFolders.length) {
    return null;
  } else {
    return (
      <Paper className={classes.paper}>
        <div className={classes.root}>
          <List component="nav">
            {dataFilesFolders.map((fileArr, idx) => (
              <ListItem
                key={fileArr[0].filesKey}
                button
                selected={selectedIndex === idx}
                onClick={event => handleListItemClick(event, idx)}
              >
                <ListItemText
                  primary={new Date(fileArr[0].modDate).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Paper>
    );
  }
};

const mapStateToProps = ({ dataFilesFolders }) => {
  return { dataFilesFolders };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchEcg: (deviceId, dataFilesArr) =>
      dispatch(fetchEcg(deviceId, dataFilesArr)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FilesList));
