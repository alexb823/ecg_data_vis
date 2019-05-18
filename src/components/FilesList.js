import React, { useState, useEffect } from 'react';
import { List, ListItem, withStyles, ListItemText } from '@material-ui/core/';
import { gmtToLocale } from './utils';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    overflow: 'auto',
    maxHeight: '100vh',
    backgroundColor: theme.palette.background.paper,
  },
});

const FilesList = ({ classes, daysFiles }) => {
  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index, link) => {
    setSelectedIndex(index);
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        {daysFiles.map((fileSet, idx) => (
          <ListItem
            key={fileSet[0].utc}
            button
            selected={selectedIndex === idx}
            onClick={event => handleListItemClick(event, idx, fileSet[0].utc)}
          >
            <ListItemText
              primary={new Date(fileSet[0].modDate).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default withStyles(styles)(FilesList);
