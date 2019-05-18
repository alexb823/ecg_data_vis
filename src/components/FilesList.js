import React, { useState, useEffect } from 'react';
import { List, ListItem, withStyles, ListItemText } from '@material-ui/core/';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    overflow: 'auto',
    maxHeight: '100vh',
    backgroundColor: theme.palette.background.paper,
  },
});

const FilesList = ({ classes, daysFiles, setEcgDataRef }) => {
  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index, fileIdx) => {
    setSelectedIndex(index);
    setEcgDataRef(daysFiles[fileIdx])
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        {daysFiles.map((fileArr, idx) => (
          <ListItem
            key={fileArr[0].utc}
            button
            selected={selectedIndex === idx}
            onClick={event => handleListItemClick(event, idx, fileArr[0].utc)}
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
