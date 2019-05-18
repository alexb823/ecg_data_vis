import React, { useState } from 'react';
import { List, ListItem, withStyles, ListItemText } from '@material-ui/core/';
import {fetchEcg} from './utils';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    overflow: 'auto',
    maxHeight: '100vh',
    backgroundColor: theme.palette.background.paper,
  },
});

const FilesList = ({ classes, daysFiles, setEcgDataRef, setEcgData }) => {
  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setEcgDataRef(daysFiles[index]);
    fetchEcg(daysFiles[index]).then(ecgData => setEcgData(ecgData))
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        {daysFiles.map((fileArr, idx) => (
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
  );
};

export default withStyles(styles)(FilesList);
