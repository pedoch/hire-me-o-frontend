import axios from 'axios';
import '../styles/globals.css';

axios.defaults.baseURL = 'https://hire-me-o.herokuapp.com/api';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
