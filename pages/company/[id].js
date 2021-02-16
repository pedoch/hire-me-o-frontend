import { Avatar, Button, Tag } from 'antd';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Head from 'next/head';
import { useContext, useState } from 'react';
import MainLayout from '../../components/common/MainLayout';
import GlobalContext from '../../store/globalContext';
import handleError from '../../utils/handleAPIErrors';
import makeApiCall from '../../utils/makeApiCall';

function Company({ company }) {
  const [subcribing, setSubcribing] = useState(false);
  const { state, actions } = useContext(GlobalContext);

  TimeAgo.addLocale(en);

  const timeAgo = new TimeAgo('en-US');

  const { user, token } = state;

  const subscribeToCompany = async () => {
    if (!user) return window.location.replace(`/login?redirectURL=/job/${company._id}`);

    if (user.name)
      return toaster.danger("You can't perform the action.", {
        description: 'Only users can subscribe to companies',
      });

    setSubcribing(true);
    try {
      // console.log(post._id);
      const { data } = await makeApiCall('/company/subscribe-to-companies', {
        method: 'post',
        headers: {
          'x-auth-token': token,
        },
        data: {
          companyId: company._id,
        },
      });

      let newSavedCompanies = [...user.subscribed, company._id];

      localStorage.setItem('user', JSON.stringify({ ...user, subscribed: newSavedCompanies }));

      actions({ type: 'setUser', payload: { ...user, subscribed: newSavedCompanies } });

      toaster.success('Company subscribed successfully.');
    } catch (error) {
      console.log(error);
      handleError('Unable to subscribe to company.', error);
    } finally {
      setSubcribing(false);
    }
  };

  const unSubscribeToCompany = async () => {
    if (!user) return window.location.replace(`/login?redirectURL=/job/${company._id}`);

    if (user.name)
      return toaster.danger("You can't perform the action.", {
        description: 'Only users can subscribe to companies',
      });

    setSubcribing(true);
    try {
      // console.log(post._id);
      const { data } = await makeApiCall('/company/unsubscribe-to-companies', {
        method: 'post',
        headers: {
          'x-auth-token': token,
        },
        data: {
          companyId: company._id,
        },
      });

      let newSavedCompanies = user.subscribed.filter((com) => {
        if (com != company._id) return com;
      });

      localStorage.setItem('user', JSON.stringify({ ...user, subscribed: newSavedCompanies }));

      actions({ type: 'setUser', payload: { ...user, subscribed: newSavedCompanies } });

      toaster.success('Unsubscribed from company successfully.');
    } catch (error) {
      console.log(error);
      handleError('Unable to unsubscribe from company.', error);
    } finally {
      setSubcribing(false);
    }
  };
  return (
    <MainLayout>
      <Head>
        <title>{company.name} | Hire Me O!</title>
      </Head>
      <div className="w-full bg-primary py-10 px-5">
        <div className="w-full mx-auto" style={{ maxWidth: '1500px' }}>
          <p className="text-4xl font-semibold text-white">Company...</p>
        </div>
      </div>
      <div className="w-full max-w-5xl mx-auto pt-10 text-lg flex justify-between px-5 smallTablet:flex-wrap">
        <div className="max-w-2xl">
          <div className="flex mb-5 items-end">
            <Avatar shape="square" size={100} className="mr-2" src={company.profilePicture}>
              {company.name}
            </Avatar>
            <p className="text-2xl font-bold">{company.name}</p>
          </div>
          <p className="text-lg font-semibold mb-5">{company.description}</p>
          <p className="text-lg font-semibold mb-5">{company.subscribers || 0} Subscribers</p>
          <p className="mb-5">
            {company.streetAddress && company.streetAddress + ', '}
            {company.state}
          </p>
          {company.tags && (
            <>
              <p className="text-lg font-semibold mb-2">Tags</p>
              <div className="flex mb-5">
                {company.tags.map((tag, index) => (
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
              type="primary"
              disabled={subcribing}
              onClick={() => {
                if (user?.subscribed?.includes(company._id)) unSubscribeToCompany();
                else subscribeToCompany();
              }}
            >
              {user?.subscribed?.includes(company._id) && subcribing
                ? 'Unsubcribing'
                : subcribing
                ? 'Subcribing'
                : user?.subscribed?.includes(company._id)
                ? 'Unsubcribe'
                : 'Subscribe'}
            </Button>
          </div>
        )}
      </div>
      <div className="w-full max-w-5xl mx-auto pb-10 text-lg px-5 smallTablet:flex-wrap">
        <hr className="w-full" />
        <p className="mb-5 text-center text-2xl font-semibold mt-5">Posted Jobs</p>
        <div
          className="w-full grid justify-center grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
          style={{ maxWidth: '1500px' }}
        >
          {company?.posts && company?.posts.length > 0 ? (
            company?.posts?.map((job, index) => (
              <a key={job.title + index} href={`/job/${job._id}`} className="hover:text-black">
                <div className="col-span-1 shadow rounded p-4 m-2 flex flex-col justify-between hover:shadow-lg">
                  <span>
                    <p className="font-semibold text-lg">{job.title}</p>
                  </span>
                  <div className="flex justify-between">
                    <p className="text-sm">{timeAgo.format(new Date(job.createdAt))}</p>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p>This company has no posts 😢</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const { data } = await axios({
    url: 'https://hire-me-o.herokuapp.com/api/company/get-all-companies',
    method: 'get',
  });

  const ids = data.companies.map((company) => company._id);

  const paths = ids.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { id } }) {
  const { data } = await axios({
    url: 'https://hire-me-o.herokuapp.com/api/company/get-all-companies',
    method: 'get',
  });

  const company = data.companies.find((x) => x._id === id);

  return {
    props: {
      company,
    },
  };
}

export default Company;
