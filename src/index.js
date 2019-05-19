import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import {blue, red} from '@material-ui/core/colors';

import App from './components/App';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red,
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
<App/>
</MuiThemeProvider>,
document.querySelector('#app'));
