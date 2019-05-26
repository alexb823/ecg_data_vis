import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';

import App from './components/App';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: blue,
    secondary: red,

  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App style={{backgroundColor: '#f5f5f5'}}/>
    </Provider>
  </MuiThemeProvider>,
  document.querySelector('#app')
);
