import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import {Drawer, List, Divider, ListItem, ListItemText} from '@material-ui/core';

import Spinner from '../Spinner';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

function TemporaryDrawer({ classes, toggleDrawer, open, allDevices }) {
  const sideList = (
    <div className={classes.list}>
      <List>
        {allDevices.map((deviceId, index) => (
          <ListItem key={deviceId} button component={Link} to={`/${deviceId}`}>
            <ListItemText primary={deviceId} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
  
  if (!allDevices.length) {
    return (
      <Spinner/>
    );
  } else {
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
}

const mapStateToProps = ({ allDevices }) => {
  return { allDevices };
};

export default connect(mapStateToProps)(withStyles(styles)(TemporaryDrawer));
