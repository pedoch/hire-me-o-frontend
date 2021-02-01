import GlobalContext from '../store/globalContext';
import useGlobalState from '../store/useGlobalState';
import '../styles/globals.css';

// axios.defaults.baseURL = 'https://hire-me-o.herokuapp.com/api';

function MyApp({ Component, pageProps }) {
  const store = useGlobalState();
  return (
    <GlobalContext.Provider value={store}>
      <Component {...pageProps} />
    </GlobalContext.Provider>
  );
}

export default MyApp;
