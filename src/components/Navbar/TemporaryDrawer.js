import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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

const mapStateToProps = ({ allDevices }) => {
  return { allDevices };
};

export default connect(mapStateToProps)(withStyles(styles)(TemporaryDrawer));
