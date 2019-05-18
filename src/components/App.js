import React, { useState, useEffect } from 'react';
import { Paper, Grid, withStyles } from '@material-ui/core/';
import { mapDatesAndFolders, mapDatesAndFiles } from './utils';
import DaysList from './DaysList';
import EcgGraph from './EcgGraph';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const App = ({ classes }) => {
  const [allDays, setAllDays] = useState([]);
  const [daysFiles, setDaysFiles] = useState({});

  useEffect(() => {
    mapDatesAndFolders().then(days => setAllDays(days));
  }, []);

  console.log(daysFiles)
  // console.log(allDays);
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={24}
      >
        <Grid item xs={12} md={3}>
          <DaysList allDays={allDays} setDaysFiles={setDaysFiles} />
        </Grid>

        <Grid item xs={12} md={9} align="center">
          {/* <EcgGraph /> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(App);
