import React from 'react';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

function TemporaryDrawer({classes, devices, toggleDrawer, open}) {

  const sideList = (
    <div className={classes.list}>
      <List>
          {devices.map((deviceId, index) => <ListItem key={index} button component={Link} to={`/${deviceId}`}>
            <ListItemText primary={deviceId} />
          </ListItem>)}
      </List>
      <Divider />
      
    </div>
  );


  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {sideList}
        </div>
      </Drawer>
    </div>
  );
}

export default withStyles(styles)(TemporaryDrawer);