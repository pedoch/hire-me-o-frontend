import { Avatar, Button, Input, Select, Skeleton } from 'antd';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { MainLayout } from '../components/common';
import GlobalContext from '../store/globalContext';
import handleError from '../utils/handleAPIErrors';
import makeApiCall from '../utils/makeApiCall';

function Home({ tags }) {
  const [loadingForYou, setLoadingForYou] = useState(false);
  const [topPostsForYou, setTopPostsForYou] = useState([]);
  const [loadingTopPosts, setLoadingTopPosts] = useState(false);
  const [topPosts, setTopPosts] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const { state, actions } = useContext(GlobalContext);

  const { user, token } = state;

  TimeAgo.addLocale(en);

  const timeAgo = new TimeAgo('en-US');

  useEffect(() => {
    getTopPosts();
    if (
      localStorage.getItem('userToken') &&
      JSON.parse(localStorage.getItem('user')) &&
      JSON.parse(localStorage.getItem('user')).firstname
    )
      getTopPostsForYou(localStorage.getItem('userToken'));
  }, []);

  const getTopPostsForYou = async (userToken) => {
    setLoadingForYou(true);
    try {
      const { data } = await makeApiCall('/posts/get-top-posts-for-you', {
        method: 'get',
        headers: {
          'x-auth-token': userToken,
        },
      });

      setTopPostsForYou(data.posts);
    } catch (error) {
      handleError('Unable to load top post specialised for you.', error);
    } finally {
      setLoadingForYou(false);
    }
  };

  const getTopPosts = async () => {
    setLoadingTopPosts(true);
    try {
      const { data } = await makeApiCall('/posts/get-top-posts', {
        method: 'get',
      });

      setTopPosts(data.posts);
    } catch (error) {
      handleError('Unable to load top post specialised for you.', error);
    } finally {
      setLoadingTopPosts(false);
    }
  };

  const { Option } = Select;

  return (
    <MainLayout>
      <Head>
        <title>Home | Hire Me O!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{ backgroundImage: `url("/images/jumbotron-home.jpg")`, height: '500px' }}
        className="w-full bg-center bg-green-700 bg-cover"
        title="Photo by Free To Use on Unsplash"
      ></div>
      <div className="w-full flex flex-col justify-center items-center py-8 px-4 shadow">
        <p className="font-semibold text-2xl mb-4">
          {!user
            ? 'Find the right job for you!'
            : user.firstname
            ? 'Find the right job for you!'
            : 'Search for jobs...'}
        </p>
        <Input.Group compact className="w-full max-w-xl flex flex-no-wrap">
          <Select
            style={{ width: '75%' }}
            size="large"
            defaultActiveFirstOption={true}
            placeholder="Select a Tag"
            value={selectedTag}
            showSearch
            allowClear
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => setSelectedTag(value)}
            onFocus={() => setSearchError(null)}
          >
            {tags.map((tag, index) => (
              <Option key={tag.name + index} value={tag._id}>
                {tag.name}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            size="large"
            style={{ width: '25%' }}
            onClick={() => {
              if (!selectedTag) return setSearchError('Please select a tag to search.');
              window.location.replace(`/search?tags=${selectedTag}`);
            }}
          >
            Search
          </Button>
        </Input.Group>
        {searchError && <p className="text-red-500">{searchError}</p>}
      </div>
      {!user && (
        <div className="w-full py-8 px-4 flex flex-col items-center">
          <p className="text-2xl mb-8">
            Are you an <b>Recruit</b> or a <b>Recruiter</b>?
          </p>
          <div
            className="w-full justify-around flex text-lg flex-wrap"
            style={{ maxWidth: '1000px' }}
          >
            <p className="shadow rounded max-w-md p-8 text-center mt-4">
              <a href="/signup?selected=company" className="text-green-700 font-semibold">
                SIGN UP
              </a>{' '}
              as a Recruiter and register your company/business and gain access to potential
              employees.
            </p>
            <p className="shadow rounded max-w-md p-8 text-center mt-4">
              <a href="/signup?selected=seeker" className="text-green-700 font-semibold">
                SIGN UP
              </a>{' '}
              as a Recruit, build your profile, upload your CV and start applying for your dream
              job!
            </p>
          </div>
        </div>
      )}
      {user?.firstname && (
        <div className="w-full py-8 px-4 flex flex-col items-center">
          <p className="text-2xl mb-2 font-semibold">Recomended Jobs for You</p>
          <hr className="w-full max-w-xs mb-8" />
          {loadingForYou ? (
            <div
              className="w-full grid justify-center grid-cols-4 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
              style={{ maxWidth: '1500px' }}
            >
              {[1, 2, 3, 4].map((job, index) => (
                <div
                  key={index}
                  className="col-span-1 shadow h-56 rounded p-4 m-2 flex flex-col justify-between hover:shadow-lg"
                >
                  <span>
                    <Skeleton.Avatar size={64} shape="square" active={true} />
                    <Skeleton paragraph={{ rows: 1 }} active={true} />
                  </span>
                </div>
              ))}
            </div>
          ) : topPostsForYou.length < 1 ? (
            <p className="text-xl font-semibold">No posts here</p>
          ) : (
            <div
              className="w-full grid justify-center grid-cols-4 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
              style={{ maxWidth: '1500px' }}
            >
              {topPostsForYou.map((job, index) => (
                <a href={`/job/${job._id}`} className="hover:text-black">
                  <div className="col-span-1 shadow h-56 rounded p-4 m-2 flex flex-col justify-between hover:shadow-lg">
                    <span>
                      <Avatar
                        shape="square"
                        size={64}
                        className="mb-2"
                        src={job.companyId.profilePicture}
                      >
                        {job.companyId.name}
                      </Avatar>
                      <p className="font-semibold text-lg">{job.title} at:</p>
                      <a
                        className="text-lg font-semibold text-primary"
                        href={`/company/${job.companyId._id}`}
                      >
                        {job.companyId.name}
                      </a>
                    </span>
                    <div>
                      <p className="text-sm">{job.state}</p>
                      <div className="flex justify-between">
                        <p className="text-sm">{timeAgo.format(new Date(job.createdAt))}</p>
                        <p className="text-sm">
                          {job.numberOfResponses}{' '}
                          {job.numberOfResponses === 1 ? 'applicant' : 'applicants'}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="w-full py-8 px-4 flex flex-col items-center">
        <p className="text-2xl mb-2 font-semibold">Top Jobs</p>
        <hr className="w-full max-w-xs mb-8" />
        {loadingTopPosts ? (
          <div
            className="w-full grid justify-center grid-cols-4 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
            style={{ maxWidth: '1500px' }}
          >
            {[1, 2, 3, 4].map((job, index) => (
              <div
                key={index}
                className="col-span-1 shadow h-56 rounded p-4 m-2 flex flex-col justify-between hover:shadow-lg"
              >
                <span>
                  <Skeleton.Avatar size={64} shape="square" active={true} />
                  <Skeleton paragraph={{ rows: 1 }} active={true} />
                </span>
              </div>
            ))}
          </div>
        ) : topPosts.length < 1 ? (
          <p className="text-xl font-semibold">No posts here</p>
        ) : (
          <div
            className="w-full grid justify-center grid-cols-4 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
            style={{ maxWidth: '1500px' }}
          >
            {topPosts.map((job, index) => (
              <a key={job.title + index} href={`/job/${job._id}`} className="hover:text-black">
                <div className="col-span-1 shadow h-56 rounded p-4 m-2 flex flex-col justify-between hover:shadow-lg">
                  <span>
                    <Avatar
                      shape="square"
                      size={64}
                      className="mb-2"
                      src={job.companyId.profilePicture}
                    >
                      {job.companyId.name}
                    </Avatar>
                    <p className="font-semibold text-lg">{job.title} at:</p>
                    <a
                      className="text-lg font-semibold text-primary"
                      href={`/company/${job.companyId._id}`}
                    >
                      {job.companyId.name}
                    </a>
                  </span>
                  <div>
                    <p className="text-sm">{job.state}</p>
                    <div className="flex justify-between">
                      <p className="text-sm">{timeAgo.format(new Date(job.createdAt))}</p>
                      <p className="text-sm">
                        {job.numberOfResponses}{' '}
                        {job.numberOfResponses === 1 ? 'applicant' : 'applicants'}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="w-full py-8 px-4 flex flex-col items-center mb-16">
        <p className="text-2xl mb-2 font-semibold">Job Categories</p>
        <hr className="w-full max-w-xs mb-8" />
        {tags ? (
          <ul className="ul-list-spread" style={{ maxWidth: '1500px' }}>
            {tags.map((tag, index) => (
              <a
                key={index}
                href={`/search?tags=${tag._id}`}
                className="hover:text-green-700 hover:underline"
              >
                <li className="text-lg mb-2">{tag.name}</li>
              </a>
            ))}
          </ul>
        ) : (
          <p>Oops! Something is wrong</p>
        )}
      </div>
    </MainLayout>
  );
}

export async function getStaticProps(context) {
  let tags = [];
  try {
    let { data } = await makeApiCall('/tags/get-tags', { method: 'get' });

    tags = data.tags;
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      tags,
    },
  };
}

export default Home;
