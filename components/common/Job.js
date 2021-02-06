import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Select, Tooltip } from 'antd';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import GlobalContext from '../../store/globalContext';
import handleError from '../../utils/handleAPIErrors';
import makeApiCall from '../../utils/makeApiCall';

function CreateJob({ job }) {
  const [submitting, setSubmitting] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [skills, setSkills] = useState([]);
  const [states, setStates] = useState([]);
  const [tags, setTags] = useState([]);
  const [fetchingStates, setFecthingStates] = useState(false);
  const [fetchingTags, setFecthingTags] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    employmentType: '',
    streetAddress: '',
    state: '',
    salary: 0,
    requirements: '',
    tags: [],
    skills: '',
  });

  const { Option } = Select;

  const { state, actions } = useContext(GlobalContext);

  const { token, user } = state;

  useEffect(() => {
    fetchStates();
    fetchTags();
    setRequirements([]);
    setSkills([]);
  }, []);

  const jobValidationSchema = yup.object().shape({
    title: yup.string().required('Please enter job title.'),
    description: yup.string().required('Please enter job description.'),
    employmentType: yup.string().required('Please select employment type.'),
    streetAddress: yup.string(),
    state: yup.string(),
    salary: yup.number(),
    tags: yup.array().min(1, 'Please select at least 1 tag.'),
  });

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

  const fetchTags = async () => {
    setFecthingTags(true);
    try {
      let res = await makeApiCall('/tags/get-tags', { method: 'get' });

      setTags(res.data.tags);

      setFecthingTags(false);
    } catch (error) {
      setFecthingTags(false);
    }
  };
  return (
    <div className="w-full">
      <Formik
        initialValues={job || initialValues}
        validationSchema={jobValidationSchema}
        enableReinitialize
        onSubmit={async (values, { setFieldError, resetForm }) => {
          setSubmitting(true);
          try {
            if (skills.length <= 0) return setFieldError('skills', 'Add at least one skill.');
            if (requirements.length <= 0)
              return setFieldError('requirements', 'Add at least one requirement.');

            const { data } = await makeApiCall('/posts/create-post', {
              method: 'post',
              headers: {
                'x-auth-token': token,
              },
              data: { ...values, requirements, skills },
            });

            toaster.success('Job posted successfully.');

            resetForm();
            setSkills([]);
            setRequirements([]);
          } catch (error) {
            console.error(error);
            handleError('Unable to post job.', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          setFieldError,
          handleSubmit,
          errors,
          touched,
        }) => {
          return (
            <form className="w-full max-w-2xl mx-auto my-5" onSubmit={handleSubmit}>
              <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
                <div className="w-full mb-4">
                  <label htmlFor="title" className="font-medium">
                    Title
                  </label>
                  <Input
                    name="title"
                    className="w-full"
                    value={values.title}
                    size="large"
                    placeholder="Job Title"
                    onChange={handleChange}
                  />
                  {errors.title && touched.title && (
                    <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>
              </div>
              <div className="w-full mb-4">
                <label htmlFor="description" className="font-medium">
                  Description
                </label>
                <Input.TextArea
                  name="description"
                  className="w-full"
                  rows={5}
                  value={values.description}
                  size="large"
                  placeholder="Description"
                  onChange={handleChange}
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
              <div className="w-full mb-4">
                <label htmlFor="requirements" className="font-medium">
                  Requirements
                </label>
                <Input
                  name="requirements"
                  className="w-full"
                  value={values.requirements}
                  size="large"
                  placeholder="Requirement"
                  onChange={handleChange}
                />
                {errors.requirements && touched.requirements && (
                  <p className="mt-1 text-red-500 text-sm">{errors.requirements}</p>
                )}
                <Button
                  className="mt-2"
                  onClick={() => {
                    if (!values.requirements)
                      setFieldError('requirements', 'Requirement field is required');
                    else {
                      setRequirements([...requirements, values.requirements]);
                      setFieldValue('requirements', null);
                      setFieldError('requirements', '');
                    }
                  }}
                >
                  Add Requirement
                </Button>
                <ul className="list-none mt-2">
                  {requirements?.map((req, index) => {
                    return (
                      <li key={req + index}>
                        {req}{' '}
                        <DeleteOutlined
                          className="text-red-500"
                          onClick={() => {
                            setRequirements(
                              requirements.filter((rq, indx) => {
                                if (index != indx) return rq;
                              }),
                            );
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="w-full mb-4">
                <label htmlFor="skills" className="font-medium">
                  Skills
                </label>
                <Input
                  name="skills"
                  className="w-full"
                  value={values.skills}
                  size="large"
                  placeholder="Skill"
                  onChange={handleChange}
                />
                {errors.skills && touched.skills && (
                  <p className="mt-1 text-red-500 text-sm">{errors.skills}</p>
                )}
                <Button
                  className="mt-2"
                  onClick={() => {
                    if (!values.skills) setFieldError('skills', 'Skill field is required');
                    else {
                      setSkills([...skills, values.skills]);
                      setFieldValue('skills', null);
                      setFieldError('skills', '');
                    }
                  }}
                >
                  Add Skill
                </Button>
                <ul className="list-none mt-2 flex">
                  {skills?.map((skill, index) => {
                    return (
                      <li key={skill + index} className="mr-2">
                        {skill}{' '}
                        <DeleteOutlined
                          className="text-red-500"
                          onClick={() => {
                            setSkills(
                              skills.filter((skil, indx) => {
                                if (index != indx) return skil;
                              }),
                            );
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
                <div className="w-full mb-4">
                  <label htmlFor="employmentType" className="font-medium flex items-center">
                    Employment Type
                  </label>
                  <Select
                    name="employmentType"
                    className="w-full"
                    value={values.employmentType}
                    size="large"
                    placeholder="Select Employment Type"
                    onChange={(value) => setFieldValue('employmentType', value)}
                  >
                    <Option value="Full-Time">Full-Time</Option>
                    <Option value="Part-Time">Part-Time</Option>
                    <Option value="Contract">Contract</Option>
                  </Select>
                  {errors.employmentType && touched.employmentType && (
                    <p className="mt-1 text-red-500 text-sm">{errors.employmentType}</p>
                  )}
                </div>
                <div className="w-full mb-4">
                  <label htmlFor="salary" className="font-medium">
                    Salary (Optional)
                  </label>
                  <InputNumber
                    name="salary"
                    className="w-full"
                    value={values.salary}
                    size="large"
                    placeholder="Salary"
                    onChange={(value) => setFieldValue('salary', value)}
                  />
                  {errors.salary && touched.salary && (
                    <p className="mt-1 text-red-500 text-sm">{errors.salary}</p>
                  )}
                </div>
              </div>
              <div className="w-full mb-4">
                <label htmlFor="tags" className="font-medium flex items-center">
                  Tags{' '}
                  <Tooltip
                    placement="top"
                    title={
                      'Tags are a way of letting applicants know the type of work the job entails.'
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
                  disabled={fetchingTags}
                  value={values.tags}
                  size="large"
                  placeholder="Select Tags"
                  onChange={(value) => setFieldValue('tags', value)}
                >
                  {tags.map((tag, index) => (
                    <Option key={tag.name + index} value={tag._id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
                {fetchingTags && <p>Loading tags...</p>}
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
                    value={values.streetAddress}
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
                    disabled={fetchingStates}
                    size="large"
                    placeholder="Select State"
                    value={values.state}
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
                  {fetchingStates && <p>Loading states...</p>}
                  {errors.state && touched.state && (
                    <p className="mt-1 text-red-500 text-sm">{errors.state}</p>
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
    </div>
  );
}

export default CreateJob;
