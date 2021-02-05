import { Button, Input } from 'antd';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import { useContext, useState } from 'react';
import GlobalContext from '../../../../store/globalContext';
import handleError from '../../../../utils//handleAPIErrors';
import makeApiCall from '../../../../utils/makeApiCall';

function Security() {
  const [submitting, setSubmitting] = useState(false);

  const {
    state: { token },
  } = useContext(GlobalContext);

  return (
    <Formik
      initialValues={{ oldPassword: null, newPassword: null }}
      onSubmit={async (values, { resetForm }) => {
        setSubmitting(true);
        try {
          const { oldPassword, newPassword } = values;
          await makeApiCall('/auth/update-user-password', {
            method: 'post',
            headers: {
              'x-auth-token': token,
            },
            data: {
              oldPassword,
              newPassword,
            },
          });

          toaster.success('User password updated successfully');

          resetForm({ oldPassword: null, newPassword: null });
        } catch (error) {
          handleError('Unable to change user password', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, handleSubmit, errors, touched }) => {
        return (
          <form className="w-full max-w-4xl my-8" onSubmit={handleSubmit}>
            <div className="w-full flex justify-between">
              <p className="text-xl font-medium mb-4">Security</p>
            </div>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="oldPassword" className="font-medium">
                  Old Password
                </label>
                <Input.Password
                  visibilityToggle={true}
                  name="oldPassword"
                  type="Password"
                  className="w-full"
                  size="large"
                  placeholder="Old Password"
                  value={values.oldPassword}
                  onChange={handleChange}
                />
                {errors.oldPassword && touched.oldPassword && (
                  <p className="mt-1 text-red-500 text-sm">{errors.oldPassword}</p>
                )}
              </div>
              <div className="w-full mb-4">
                <label htmlFor="newPassword" className="font-medium">
                  New Password
                </label>
                <Input.Password
                  visibilityToggle={true}
                  name="newPassword"
                  type="Password"
                  className="w-full"
                  size="large"
                  placeholder="New Password"
                  value={values.newPassword}
                  onChange={handleChange}
                />
                {errors.newPassword && touched.newPassword && (
                  <p className="mt-1 text-red-500 text-sm">{errors.newPassword}</p>
                )}
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button type="primary" htmlType="submit" disabled={submitting} size="large">
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

export default Security;
