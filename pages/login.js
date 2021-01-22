import { Button, Input } from "antd";
import { Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import * as yup from "yup";
import { MainLayout } from "../components/common";

function Login() {
  const [submitting, setSubmitting] = useState(false);
  const [initalValues, setInitialValues] = useState({ email: "", password: "" });
  const loginValidation = yup.object().shape({
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter a valid email address"),
    password: yup.string().required("Please enter your password"),
  });
  return (
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
              try {
                setSubmitting(true);
                console.log(values);
              } catch (err) {
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => {
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
            Don't have an account?{" "}
            <Link href="/signup">
              <a className="text-green-500">SIGN UP</a>
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default Login;
