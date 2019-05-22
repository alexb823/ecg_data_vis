import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import TemporaryDrawer from './TemporaryDrawer';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function MainAppBar({ classes }) {
  const [open, setState] = useState(false);

  const toggleDrawer = open => () => {
    setState(open);
  };

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={toggleDrawer(!open)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Ecordum
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <TemporaryDrawer toggleDrawer={toggleDrawer} open={open} />
    </div>
  );
}

export default withStyles(styles)(MainAppBar);
