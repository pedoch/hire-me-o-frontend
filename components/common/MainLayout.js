import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { Spinner } from 'evergreen-ui';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../store/globalContext';
import Footer from './Footer';
import Job from './Job';
import Navbar from './Navbar';

function MainLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);

  const { state, actions } = useContext(GlobalContext);

  useEffect(() => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('userToken');

    if (user && token) actions({ type: 'login', payload: { user, token } });
    else actions({ type: 'setIsLoggedIn' });

    setLoading(false);
  }, []);

  const postNewJob = async () => {};

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner size={50} />
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col text-black relative">
          <Navbar />
          <div className="w-full flex-grow pt-16">{children}</div>
          <Footer />
          {state.user?.name && (
            <Button
              className="fixed bottom-0 right-0 mb-5 mr-5 p-6 text-lg rounded-full text-white flex shadow items-center"
              onClick={() => setIsShown(true)}
              type="primary"
            >
              <PlusOutlined size={50} className="mr-3" />
              <p>New Job</p>
            </Button>
          )}
          <Modal
            title="New Job"
            className=""
            wrapClassName="px-2"
            width={800}
            footer={null}
            visible={isShown}
            onCancel={() => setIsShown(false)}
          >
            <Job />
          </Modal>
        </div>
      )}
    </>
  );
}

export default MainLayout;
