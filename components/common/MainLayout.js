import { Spinner } from 'evergreen-ui';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../store/globalContext';
import Footer from './Footer';
import Navbar from './Navbar';

function MainLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const { state, actions } = useContext(GlobalContext);

  useEffect(() => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('userToken');

    if (user && token) actions({ type: 'login', payload: { user, token } });
    else actions({ type: 'setIsLoggedIn' });

    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner size={50} />
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col text-black">
          <Navbar />
          <div className="w-full flex-grow pt-16">{children}</div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default MainLayout;
