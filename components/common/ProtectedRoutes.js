import { Spinner } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function ProtectedRoutes({ children }) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('user') && localStorage.getItem('userToken')) return setLoading(false);
    window.location.replace(`/login?redirectURL=${router.asPath}`);
  }, []);
  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner size={50} />
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default ProtectedRoutes;
