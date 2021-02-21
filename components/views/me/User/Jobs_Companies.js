import { Badge, Button, Popover, Table, Tabs, Tag } from 'antd';
import { toaster } from 'evergreen-ui';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../../../store/globalContext';
import handleError from '../../../../utils/handleAPIErrors';
import makeAPICall from '../../../../utils/makeApiCall';

function Jobs_Companies() {
  const { TabPane } = Tabs;
  return (
    <div className="w-full mx-auto my-8 p-8 px-3 pt-0 phone:p-3">
      <p className="text-xl font-medium mb-5">Job and Companies</p>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Saved Jobs" key="1">
          <SavedJobs />
        </TabPane>
        <TabPane tab="Applied Jobs" key="2">
          <AppliedJobs />
        </TabPane>
        <TabPane tab="Subscribed Companies" key="3">
          <SubscribedCompanies />
        </TabPane>
      </Tabs>
    </div>
  );
}

function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [fetchingJobs, setFetchingJobs] = useState(false);
  const [unsaving, setUnsaving] = useState(false);

  const { state, actions } = useContext(GlobalContext);

  const { user, token } = state;

  TimeAgo.addLocale(en);

  const timeAgo = new TimeAgo('en-US');

  useEffect(() => {
    getUserSavedJobs();
  }, []);

  const getUserSavedJobs = async () => {
    // console.log('hahahaha');
    setFetchingJobs(true);
    try {
      const { data } = await makeAPICall('/posts/get-saved-posts', {
        method: 'get',
        headers: {
          'x-auth-token': token,
        },
      });

      setJobs(data.posts);
    } catch (error) {
      handleError("Couldn't get jobs", error);
    } finally {
      setFetchingJobs(false);
    }
  };

  const unsaveJob = async (postID) => {
    setUnsaving(true);
    try {
      const { data } = await makeAPICall('/posts/unsave-post', {
        method: 'post',
        headers: {
          'x-auth-token': token,
        },
        data: {
          postId: postID,
        },
      });

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          savedPosts: data.savedPosts,
        }),
      );

      actions({
        type: 'setUser',
        payload: {
          ...user,
          savedPosts: data.savedPosts,
        },
      });

      getUserSavedJobs();

      toaster.success('Job unsaved successfully');
    } catch (error) {
      handleError('Could not fecth saved jobs', error);
    } finally {
      setUnsaving(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title, record) => {
        return (
          <a href={`/job/${record._id}`} className="underline text-primary">
            {title}
          </a>
        );
      },
    },
    {
      title: 'Company',
      dataIndex: 'companyId',
      render: (company) => {
        return (
          <a href={`/company/${company._id}`} className="underline text-primary">
            {company.name}
          </a>
        );
      },
    },
    {
      title: 'Posted',
      dataIndex: 'createdAt',
      render: (date) => {
        return <p>{timeAgo.format(new Date(date))}</p>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        return (
          <span className="flex items-center">
            <Badge
              status={`${
                status === 'Active' ? 'processing' : status === 'Suspended' ? 'warning' : 'error'
              }`}
            />
            {status}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      dataIndex: 'responses',
      render: (res, record) => {
        return (
          <Button
            type="link"
            disable={unsaving || fetchingJobs}
            className="text-yellow-600"
            onClick={() => unsaveJob(record._id)}
          >
            {unsaving ? 'Removing' : 'Remove'}
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={jobs}
      loading={fetchingJobs || unsaving}
      columns={columns}
      className="w-full"
      scroll={{ x: 500 }}
      pagination={{
        pageSize: 10,
      }}
    />
  );
}

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const [fetchingJobs, setFetchingJobs] = useState(false);

  const { state, actions } = useContext(GlobalContext);

  const { user, token } = state;

  TimeAgo.addLocale(en);

  const timeAgo = new TimeAgo('en-US');

  useEffect(() => {
    getUserAppliedJobs();
  }, []);

  const getUserAppliedJobs = async () => {
    // console.log('hahahaha');
    setFetchingJobs(true);
    try {
      const { data } = await makeAPICall('/posts/get-posts', {
        method: 'get',
        headers: {
          'x-auth-token': token,
        },
      });

      setJobs(data.posts);
    } catch (error) {
      handleError("Could't get jobs", error);
    } finally {
      setFetchingJobs(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title, record) => {
        return (
          <a href={`/job/${record._id}`} className="underline text-primary">
            {title}
          </a>
        );
      },
    },
    {
      title: 'Company',
      dataIndex: 'companyId',
      render: (company) => {
        return (
          <a href={`/company/${company._id}`} className="underline text-primary">
            {company.name}
          </a>
        );
      },
    },
    {
      title: 'Posted',
      dataIndex: 'createdAt',
      render: (date) => {
        return <p>{timeAgo.format(new Date(date))}</p>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'responses',
      render: (responses) => {
        return (
          <span className="flex items-center">
            <Badge
              status={`${
                responses[0].status === 'Shortlisted'
                  ? 'success'
                  : responses[0].status === 'Under Review'
                  ? 'processing'
                  : 'error'
              }`}
            />
            {responses[0].status}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      dataIndex: 'responses',
      render: (response) => {
        return (
          <Popover
            content={
              <div>
                <p className="font-semibold">Resume</p>
                <a
                  href={response[0].resume.url}
                  target="_blank"
                  rel="noopener"
                  className="text-primary underline"
                >
                  {response[0].resume.name}
                </a>
                <p className="font-semibold mt-5">Skills</p>
                <div className="flex">
                  {response[0].skills.map((skill, index) => {
                    return (
                      <Popover
                        content={
                          <div>
                            <p className="font-semibold">{skill?.name}</p>
                            <p>Years Of Experience: {skill?.yearsOfExperience}</p>
                          </div>
                        }
                      >
                        <Tag color="geekblue" className="mb-1" key={skill?.name + index}>
                          {skill?.name} - {skill?.yearsOfExperience}
                        </Tag>
                      </Popover>
                    );
                  })}
                </div>
              </div>
            }
            trigger="click"
          >
            <Button type="link">View Application</Button>;
          </Popover>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={jobs}
      loading={fetchingJobs}
      columns={columns}
      className="w-full"
      scroll={{ x: 500 }}
      pagination={{
        pageSize: 10,
      }}
    />
  );
}

function SubscribedCompanies() {
  const [companies, setCompanies] = useState([]);
  const [fetchingCompanies, setFetchingCompanies] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);

  const { state, actions } = useContext(GlobalContext);

  const { user, token } = state;

  useEffect(() => {
    getUserSubscribedCompanies();
  }, []);

  const getUserSubscribedCompanies = async () => {
    // console.log('hahahaha');
    setFetchingCompanies(true);
    try {
      const { data } = await makeAPICall('/user/get-companies', {
        method: 'get',
        headers: {
          'x-auth-token': token,
        },
      });

      setCompanies(data.companies);
    } catch (error) {
      handleError("Couldn't get companies", error);
    } finally {
      setFetchingCompanies(false);
    }
  };

  const unSubscribeToCompany = async (companyId) => {
    setUnsubscribing(true);
    try {
      // console.log(post._id);
      const { data } = await makeAPICall('/company/unsubscribe-to-companies', {
        method: 'post',
        headers: {
          'x-auth-token': token,
        },
        data: {
          companyId: companyId,
        },
      });

      let newSavedCompanies = user.subscribed.filter((com) => {
        if (com != companyId) return com;
      });

      localStorage.setItem('user', JSON.stringify({ ...user, subscribed: newSavedCompanies }));

      actions({ type: 'setUser', payload: { ...user, subscribed: newSavedCompanies } });

      getUserSubscribedCompanies();

      toaster.success('Unsubscribed from company successfully.');
    } catch (error) {
      console.log(error);
      handleError('Unable to unsubscribe from company.', error);
    } finally {
      setUnsubscribing(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name, record) => {
        return (
          <a href={`/company/${record._id}`} className="underline text-primary">
            {name}
          </a>
        );
      },
    },
    {
      title: 'Actions',
      dataIndex: 'responses',
      width: 150,
      render: (res, record) => {
        return (
          <Button
            type="link"
            disable={unsubscribing || fetchingCompanies}
            className="text-yellow-600"
            onClick={() => unSubscribeToCompany(record._id)}
          >
            {unsubscribing ? 'Unsubscribing' : 'Unsubscribe'}
          </Button>
        );
      },
    },
  ];
  return (
    <Table
      dataSource={companies}
      loading={fetchingCompanies}
      columns={columns}
      className="w-full"
      scroll={{ x: 500 }}
      pagination={{
        pageSize: 10,
      }}
    />
  );
}

export default Jobs_Companies;
