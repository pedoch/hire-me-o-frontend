import Head from 'next/head';
import { useContext } from 'react';
import { MainLayout } from '../components/common';
import ProtectedRoutes from '../components/common/ProtectedRoutes';
import { Company, User } from '../components/views/me';
import GlobalContext from '../store/globalContext';

function Me() {
  const { state, action } = useContext(GlobalContext);
  return (
    <ProtectedRoutes>
      <MainLayout>
        <Head>
          <title>Me | Hire Me O!</title>
        </Head>
        <div className="w-full h-full flex flex-col items-center">
          {state.user?.firstname ? <User /> : <Company />}
        </div>
      </MainLayout>
    </ProtectedRoutes>
  );
}

export default Me;
