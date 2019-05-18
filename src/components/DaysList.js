import React, { useState, useEffect } from 'react';
import { List, ListItem, withStyles, ListItemText } from '@material-ui/core/';
import { mapDatesAndFiles } from './utils';


const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    overflow: 'auto',
    maxHeight: "100vh",
    backgroundColor: theme.palette.background.paper,
  },
});

const DaysList = ({ classes, allDays, setDaysFiles }) => {
  const [selectedIndex, setSelectedIndex] = useState();

  const gmtToLocale = gmtTime => {
    return new Date(gmtTime.modDate).toLocaleString();
  };

  const handleListItemClick = (event, index, link) => {
    setSelectedIndex(index);
    mapDatesAndFiles(link).then(files => setDaysFiles(files))
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        {allDays.map((day, idx) => (
          <ListItem
            key={day.link}
            button
            selected={selectedIndex === idx}
            onClick={event => handleListItemClick(event, idx, day.link)}
          >
            <ListItemText primary={gmtToLocale(day)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default withStyles(styles)(DaysList);
