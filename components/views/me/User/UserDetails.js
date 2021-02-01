import { Button, Input, Select } from 'antd';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import GlobalContext from '../../../../store/globalContext';
import makeApiCall from '../../../../utils/makeApiCall';

function UserDetails() {
  const [edit, setEdit] = useState(false);
  const [states, setStates] = useState([]);
  const [fetchingStates, setFecthingStates] = useState(true);
  const [subtting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    bio: '',
    streetAddress: '',
    state: '',
  });

  const {
    state: { user, token },
    actions,
  } = useContext(GlobalContext);

  useEffect(() => {
    setInitialValues({
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      bio: user?.bio,
      streetAddress: user?.streetAddress,
      state: user?.state,
    });
    fetchStates();
  }, []);

  const fetchStates = async () => {
    setFecthingStates(true);
    try {
      let res = await makeApiCall('/states/get-states', { method: 'get' });

      setStates(res.data.states);

      setFecthingStates(false);
    } catch (error) {
      setFecthingStates(false);
    }
  };

  const userValidation = yup.object().shape({
    firstname: yup.string().required('Please enter your first name'),
    lastname: yup.string().required('Please enter your last name'),
    email: yup
      .string()
      .required('Please enter your email address')
      .email('Please enter a valid email address'),
    bio: yup.string(),
    streetAddress: yup.string(),
    state: yup.string().required('Please select a state'),
  });

  const { Option } = Select;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={userValidation}
      enableReinitialize
      onSubmit={(values) => {
        setSubmitting(true);
        console.log(values);
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => {
        return (
          <form className="w-full max-w-4xl my-8 p-8" onSubmit={handleSubmit}>
            <div className="w-full flex justify-between">
              <p className="text-xl font-medium mb-4">User Details</p>
              {!edit && (
                <Button type="link" htmlType="button" onClick={() => setEdit(true)} size="large">
                  Edit
                </Button>
              )}
            </div>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="firstname" className="font-medium">
                  First Name
                </label>
                <Input
                  name="firstname"
                  className="w-full"
                  disabled={!edit || subtting}
                  value={values.firstname}
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
                  disabled={!edit || subtting}
                  value={values.lastname}
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
                  disabled={!edit || subtting}
                  value={values.email}
                  size="large"
                  placeholder="Email"
                  onChange={handleChange}
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              {/* <div className="w-full mb-4 flex flex-col">
                <label htmlFor="resume" className="font-medium">
                  Resume
                </label>
                <Upload name="resume" onChange={(resume) => console.log(resume)}>
                  <Button size="large" disabled={!edit}>
                    <UploadOutlined /> Click to Upload Resume
                  </Button>
                </Upload>
              </div> */}
            </div>
            <div className="w-full mb-4">
              <label htmlFor="bio" className="font-medium">
                Bio
              </label>
              <Input.TextArea
                name="bio"
                className="w-full"
                rows={5}
                disabled={!edit || subtting}
                values={values.bio}
                size="large"
                placeholder="Bio"
                onChange={handleChange}
              />
              {errors.bio && touched.bio && (
                <p className="mt-1 text-red-500 text-sm">{errors.bio}</p>
              )}
            </div>
            <div className="flex space-x-5 phone:flex-wrap">
              <div className="w-full mb-4">
                <label htmlFor="streetAddress" className="font-medium">
                  Street Address
                </label>
                <Input
                  name="streetAddress"
                  className="w-full"
                  disabled={!edit || subtting}
                  value={values.streetAddress}
                  size="large"
                  placeholder="Street Address"
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
                  disabled={!edit || subtting}
                  value={values.state}
                  size="large"
                  placeholder="State"
                  onChange={(value) => setFieldValue('state', value)}
                >
                  {states.map((state, index) => (
                    <Option key={state.name + index} value={state.name}>
                      {state.name}
                    </Option>
                  ))}
                </Select>
                {fetchingStates && <p>Fecting states...</p>}
                {errors.state && touched.state && (
                  <p className="mt-1 text-red-500 text-sm">{errors.state}</p>
                )}
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                className="mr-2 bg-green-700 hover:bg-green-500 border-green-700"
                disabled={!edit || subtting}
                size="large"
              >
                Save
              </Button>
              <Button
                disabled={!edit || subtting}
                htmlType="button"
                onClick={() => setEdit(false)}
                size="large"
              >
                Cancel
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

export default UserDetails;
