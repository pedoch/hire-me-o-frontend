import { Button, Input } from 'antd';
import { Formik } from 'formik';
import { useState } from 'react';

function Security() {
  const [edit, setEdit] = useState(false);

  return (
    <Formik>
      {() => {
        return (
          <form className="w-full max-w-4xl my-8 p-8">
            <div className="w-full flex justify-between">
              <p className="text-xl font-medium mb-4">Security</p>
              {!edit && (
                <Button type="link" onClick={() => setEdit(true)} size="large">
                  Edit
                </Button>
              )}
            </div>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="oldPassword" className="font-medium">
                  Old Password
                </label>
                <Input.Password
                  visibilityToggle={true}
                  name="oldPassword"
                  type="password"
                  className="w-full"
                  disabled={!edit}
                  size="large"
                />
              </div>
              <div className="w-full mb-4">
                <label htmlFor="newPassword" className="font-medium">
                  New Password
                </label>
                <Input.Password
                  visibilityToggle={true}
                  name="newPassword"
                  type="password"
                  className="w-full"
                  disabled={!edit}
                  size="large"
                />
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button type="primary" className="mr-2" disabled={!edit} size="large">
                Save
              </Button>
              <Button disabled={!edit} onClick={() => setEdit(false)} size="large">
                Cancel
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

export default Security;
