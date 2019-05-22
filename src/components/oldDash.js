  if (!allDays.length) {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ width: '100vw', height: '100vh' }}
      >
        <Grid item>
          <CircularProgress className={classes.progress} />
        </Grid>
      </Grid>
    );
  } else {
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
            <DaysList deviceId={deviceId} allDays={allDays} setOneDaysFiles={setOneDaysFiles} />
          </Grid>

          <Grid item xs={12} md={9} align="center">
            <Paper className={classes.paper}>
              {ecgData.length ? (
                <EcgGraph ecgData={ecgData} />
              ) : (
                <CircularProgress className={classes.progress} />
              )}
            </Paper>

            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-start"
              spacing={24}
              style={{ marginTop: '20px' }}
            >
              <Grid item xs={12} md={4} align="left">
                <FilesList
                  deviceId={deviceId}
                  oneDaysFiles={oneDaysFiles}
                  setEcgDataRef={setEcgDataRef}
                  setEcgData={setEcgData}
                />
              </Grid>

              {/* <Grid item xs={12} md={5} align="left">
            </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );