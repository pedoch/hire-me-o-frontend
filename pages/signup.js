import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Input, Select, Tabs, Tooltip } from "antd";
import axios from "axios";
import { Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import * as yup from "yup";
import { MainLayout } from "../components/common";

const { TabPane } = Tabs;
const { Option } = Select;

function Signup({ states, tags }) {
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
          <Tabs type="card" centered={true} defaultActiveKey="1" size="large" animated={true}>
            <TabPane tab="User" key="1">
              <UserSignUp states={states} tags={tags} />
            </TabPane>
            <TabPane tab="Company" key="2">
              <CopmanySignUp states={states} tags={tags} />
            </TabPane>
          </Tabs>
          <p>
            Already have an account?{" "}
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
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    tags: [],
    streetAddress: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const userValidation = yup.object().shape({
    firstName: yup.string().required("Please enter your first name"),
    lastName: yup.string().required("Please enter your last name"),
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter a valid email address"),
    bio: yup.string(),
    tags: yup.array().min(1, "Please select at least 1 tag"),
    streetAddress: yup.string(),
    state: yup.string().required("Please select a state"),
    password: yup
      .string()
      .required("Please enter your password")
      .min(8, "Password should be at least 8 characters long"),
    confirmPassword: yup
      .string()
      .required("Please enter password again")
      .oneOf([yup.ref("password"), null], "Password must match"),
  });
  return (
    <Formik
      initialValues={initalValues}
      validationSchema={userValidation}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue, touched, errors }) => {
        return (
          <form className="w-full max-w-2xl shadow my-8 p-8" onSubmit={handleSubmit}>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="firstName" className="font-medium">
                  First Name
                </label>
                <Input
                  name="firstName"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="First Name"
                  onChange={handleChange}
                />
                {errors.firstName && touched.firstName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="w-full mb-4">
                <label htmlFor="lastName" className="font-medium">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  className="w-full"
                  disabled={submitting}
                  size="large"
                  placeholder="Last Name"
                  onChange={handleChange}
                />
                {errors.lastName && touched.lastName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
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
                Tags{" "}
                <Tooltip
                  placement="top"
                  title={
                    "Tags are a way to specify the type of jobs/companies you're interested in."
                  }
                >
                  <QuestionCircleOutlined
                    twoToneColor={true}
                    trigger={["hover", "click"]}
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
                onChange={(value) => setFieldValue("tags", value)}
              >
                {tags.map((tag, index) => (
                  <Option key={tag.name + index} value={tag.name}>
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
                  onChange={(value) => setFieldValue("state", value)}
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
                  placeholder="password"
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
              Submit
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
    name: "",
    email: "",
    description: "",
    tags: [],
    streetAddress: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const companyValidation = yup.object().shape({
    name: yup.string().required("Please enter company name"),
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter a valid email address"),
    description: yup.string(),
    tags: yup.array().min(1, "Please select at least 1 tag"),
    streetAddress: yup.string().required("Please enter company street address "),
    state: yup.string().required("Please select a state"),
    password: yup
      .string()
      .required("Please enter your password")
      .min(8, "Password should be at least 8 characters long"),
    confirmPassword: yup
      .string()
      .required("Please enter password again")
      .oneOf([yup.ref("password"), null], "Password must match"),
  });
  return (
    <Formik
      initialValues={initalValues}
      validationSchema={companyValidation}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue, touched, errors }) => {
        return (
          <form className="w-full max-w-2xl shadow my-8 p-8" onSubmit={handleSubmit}>
            <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
              <div className="w-full mb-4">
                <label htmlFor="firstName" className="font-medium">
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
                Tags{" "}
                <Tooltip
                  placement="top"
                  title={
                    "Tags are a way of letting applicants know the type of work you do as a company."
                  }
                >
                  <QuestionCircleOutlined
                    twoToneColor={true}
                    trigger={["hover", "click"]}
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
                onChange={(value) => setFieldValue("tags", value)}
              >
                {tags.map((tag, index) => (
                  <Option key={tag.name + index} value={tag.name}>
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
                  onChange={(value) => setFieldValue("state", value)}
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
                  placeholder="password"
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
              Submit
            </Button>
          </form>
        );
      }}
    </Formik>
  );
}

export async function getStaticProps(context) {
  let states = [];
  let tags = [];
  try {
    let res = await axios.get("/states/get-states");
    states = res.data.states;
    res = await axios.get("/tags/get-tags");
    tags = res.data.tags;
  } catch (error) {
    console.log(error);
  } finally {
    return {
      props: {
        states,
        tags,
      },
    };
  }
}

export default Signup;
