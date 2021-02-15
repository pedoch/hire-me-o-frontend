import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Upload } from 'antd';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../../../store/globalContext';
import handleError from '../../../../utils/handleAPIErrors';
import makeApiCall from '../../../../utils/makeApiCall';

function Skills_Experience() {
  const [uploading, setUploading] = useState(false);
  const [deleteing, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [skills, setSkills] = useState([]);

  const { state, actions } = useContext(GlobalContext);

  const { user, token } = state;

  useEffect(() => {
    if (user?.skills && user?.skills?.length > 0) setSkills(user?.skills);
  }, []);

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
        formData.append('folder', '/hire-me-o/resumes/');

        const { data } = await axios({
          url: CLOUDINARY_URL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: formData,
        });

        const res = await makeApiCall('/user/update-resume', {
          method: 'POST',
          headers: {
            'x-auth-token': token,
          },
          data: {
            resume: {
              name: file.name,
              url: data.secure_url,
            },
          },
        });

        toaster.success(res.message);

        localStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            resume: {
              name: file.name,
              url: data.secure_url,
            },
          }),
        );

        actions({
          type: 'setUser',
          payload: {
            ...user,
            resume: {
              name: file.name,
              url: data.secure_url,
            },
          },
        });

        // console.log(file);
      } catch (error) {
        handleError('Unable to upload photo', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl my-8 phone:p-3">
      <p className="text-xl font-medium mb-10">Skils and Experience</p>
      <Formik
        initialValues={{
          skill: '',
          totalYearsOfExperience: user?.yearsOfExperience || 0,
          yearsOfExperience: 0,
        }}
        onSubmit={async (values) => {
          setSubmitting(true);
          try {
            const { message } = await makeApiCall('/user/edit-skills', {
              method: 'post',
              headers: {
                'x-auth-token': token,
              },
              data: {
                skills,
                yearsOfExperience: values.totalYearsOfExperience,
              },
            });

            toaster.success(message);

            localStorage.setItem(
              'user',
              JSON.stringify({
                ...user,
                skills,
                yearsOfExperience: values.totalYearsOfExperience,
              }),
            );
            actions({
              type: 'setUser',
              payload: {
                ...user,
                skills,
                yearsOfExperience: values.totalYearsOfExperience,
              },
            });
          } catch (error) {
            handleError('Unable to update user skills and experiences', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
          setFieldError,
          errors,
          touched,
        }) => {
          return (
            <form className="w-full max-w-4xl my-8" onSubmit={handleSubmit}>
              <div className="w-full flex flex-wrap space-x-2 mb-5 items-center">
                <Upload onChange={(info) => onUpload(info)} maxCount={'1'} multiple={false}>
                  <Button
                    className="mb-2"
                    icon={<UploadOutlined />}
                    disabled={uploading || deleteing}
                  >
                    {uploading
                      ? 'Uploading...'
                      : deleteing
                      ? 'Deleting'
                      : user?.resume
                      ? 'Change Resume'
                      : 'Upload Resume'}
                  </Button>
                </Upload>
                {user?.resume && (
                  <Button
                    type="link"
                    danger
                    onClick={async () => {
                      setDeleting(true);
                      try {
                        const res = await makeApiCall('/user/update-resume', {
                          method: 'POST',
                          headers: {
                            'x-auth-token': token,
                          },
                          data: { resume: null },
                        });

                        toaster.notify(res.message);

                        localStorage.setItem(
                          'user',
                          JSON.stringify({
                            ...user,
                            resume: null,
                          }),
                        );
                        actions({
                          type: 'setUser',
                          payload: {
                            ...user,
                            resume: null,
                          },
                        });
                      } catch (error) {
                        handleError('Unable to delete resume', error);
                      } finally {
                        setDeleting(false);
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
                {user?.resume && <p className="italic">{user?.resume?.name}</p>}
              </div>
              <hr className="mb-5" />
              <div className="w-full mb-5">
                <label htmlFor="totalYearsOfExperience" className="font-medium">
                  Years of Professional Work Experience
                </label>
                <InputNumber
                  visibilityToggle={true}
                  name="totalYearsOfExperience"
                  className="w-full"
                  size="large"
                  value={values.totalYearsOfExperience}
                  onChange={(value) => setFieldValue('totalYearsOfExperience', value)}
                />
                {errors.totalYearsOfExperience && touched.totalYearsOfExperience && (
                  <p className="mt-1 text-red-500 text-sm">{errors.totalYearsOfExperience}</p>
                )}
              </div>
              <hr className="mb-5" />
              <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
                <div className="w-full mb-4">
                  <label htmlFor="skill" className="font-medium">
                    Skill
                  </label>
                  <Input
                    name="skill"
                    className="w-full"
                    size="large"
                    placeholder="Skill"
                    value={values.skill}
                    onChange={handleChange}
                    onFocus={() => setFieldError('skill', '')}
                  />
                  {errors.skill && touched.skill && (
                    <p className="mt-1 text-red-500 text-sm">{errors.skill}</p>
                  )}
                </div>
                <div className="w-full mb-4">
                  <label htmlFor="yearsOfExperience" className="font-medium">
                    Years of Experience Using Skill
                  </label>
                  <InputNumber
                    name="yearsOfExperience"
                    className="w-full"
                    size="large"
                    value={values.yearsOfExperience}
                    onChange={(value) => setFieldValue('yearsOfExperience', value)}
                    onFocus={() => setFieldError('yearsOfExperience', '')}
                  />
                  {errors.yearsOfExperience && touched.yearsOfExperience && (
                    <p className="mt-1 text-red-500 text-sm">{errors.yearsOfExperience}</p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => {
                  setFieldError('skill', '');
                  setFieldError('yearsOfExperience', '');
                  if (values.skill.length < 1) setFieldError('skill', 'Skill name is required');
                  if (values.yearsOfExperience < 0)
                    setFieldError('yearsOfExperience', 'Years of experience of skill is required');
                  if (values.skill.length > 0 && values.yearsOfExperience >= 0) {
                    setSkills([
                      ...skills,
                      { name: values.skill, yearsOfExperience: values.yearsOfExperience },
                    ]);
                    setFieldValue('skill', '');
                    setFieldValue('yearsOfExperience', 0);
                  }
                }}
              >
                Add Skill
              </Button>
              <div className="flex flex-wrap w-full mt-5">
                {skills.map((skill, index) => {
                  return (
                    <p
                      key={skill.name + index}
                      className="text-lg font-semibold mb-2 mr-2 p-1 border border-gray-500 rounded h-auto"
                    >
                      {skill.name} - {skill.yearsOfExperience} year(s)
                      <DeleteOutlined
                        className="text-red-500 ml-2"
                        onClick={() => {
                          setSkills(
                            skills.filter((skll, indx) => {
                              if (index != indx) return skll;
                            }),
                          );
                        }}
                      />
                    </p>
                  );
                })}
              </div>
              <div className="w-full flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mr-2"
                  size="large"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

export default Skills_Experience;
