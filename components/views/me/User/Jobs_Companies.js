import { MoreOutlined } from '@ant-design/icons';
import { Badge, Button, Popover, Table, Tabs } from 'antd';
import { Spinner, toaster } from 'evergreen-ui';
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
          <p>Subscribed Companies</p>
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

      console.log(data);

      setJobs(data.posts);

      // toaster.success('Saved jobs fecthed successfully')
    } catch (error) {
      handleError('Could unsave job', error);
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

      // console.log(data);

      getUserSavedJobs();

      toaster.success('Job unsaved successfully');
    } catch (error) {
      handleError('Could not fecth saved jobs', error);
    } finally {
      setUnsaving(false);
    }
  };
  return (
    <div className="w-full grid justify-center mt-5 mx-5 pb-10 h-full grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1">
      {fetchingJobs ? (
        <div className="w-full flex justify-center">
          <Spinner size={30} />
        </div>
      ) : jobs.length > 0 ? (
        jobs.map((job, index) => {
          return (
            <div
              key={job.title + index}
              className="hover:text-black col-span-1 h-auto  flex justify-between p-3 mb-2 shadow"
            >
              <div>
                <a href={`/job/${job._id}`} className="font-semibold text-lg">
                  {job.title} at:
                </a>
                <br />
                <a
                  className="text-lg font-semibold text-primary"
                  href={`/company/${job.companyId._id}`}
                >
                  {job.companyId.name}
                </a>
                <div>
                  <p className="">{timeAgo.format(new Date(job.createdAt))}</p>
                  <p className="text-sm">{job.state}</p>
                </div>
              </div>
              <Popover
                content={
                  <div>
                    <Button
                      type="link"
                      danger
                      className="w-full bg-gray-600"
                      onClick={() => {
                        unsaveJob(job._id);
                      }}
                      disabled={unsaving}
                    >
                      Unsave Job
                    </Button>
                  </div>
                }
                trigger="click"
              >
                <MoreOutlined className="text-2xl" />
              </Popover>
            </div>
          );
        })
      ) : (
        <p>You have no saved jobs...</p>
      )}
    </div>
  );
}

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const [fetchingJobs, setFetchingJobs] = useState(false);
  const [unsaving, setUnsaving] = useState(false);

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

      console.log(data);

      setJobs(data.posts);

      // toaster.success('Saved jobs fecthed successfully')
    } catch (error) {
      handleError('Could unsave job', error);
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
        return <Button type="link">View Application</Button>;
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
    />
  );
}

export default Jobs_Companies;
