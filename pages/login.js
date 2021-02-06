import { Button, Input, Select } from 'antd';
import { Spinner, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { MainLayout } from '../components/common';
import GlobalContext from '../store/globalContext';
import makeApiCall from '../utils/makeApiCall';

function Login() {
  const [submitting, setSubmitting] = useState(false);
  const [initalValues, setInitialValues] = useState({ email: '', password: '', type: '' });
  const [redirectURL, setRedirectURL] = useState(null);
  const [loading, setLoading] = useState(true);

  const { state, actions } = useContext(GlobalContext);

  const router = useRouter();

  const loginValidation = yup.object().shape({
    email: yup
      .string()
      .required('Please enter your email address')
      .email('Please enter a valid email address'),
    password: yup.string().required('Please enter your password'),
    type: yup.string().required('Select account type'),
  });

  useEffect(() => {
    setLoading(true);
    if (router.query.redirectURL) setRedirectURL(router.query.redirectURL);

    if (localStorage.getItem('user')) window.location.replace('/');
    else setLoading(false);
  });

  const { Option } = Select;

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner size={50} />
        </div>
      ) : (
        <MainLayout>
          <Head>
            <title>Log In | Hire Me O!</title>
          </Head>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl mx-4 my-8 flex flex-col items-center">
              <div className="w-full flex justify-center mb-4">
                <p className="text-xl font-medium mb-4">Log In</p>
              </div>
              <Formik
                initialValues={initalValues}
                validationSchema={loginValidation}
                onSubmit={async (values) => {
                  setSubmitting(true);
                  try {
                    const { data } = await makeApiCall(
                      `${
                        values.type === 'user'
                          ? '/auth/login'
                          : values.type === 'company' && '/auth/companyLogin'
                      }`,
                      {
                        method: 'post',
                        data: values,
                      },
                    );

                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('userToken', data.token);

                    actions({ type: 'login', payload: { user: data.user, token: data.token } });
                    setSubmitting(false);

                    toaster.success(`Hi ${data?.user?.firstname || data?.user?.name}`);

                    if (redirectURL) window.location.replace(redirectURL);
                    else window.location.replace('/');
                  } catch (error) {
                    if (!error.response) {
                      toaster.danger('Unable to log you in', {
                        description: 'Maybe a network error',
                      });
                    } else if (error.response.status === 500) {
                      toaster.danger('Unable to log you in', {
                        description: 'Must be a problem on our side',
                      });
                    } else {
                      toaster.danger('Unable to log you in', {
                        description: error.response.data.errors[0].msg,
                      });
                    }
                    setSubmitting(false);
                  }
                }}
              >
                {({ values, handleChange, handleSubmit, setFieldValue, touched, errors }) => {
                  return (
                    <form className="w-full max-w-xl shadow my-8 p-8" onSubmit={handleSubmit}>
                      <div className="w-full mb-4">
                        <label htmlFor="email" className="font-medium">
                          Email
                        </label>
                        <Input
                          name="email"
                          className="w-full phone:w-full"
                          disabled={submitting}
                          size="large"
                          placeholder="Email"
                          onChange={handleChange}
                        />
                        {errors.email && touched.email && (
                          <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>
                      <div className="w-full mb-4">
                        <label htmlFor="Password" className="font-medium">
                          Password
                        </label>
                        <Input.Password
                          name="password"
                          type="password"
                          className="w-full"
                          disabled={submitting}
                          size="large"
                          placeholder="password"
                          visibilityToggle={true}
                          onChange={handleChange}
                        />
                        {errors.password && touched.password && (
                          <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
                        )}
                      </div>
                      <div className="w-full mb-4">
                        <label htmlFor="type" className="font-medium">
                          Account Type
                        </label>
                        <Select
                          name="type"
                          className="w-full phone:w-full"
                          disabled={submitting}
                          size="large"
                          placeholder="Account Type"
                          onChange={(value) => setFieldValue('type', value)}
                        >
                          <Option value="company">Company</Option>
                          <Option value="user">User</Option>
                        </Select>
                        {errors.type && touched.type && (
                          <p className="mt-1 text-red-500 text-sm">{errors.type}</p>
                        )}
                      </div>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="mr-2 w-full"
                        disabled={submitting}
                        size="large"
                      >
                        Login
                      </Button>
                    </form>
                  );
                }}
              </Formik>
              <p>
                Don't have an account?{' '}
                <Link href="/signup">
                  <a className="text-green-500">SIGN UP</a>
                </Link>
              </p>
            </div>
          </div>
        </MainLayout>
      )}
    </>
  );
}

export default Login;
