import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { loginSuccess, logout } from './app/store/slices/authSlice';
import ThemeProvider from './app/providers/ThemeProvider';

const token = localStorage.getItem('token') ||'';
const username = localStorage.getItem('username') || '';

if (token && token !== "undefined") {
  store.dispatch(loginSuccess({ token, username })); 
} else {
  store.dispatch(logout());
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
        main
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
