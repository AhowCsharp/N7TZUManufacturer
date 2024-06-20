import ReactDOM from 'react-dom/client';
import axios from 'axios';
//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 400) {
      const errorDetails = error.response.data;
      if (errorDetails && errorDetails.errors) {
        alert(`Error: ${errorDetails.errors}`);
      } else {
        alert('A bad request error occurred.');
      }
    } else if (error.response && error.response.status === 500) {
      const errorDetails = error.response.data;
      const errorMessage = errorDetails.Message || 'Internal Server Error';
      const innerMessage = errorDetails.InnerMessage ? `\nDetails: ${errorDetails.InnerMessage}` : '';
      alert(`Error: ${errorMessage}${innerMessage}`);
    }
    return Promise.reject(error);
  }
);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
