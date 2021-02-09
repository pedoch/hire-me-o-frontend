import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, Select, Tabs, Tooltip } from 'antd';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as yup from 'yup';
import { MainLayout } from '../components/common';
import makeApiCall from '../utils/makeApiCall';

const { TabPane } = Tabs;
const { Option } = Select;

function Signup({ states, tags, tabKey }) {
  const [key, setKey] = useState(tabKey);

  return (
    <MainLayout>
      <Head>
        <title>Signup | Hire Me O!</title>
      </Head>
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full max-w-4xl mx-4 my-8 flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <p className="text-xl font-medium mb-4">Sign Up</p>
          </div>
          <Tabs
            type="card"
            centered={true}
            defaultActiveKey={key}
            // activeKey={key}
            size="large"
            animated={true}
          >
            <TabPane tab="User" key="1">
              <UserSignUp states={states} tags={tags} />
            </TabPane>
            <TabPane tab="Company" key="2">
              <CopmanySignUp states={states} tags={tags} />
            </TabPane>
          </Tabs>
          <p>
            Already have an account?{' '}
            <Link href="/login">
              <a className="text-green-500">LOGIN</a>
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

function UserSignUp({ states, tags }) {
  const [submitting, setSubmitting] = useState(false);
  const [initalValues, setInitialValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    bio: '',
    tags: [],
    streetAddress: '',
    state: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const userValidation = yup.object().shape({
    firstname: yup.string().required('Please enter your first name'),
    lastname: yup.string().required('Please enter your last name'),
    email: yup
      .string()
      .required('Please enter your email address')
      .email('Please enter a valid email address'),
    bio: yup.string(),
    tags: yup.array().min(1, 'Please select at least 1 tag'),
    streetAddress: yup.string(),
    state: yup.string().required('Please select a state'),
    password: yup
      .string()
      .required('Please enter your password')
      .min(8, 'Password should be at least 8 characters long'),
    confirmPassword: yup
      .string()
      .required('Please enter password again')
      .oneOf([yup.ref('password'), null], 'Password must match'),
  });
  return (
    <Formik
      initialValues={initalValues}
      validationSchema={userValidation}
      onSubmit={async (values) => {
        setSubmitting(true);
        try {
          // console.log(values);
          let { data, message } = await makeApiCall('/user/signup', {
            method: 'post',
            data: values,
          });
          toaster.success(message);
          setSubmitting(false);
          window.location.replace('/login');
        } catch (error) {
          if (!error.response) {
            toaster.danger('Unable to sign you up', {
              description: 'Maybe a network error',
            });
          } else if (error.response.status === 500) {
            toaster.danger('Unable to sign you up', {
              description: 'Must be a problem on our side',
            });
          } else {
            // console.log(error.response);
            toaster.danger('Unable to sign you up', {
              description: error.response.data.errors[0].msg,
            });
          }
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue, touched, errors }) => {
        return (
          <form className="w-full max-w-2xl mx-auto shadow my-8 p-8" onSubmit={handleSubmit}>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="firstname" className="font-medium">
                  First Name
                </label>
                <Input
                  name="firstname"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="First Name"
                  onChange={handleChange}
                />
                {errors.firstname && touched.firstname && (
                  <p className="mt-1 text-red-500 text-sm">{errors.firstname}</p>
                )}
              </div>
              <div className="w-full mb-4">
                <label htmlFor="lastname" className="font-medium">
                  Last Name
                </label>
                <Input
                  name="lastname"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Last Name"
                  onChange={handleChange}
                />
                {errors.lastname && touched.lastname && (
                  <p className="mt-1 text-red-500 text-sm">{errors.lastname}</p>
                )}
              </div>
            </div>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
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
            </div>
            <div className="w-full mb-4">
              <label htmlFor="bio" className="font-medium">
                Bio (optional)
              </label>
              <Input.TextArea
                name="bio"
                className="w-full"
                rows={5}
                disabled={submitting}
                size="large"
                placeholder="Bio"
                onChange={handleChange}
              />
              {errors.bio && touched.bio && (
                <p className="mt-1 text-red-500 text-sm">{errors.bio}</p>
              )}
            </div>
            <div className="w-full mb-4">
              <label htmlFor="tags" className="font-medium flex items-center">
                Tags{' '}
                <Tooltip
                  placement="top"
                  title={
                    "Tags are a way to specify the type of jobs/companies you're interested in."
                  }
                >
                  <QuestionCircleOutlined
                    twoToneColor={true}
                    trigger={['hover', 'click']}
                    className="pt-1 mb-1 ml-1 text-lg"
                  />
                </Tooltip>
              </label>
              <Select
                name="tags"
                mode="multiple"
                className="w-full"
                disabled={submitting}
                size="large"
                placeholder="Select Tags"
                onChange={(value) => setFieldValue('tags', value)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {tags.map((tag, index) => (
                  <Option key={tag.name + index} value={tag._id}>
                    {tag.name}
                  </Option>
                ))}
              </Select>
              {errors.tags && touched.tags && (
                <p className="mt-1 text-red-500 text-sm">{errors.tags}</p>
              )}
            </div>
            <div className="flex space-x-5 phone:flex-wrap phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="streetAddress" className="font-medium">
                  Street Address (optional)
                </label>
                <Input
                  name="streetAddress"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Street Address"
                  onChange={handleChange}
                />
                {errors.streetAddress && touched.streetAddress && (
                  <p className="mt-1 text-red-500 text-sm">{errors.streetAddress}</p>
                )}
              </div>
              <div className="w-full mb-4 flex flex-col">
                <label htmlFor="state" className="font-medium">
                  State
                </label>
                <Select
                  name="state"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Select State"
                  onChange={(value) => setFieldValue('state', value)}
                  showSearch
                  filterOption
                >
                  {states.map((state, index) => (
                    <Option key={state.name + index} value={state.name}>
                      {state.name}
                    </Option>
                  ))}
                </Select>
                {errors.state && touched.state && (
                  <p className="mt-1 text-red-500 text-sm">{errors.state}</p>
                )}
              </div>
            </div>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="password" className="font-medium">
                  Password
                </label>
                <Input.Password
                  name="password"
                  type="password"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Password"
                  visibilityToggle={true}
                  onChange={handleChange}
                />
                {errors.password && touched.password && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="w-full mb-4">
                <label htmlFor="confirmPassword" className="font-medium">
                  Confirm Password
                </label>
                <Input.Password
                  name="confirmPassword"
                  type="password"
                  className="w-full"
                  placeholder="Confirm Password"
                  size="large"
                  disabled={submitting}
                  visibilityToggle={true}
                  onChange={handleChange}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="mr-2 w-full"
              disabled={submitting}
              size="large"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        );
      }}
    </Formik>
  );
}

function CopmanySignUp({ states, tags }) {
  const [submitting, setSubmitting] = useState(false);
  const [initalValues, setInitialValues] = useState({
    name: '',
    email: '',
    description: '',
    tags: [],
    streetAddress: '',
    state: '',
    password: '',
    confirmPassword: '',
  });
  const companyValidation = yup.object().shape({
    name: yup.string().required('Please enter company name'),
    email: yup
      .string()
      .required('Please enter your email address')
      .email('Please enter a valid email address'),
    description: yup.string(),
    tags: yup.array().min(1, 'Please select at least 1 tag'),
    streetAddress: yup.string().required('Please enter company street address '),
    state: yup.string().required('Please select a state'),
    password: yup
      .string()
      .required('Please enter your password')
      .min(8, 'Password should be at least 8 characters long'),
    confirmPassword: yup
      .string()
      .required('Please enter password again')
      .oneOf([yup.ref('password'), null], 'Password must match'),
  });
  return (
    <Formik
      initialValues={initalValues}
      validationSchema={companyValidation}
      onSubmit={async (values) => {
        setSubmitting(true);
        try {
          // console.log(values);
          let { data, message } = await makeApiCall('/company/signup', {
            method: 'post',
            data: values,
          });
          toaster.success(message);
          setSubmitting(false);
          window.location.replace('/login');
        } catch (error) {
          if (!error.response) {
            toaster.danger('Unable to sign you up', {
              description: 'May be a network error',
            });
          } else if (error.response.status === 500) {
            toaster.danger('Unable to sign you up', {
              description: 'Must be a problem on our side',
            });
          } else {
            // console.log(error.response);
            toaster.danger('Unable to sign you up', {
              description: error.response.data.errors[0].msg,
            });
          }
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue, touched, errors }) => {
        return (
          <form className="w-full max-w-2xl mx-auto shadow my-8 p-8" onSubmit={handleSubmit}>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="firstname" className="font-medium">
                  Name
                </label>
                <Input
                  name="name"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Company Name"
                  onChange={handleChange}
                />
                {errors.name && touched.name && (
                  <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
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
            </div>
            <div className="w-full mb-4">
              <label htmlFor="description" className="font-medium">
                Description (optional)
              </label>
              <Input.TextArea
                name="description"
                className="w-full"
                rows={5}
                disabled={submitting}
                size="large"
                placeholder="Description"
                onChange={handleChange}
              />
              {errors.description && touched.description && (
                <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
            <div className="w-full mb-4">
              <label htmlFor="tags" className="font-medium flex items-center">
                Tags{' '}
                <Tooltip
                  placement="top"
                  title={
                    'Tags are a way of letting applicants know the type of work you do as a company.'
                  }
                >
                  <QuestionCircleOutlined
                    twoToneColor={true}
                    trigger={['hover', 'click']}
                    className="pt-1 mb-1 ml-1 text-lg"
                  />
                </Tooltip>
              </label>
              <Select
                name="tags"
                mode="multiple"
                className="w-full"
                disabled={submitting}
                size="large"
                placeholder="Select Tags"
                onChange={(value) => setFieldValue('tags', value)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {tags.map((tag, index) => (
                  <Option key={tag.name + index} value={tag._id}>
                    {tag.name}
                  </Option>
                ))}
              </Select>
              {errors.tags && touched.tags && (
                <p className="mt-1 text-red-500 text-sm">{errors.tags}</p>
              )}
            </div>
            <div className="flex space-x-5 phone:flex-wrap phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="streetAddress" className="font-medium">
                  Street Address
                </label>
                <Input
                  name="streetAddress"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Street Address"
                  onChange={handleChange}
                />
                {errors.streetAddress && touched.streetAddress && (
                  <p className="mt-1 text-red-500 text-sm">{errors.streetAddress}</p>
                )}
              </div>
              <div className="w-full mb-4 flex flex-col">
                <label htmlFor="state" className="font-medium">
                  State
                </label>
                <Select
                  name="state"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Select State"
                  onChange={(value) => setFieldValue('state', value)}
                  showSearch
                  filterOption
                >
                  {states.map((state, index) => (
                    <Option key={state.name + index} value={state.name}>
                      {state.name}
                    </Option>
                  ))}
                </Select>
                {errors.state && touched.state && (
                  <p className="mt-1 text-red-500 text-sm">{errors.state}</p>
                )}
              </div>
            </div>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="password" className="font-medium">
                  Password
                </label>
                <Input.Password
                  name="password"
                  type="password"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Password"
                  visibilityToggle={true}
                  onChange={handleChange}
                />
                {errors.password && touched.password && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="w-full mb-4">
                <label htmlFor="confirmPassword" className="font-medium">
                  Confirm Password
                </label>
                <Input.Password
                  name="confirmPassword"
                  type="password"
                  className="w-full"
                  placeholder="Confirm Password"
                  size="large"
                  disabled={submitting}
                  visibilityToggle={true}
                  onChange={handleChange}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="mr-2 w-full"
              disabled={submitting}
              size="large"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        );
      }}
    </Formik>
  );
}

Signup.getInitialProps = async ({ query }) => {
  let states = [];
  let tags = [];
  let tabKey = '1';
  try {
    let res = await makeApiCall('/states/get-states', { method: 'get' });
    states = res.data.states;

    res = await makeApiCall('/tags/get-tags', { method: 'get' });
    tags = res.data.tags;

    if (query != {}) {
      if (query.selected && query.selected === 'company') tabKey = '2';
    }
  } catch (error) {
    // console.log(error);
  }

  return {
    states,
    tags,
    tabKey,
  };
};

export default Signup;
