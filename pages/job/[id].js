import { Button, Tag } from 'antd';
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
      console.log(post._id);
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

      actions('setUser', { ...user, savedPosts: newSavedPosts });

      toaster.success('Job saved successfully.');
    } catch (error) {
      handleError('Unable to save post.', error);
    } finally {
      setSaving(false);
    }
  };
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
        <div>
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

        <div className="flex mb-5">
          <Button
            size="large"
            className="mr-2"
            disabled={user?.savedPosts?.includes(post._id) || saving}
            onClick={() => savePost()}
          >
            {user?.savedPosts?.includes(post._id) ? 'Saved' : saving ? 'Saving' : 'Save Post'}
          </Button>
          <Button type="primary" size="large">
            Apply to Job
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

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
