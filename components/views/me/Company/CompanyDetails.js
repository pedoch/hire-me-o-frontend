import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload } from 'antd';
import axios from 'axios';
import { Avatar, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import GlobalContext from '../../../../store/globalContext';
import handleError from '../../../../utils/handleAPIErrors';
import makeApiCall from '../../../../utils/makeApiCall';

function CompanyDetails() {
  const [states, setStates] = useState([]);
  const [fetchingStates, setFecthingStates] = useState(true);
  const [subtting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    bio: '',
    streetAddress: '',
    state: '',
  });
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    state: { user, token },
    actions,
  } = useContext(GlobalContext);

  useEffect(() => {
    setInitialValues({
      name: user?.name,
      email: user?.email,
      description: user?.description,
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
    name: yup.string().required('Please enter your company name.'),
    email: yup
      .string()
      .required('Please enter your email address.')
      .email('Please enter a valid email address.'),
    description: yup.string(),
    streetAddress: yup.string().required('Please enter company street address.'),
    state: yup.string().required('Please select a state.'),
  });

  const { Option } = Select;

  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dsbogvjcc/upload/';
  const CLOUDINARY_UPLOAD_PRESET = 'ayuedatm';

  const onUpload = async (info) => {
    setUploading(true);
    if (info.file.status === 'done') {
      let file = info.file.originFileObj;
      try {
        let formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', '/hire-me-o/profile-pictures/');

        const { data } = await axios({
          url: CLOUDINARY_URL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: formData,
        });

        const res = await makeApiCall('/company/update-profile-picture', {
          method: 'POST',
          headers: {
            'x-auth-token': token,
          },
          data: { profilePicture: data.secure_url },
        });

        toaster.success(res.message);

        localStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            profilePicture: data.secure_url,
          }),
        );

        actions({
          type: 'setUser',
          payload: {
            ...user,
            profilePicture: data.secure_url,
          },
        });
      } catch (error) {
        handleError('Unable to upload photo', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-8 phone:p-3">
      <p className="text-xl font-medium mb-10">Company Details</p>
      <div className="w-full flex flex-col items-center mb-10">
        <Avatar className="mb-3" isSolid src={user?.profilePicture} name={user?.name} size={60} />
        <div className="flex flex-wrap space-x-2">
          <div>
            <Upload onChange={(info) => onUpload(info)} maxCount={'1'} multiple={false}>
              <Button className="mb-2" icon={<UploadOutlined />} disabled={uploading || deleting}>
                {uploading
                  ? 'Uploading...'
                  : user?.profilePicture
                  ? 'Change Profile Picture'
                  : 'Upload Profile Picture'}
              </Button>
            </Upload>
          </div>
          {user?.profilePicture && (
            <Button
              type="link"
              danger
              onClick={async () => {
                setDeleting(true);
                try {
                  const res = await makeApiCall('/company/update-profile-picture', {
                    method: 'POST',
                    headers: {
                      'x-auth-token': token,
                    },
                    data: { profilePicture: null },
                  });

                  toaster.notify(res.message);

                  localStorage.setItem(
                    'user',
                    JSON.stringify({
                      ...user,
                      profilePicture: null,
                    }),
                  );
                  actions({
                    type: 'setUser',
                    payload: {
                      ...user,
                      profilePicture: null,
                    },
                  });
                } catch (error) {
                  handleError('Unable to delete photo', error);
                } finally {
                  setDeleting(false);
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={userValidation}
        enableReinitialize
        onSubmit={async (values) => {
          setSubmitting(true);
          try {
            const { data, message } = await makeApiCall('/company/edit-profile', {
              data: values,
              method: 'post',
              headers: {
                'x-auth-token': token,
              },
            });

            const {
              company: { name, email, description, streetAddress, state },
            } = data;

            toaster.success(message);

            localStorage.setItem(
              'user',
              JSON.stringify({
                ...user,
                name,
                email,
                description,
                streetAddress,
                state,
              }),
            );
            actions({
              type: 'setUser',
              payload: {
                ...user,
                name,
                email,
                description,
                streetAddress,
                state,
              },
            });
            setSubmitting(false);
          } catch (error) {
            handleError('Unable to edit user details', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => {
          return (
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
                <div className="w-full mb-4">
                  <label htmlFor="firstname" className="font-medium">
                    Company Name
                  </label>
                  <Input
                    name="name"
                    className="w-full"
                    disabled={subtting}
                    value={values.name}
                    size="large"
                    placeholder="Company Name"
                    onChange={handleChange}
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
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
                    disabled={subtting}
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
                  Description
                </label>
                <Input.TextArea
                  name="description"
                  className="w-full"
                  rows={5}
                  disabled={subtting}
                  value={values.description}
                  size="large"
                  placeholder="Description"
                  onChange={handleChange}
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
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
                    disabled={subtting}
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
                    disabled={subtting}
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
                  disabled={subtting}
                  size="large"
                >
                  Save
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

export default CompanyDetails;
