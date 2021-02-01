import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload } from 'antd';
import { Formik } from 'formik';
import { useState } from 'react';

function User() {
  const [edit, setEdit] = useState(false);
  const [edit2, setEdit2] = useState(false);
  return (
    <div className="w-full max-w-4xl mx-4 my-8">
      <p className="text-2xl font-medium">Your User Proifle</p>
      <Formik>
        {({ values, onChange, onSubmit, errors, touched }) => {
          return (
            <form className="w-full max-w-4xl shadow my-8 p-8">
              <div className="w-full flex justify-between">
                <p className="text-xl font-medium mb-4">User Details</p>
                <Button type="link" onClick={() => setEdit(true)} size="large">
                  Edit
                </Button>
              </div>
              <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
                <div className="w-full mb-4">
                  <label htmlFor="firstName" className="font-medium">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    className="w-full"
                    disabled={!edit}
                    size="large"
                    placeholder="First Name"
                  />
                </div>
                <div className="w-full mb-4">
                  <label htmlFor="lastName" className="font-medium">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    className="w-full"
                    disabled={!edit}
                    size="large"
                    placeholder="Last Name"
                  />
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
                    disabled={!edit}
                    size="large"
                    placeholder="Email"
                  />
                </div>
                <div className="w-full mb-4 flex flex-col">
                  <label htmlFor="resume" className="font-medium">
                    Resume
                  </label>
                  <Upload name="resume" onChange={(resume) => console.log(resume)}>
                    <Button size="large" disabled={!edit}>
                      <UploadOutlined /> Click to Upload Resume
                    </Button>
                  </Upload>
                </div>
              </div>
              <div className="w-full mb-4">
                <label htmlFor="bio" className="font-medium">
                  Bio
                </label>
                <Input.TextArea
                  name="bio"
                  className="w-full"
                  rows={5}
                  disabled={!edit}
                  size="large"
                  placeholder="Bio"
                />
              </div>
              <div className="flex space-x-5 phone:flex-wrap">
                <div className="w-full mb-4">
                  <label htmlFor="streetAddress" className="font-medium">
                    Street Address
                  </label>
                  <Input
                    name="streetAddress"
                    className="w-full"
                    disabled={!edit}
                    size="large"
                    placeholder="Street Address"
                  />
                </div>
                <div className="w-full mb-4 flex flex-col">
                  <label htmlFor="state" className="font-medium">
                    State
                  </label>
                  <Input
                    name="state"
                    className="w-full"
                    disabled={!edit}
                    size="large"
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="w-full flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mr-2 bg-green-700 hover:bg-green-500 border-green-700"
                  disabled={!edit}
                  size="large"
                >
                  Save
                </Button>
                <Button disabled={!edit} size="large">
                  Cancel
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
      <Formik>
        {() => {
          return (
            <form className="w-full max-w-4xl shadow my-8 p-8">
              <div className="w-full flex justify-between">
                <p className="text-xl font-medium mb-4">Security</p>
                <Button type="link" onClick={() => setEdit2(true)} size="large">
                  Edit
                </Button>
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
                    disabled={!edit2}
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
                    disabled={!edit2}
                    size="large"
                  />
                </div>
              </div>
              <div className="w-full flex justify-end">
                <Button type="primary" className="mr-2" disabled={!edit2} size="large">
                  Save
                </Button>
                <Button disabled={!edit2} size="large">
                  Cancel
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

export default User;
