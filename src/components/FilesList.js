import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  withStyles,
  ListItemText,
  Paper,
} from '@material-ui/core/';
import { fetchEcg } from './utils';

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

const FilesList = ({ classes, oneDaysFiles, setEcgDataRef, setEcgData, deviceId }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
    if (oneDaysFiles.length) {
      fetchEcg(deviceId, oneDaysFiles[0]).then(ecgData => setEcgData(ecgData));
    }
  }, [oneDaysFiles]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setEcgDataRef(oneDaysFiles[index]);
    fetchEcg(deviceId, oneDaysFiles[index]).then(ecgData => setEcgData(ecgData));
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.root}>
        <List component="nav">
          {oneDaysFiles.map((fileArr, idx) => (
            <ListItem
              key={fileArr[0].utc}
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
};

export default withStyles(styles)(FilesList);
