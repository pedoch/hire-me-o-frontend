import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Modal, Popconfirm, Radio, Tag, Upload } from 'antd';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import Head from 'next/head';
import { useContext, useState } from 'react';
import MainLayout from '../../components/common/MainLayout';
import GlobalContext from '../../store/globalContext';
import handleError from '../../utils/handleAPIErrors';
import makeApiCall from '../../utils/makeApiCall';

function Job({ post }) {
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [skills, setSkills] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [isShown, setIsShown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [skill, setSkill] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [skillError, setSkillError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedResumeError, setSelectedResumeError] = useState(null);
  const [confrimShown, setConfrimShown] = useState(false);

  const { state, actions } = useContext(GlobalContext);

  const { user, token } = state;

  const savePost = async () => {
    if (!user) return window.location.replace(`/login?redirectURL=/job/${post._id}`);

    if (user.name)
      return toaster.danger("You can't perform the action.", {
        description: 'Only users can save posts',
      });

    setSaving(true);
    try {
      // console.log(post._id);
      const { data } = await makeApiCall('/posts/save-post', {
        method: 'post',
        headers: {
          'x-auth-token': token,
        },
        data: {
          postId: post._id,
        },
      });

      let newSavedPosts = [...user.savedPosts, post._id];

      localStorage.setItem('user', JSON.stringify({ ...user, savedPosts: newSavedPosts }));

      actions({ type: 'setUser', payload: { ...user, savedPosts: newSavedPosts } });

      toaster.success('Job saved successfully.');
    } catch (error) {
      handleError('Unable to save post.', error);
    } finally {
      setSaving(false);
    }
  };

  const applyToPost = async () => {
    setApplying(true);
    try {
      const { data } = await makeApiCall('/posts/respond-to-post', {
        method: 'post',
        headers: {
          'x-auth-token': token,
        },
        data: {
          postId: post._id,
          resume: resumes[selectedResume],
          skills,
        },
      });

      let newSavedPosts = [...user.posts, post._id];

      localStorage.setItem('user', JSON.stringify({ ...user, posts: newSavedPosts }));

      actions({ type: 'setUser', payload: { ...user, posts: newSavedPosts } });

      toaster.success('Job application sent sucessfully.');

      setConfrimShown(false);
      setIsShown(false);
    } catch (error) {
      handleError('Unable to apply for post', error);
    } finally {
      setApplying(false);
    }
  };

  const CLOUDINARY_UPLOAD_PRESET = 'ayuedatm';

  return (
    <MainLayout>
      <Head>
        <title>{post.title} | Hire Me O!</title>
      </Head>
      <div className="w-full bg-primary py-10 px-5">
        <div className="w-full mx-auto" style={{ maxWidth: '1500px' }}>
          <p className="text-4xl font-semibold text-white">Job...</p>
        </div>
      </div>
      <div className="w-full max-w-5xl mx-auto py-10 text-lg flex justify-between px-5 smallTablet:flex-wrap">
        <div className="max-w-2xl">
          <p className="text-2xl font-bold">{post.title}</p>
          <p className="mb-5 text-xl">
            at{' '}
            <a href={`/company/${post.companyId._id}`} className="font-bold text-primary">
              {post.companyId.name}
            </a>
          </p>
          <p className="text-lg font-semibold">Description</p>
          <p className="mb-5">{post.description}</p>
          <p className="text-lg font-semibold">Address</p>
          <p className="mb-5">
            {post.streetAddress && post.streetAddress + ', '}
            {post.state}
          </p>
          {post.requirements && (
            <>
              <p className="text-lg font-semibold">Requirements</p>
              <ul className="list-disc mb-5 ml-5">
                {post.requirements.map((req, index) => (
                  <li key={req + index}>{req}</li>
                ))}
              </ul>
            </>
          )}
          <p className="text-lg font-semibold">Salary</p>
          <p className="mb-5">
            {post.salary > 0
              ? `₦${post.salary?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
              : 'N/A'}
          </p>
          {post.skills && (
            <>
              <p className="text-lg font-semibold mb-2">Skills</p>
              <div className="flex mb-5">
                {post.skills.map((skill, index) => (
                  <Tag color="green" key={skill + index} className="mb-1">
                    {skill}
                  </Tag>
                ))}
              </div>
            </>
          )}
          {post.tags && (
            <>
              <p className="text-lg font-semibold mb-2">Tags</p>
              <div className="flex mb-5">
                {post.tags.map((tag, index) => (
                  <Tag color="geekblue" key={tag.name + index} className="mb-1 smallTablet:mb-10">
                    {tag.name}
                  </Tag>
                ))}
              </div>
            </>
          )}
        </div>

        {!user?.name && (
          <div className="flex mb-5">
            <Button
              size="large"
              className="mr-2"
              disabled={user?.savedPosts?.includes(post._id) || saving}
              onClick={() => savePost()}
            >
              {user?.savedPosts?.includes(post._id) ? 'Saved' : saving ? 'Saving' : 'Save Post'}
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                if (!user) return window.location.replace(`/login?redirectURL=/job/${post._id}`);

                if (user.name)
                  return toaster.danger("You can't perform the action.", {
                    description: 'Only users can save posts',
                  });

                setSkills(user?.skills || []);
                resumes.length < 1 && user.resume && setResumes([{ ...user.resume }]);

                console.log([{ ...user.resume }]);

                let index = 0;

                if (user.resume) {
                  if (selectedResume && selectedResume < resumes.length) index = selectedResume;
                  else index = 0;
                }
                setSelectedResume(index);

                setIsShown(true);
              }}
              disabled={user?.posts?.includes(post._id) || applying}
            >
              {user?.posts?.includes(post._id) ? 'Applied' : 'Apply to Job'}
            </Button>
          </div>
        )}
      </div>
      <Modal
        title={`Apply for ${post.title}`}
        wrapClassName="w-full max-w-6xl mx-auto"
        closable={true}
        maskClosable={true}
        visible={isShown}
        onCancel={() => setIsShown(false)}
        centered
        footer={null}
      >
        {currentSlide === 1 ? (
          <Skills
            skill={skill}
            setSkill={setSkill}
            skills={skills}
            setSkills={setSkills}
            skillError={skillError}
            setSkillError={setSkillError}
            yearsOfExperience={yearsOfExperience}
            setYearsOfExperience={setYearsOfExperience}
          />
        ) : (
          currentSlide === 2 && (
            <Resume
              resumes={resumes}
              setResumes={setResumes}
              selectedResume={selectedResume}
              setSelectedResume={setSelectedResume}
              selectedResumeError={selectedResumeError}
              setSelectedResumeError={setSelectedResumeError}
            />
          )
        )}
        <p className="mx-auto mb-3 text-center">{currentSlide}/2</p>
        <div className="w-full flex justify-end space-x-2">
          {currentSlide > 1 && (
            <Button onClick={() => setCurrentSlide(currentSlide - 1)}>Previous</Button>
          )}
          {currentSlide < 2 && (
            <Button type="primary" onClick={() => setCurrentSlide(currentSlide + 1)}>
              Next
            </Button>
          )}
          {currentSlide === 2 && (
            <Popconfirm
              title="Make sure your details are correct before you proceed."
              visible={confrimShown}
              onConfirm={() => {
                applyToPost();
              }}
              onCancel={() => setConfrimShown(false)}
              okButtonProps={{ loading: applying }}
            >
              <Button
                type="primary"
                onClick={() => {
                  setSelectedResumeError(null);
                  if (selectedResume === null)
                    return setSelectedResumeError('Please select or upload your resume.');
                  setConfrimShown(true);
                }}
              >
                Apply
              </Button>
            </Popconfirm>
          )}
        </div>
      </Modal>
    </MainLayout>
  );
}

const Skills = ({
  skill,
  setSkill,
  skills,
  setSkills,
  yearsOfExperience,
  setYearsOfExperience,
  skillError,
  setSkillError,
}) => {
  return (
    <div>
      <p className="text-xl font-semibold">Add custom skills for this application</p>
      <div className="flex phone:flex-wrap w-full space-x-5 phone:space-x-0">
        <div className="w-full mb-2">
          <label htmlFor="skill" className="font-medium">
            Skill
          </label>
          <Input
            name="skill"
            className="w-full"
            size="large"
            placeholder="Skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label htmlFor="yearsOfExperience" className="font-medium">
            Years of Experience Using Skill
          </label>
          <InputNumber
            name="yearsOfExperience"
            className="w-full"
            size="large"
            value={yearsOfExperience}
            onChange={(value) => setYearsOfExperience(value)}
          />
        </div>
      </div>
      {skillError && <p className="text-red-500 mt-1 text-sm">{skillError}</p>}
      <Button
        onClick={() => {
          setSkillError(null);
          if (!skill || !yearsOfExperience)
            return setSkillError('Skill name and years of experience required');

          setSkills([...skills, { name: skill, yearsOfExperience: yearsOfExperience }]);
          setSkill('');
          setYearsOfExperience(null);
        }}
        className="mt-2"
      >
        Add Skill
      </Button>
      <div className="flex flex-wrap w-full mt-5">
        {skills.map((skill, index) => {
          return (
            <p
              key={skill.name + index}
              className="font-semibold mb-2 mr-2 p-1 border border-gray-500 rounded h-auto"
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
    </div>
  );
};

const Resume = ({
  resumes,
  setResumes,
  selectedResume,
  setSelectedResume,
  selectedResumeError,
  setSelectedResumeError,
}) => {
  const [uploading, setUploading] = useState(false);

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
          url: 'https://api.cloudinary.com/v1_1/dsbogvjcc/upload/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: formData,
        });

        setResumes([...resumes, { name: file.name, url: data.secure_url }]);

        setSelectedResume(resumes.length);

        toaster.success('Resume uploaded sucessfully');

        // console.log(file);
      } catch (error) {
        console.error(error);
        handleError('Unable to upload photo', error);
      } finally {
        setUploading(false);
      }
    }
  };
  return (
    <div>
      <p className="text-xl font-semibold">Upload or select a custom resume for this application</p>
      <div className="mb-5 mt-3">
        {resumes && (
          <Radio.Group
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
            size="large"
          >
            {resumes.map((resume, index) => {
              return (
                <Radio className="block my-1" key={resume.name + index} value={index}>
                  {resume.name}
                </Radio>
              );
            })}
          </Radio.Group>
        )}
        {selectedResumeError && <p className="text-red-500 mt-1 text-sm">{selectedResumeError}</p>}
      </div>
      <Upload onChange={(info) => onUpload(info)} maxCount={'1'} multiple={false}>
        <Button className="mb-2" icon={<UploadOutlined />} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload New Resume'}
        </Button>
      </Upload>
    </div>
  );
};

export async function getStaticPaths() {
  const { data } = await axios({
    url: 'https://hire-me-o.herokuapp.com/api/posts/get-all-posts',
    method: 'get',
  });

  const ids = data.posts.map((post) => post._id);

  const paths = ids.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { id } }) {
  const { data } = await axios({
    url: 'https://hire-me-o.herokuapp.com/api/posts/get-all-posts',
    method: 'get',
  });

  const post = data.posts.find((x) => x._id === id);

  return {
    props: {
      post,
    },
  };
}

export default Job;
