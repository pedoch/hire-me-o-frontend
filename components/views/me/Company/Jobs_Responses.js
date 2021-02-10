import { Badge, Button, Modal, Popover, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../../../store/globalContext';
import handleErrors from '../../../../utils/handleAPIErrors';
import makeApiCall from '../../../../utils/makeApiCall';

function Job_Responses() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [responses, setResponses] = useState([]);
  const [responsesIsShown, setResponsesIsShown] = useState(false);

  const { state, actions } = useContext(GlobalContext);

  const { token } = state;

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data } = await makeApiCall('/company/get-posts', {
        method: 'get',
        headers: {
          'x-auth-token': token,
        },
      });

      setPosts(data.posts);
    } catch (error) {
      handleErrors('Unable to load posts', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const getResponses = async (post) => {
    setLoadingResponses(true);
    try {
      const { data } = await makeApiCall(`/posts/get-responses/${post._id}`, {
        method: 'get',
        headers: {
          'x-auth-token': token,
        },
      });

      console.log(data);

      setResponses(data.responses);
    } catch (error) {
      handleErrors('Unable to load responses', error);
    } finally {
      setLoadingResponses(false);
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', fixed: 'left' },
    { title: 'Employment Type', dataIndex: 'employmentType' },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (date) => {
        return <p className="whitespace-no-wrap">{dayjs(date).format('DD-MM-YYYY')}</p>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (desc) => (
        <Popover className="max-w-sm" content={<p>{desc}</p>}>
          <p className="overflow-ellipsis">{desc}</p>
        </Popover>
      ),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      render: (sal) => <p>₦{sal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags) => (
        <span>
          {tags.map((tag, index) => {
            let color = tag.name.length > 5 ? 'geekblue' : 'green';
            return (
              <Tag color={color} key={tag.name + index}>
                {tag.name}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'No. Of Applications',
      dataIndex: 'numberOfResponses',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <span className="flex">
          <Badge status={`${status === 'Active' ? 'success' : 'default'}`} />
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: '_id',
      render: (id, record) => (
        <span className="flex flex-col">
          <Button
            type="link"
            onClick={(e) => {
              setResponsesIsShown(true);
              getResponses(record);
            }}
          >
            Applicants
          </Button>
          <Button type="link" className="text-red-500 mb-1">
            Delete
          </Button>
        </span>
      ),
    },
  ];
  const responsesColumn = [
    {
      title: 'Name',
      dataIndex: 'userId',
      render: (user) => <p>{user?.firstname + ' ' + user?.lastname}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'userId',
      render: (user) => <a href={`mailto:${user.email}`}>{user.email}</a>,
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      render: (skills) => {
        return skills.map((skill, index) => {
          let color = skills?.name?.length > 5 ? 'geekblue' : 'green';
          return (
            <Popover
              content={
                <div>
                  <p>{skill?.name}</p>
                  <p>Years Of Experience: {skill?.yearsOfExperience}</p>
                </div>
              }
            >
              <Tag color={color} key={skill?.name + index}>
                {skill?.name} - {skill?.yearsOfExperience}
              </Tag>
            </Popover>
          );
        });
      },
    },
    {
      title: 'Resume',
      dataIndex: 'resume',
      render: (resume) => (
        <a href={resume?.url} target="_blank" rel="noopener" className="text-blue-500">
          {resume?.name}
        </a>
      ),
    },
  ];
  return (
    <div className="w-full mx-auto my-8 p-8 phone:p-3">
      <p className="text-xl font-medium mb-10">Job and Responses</p>
      <Table
        className="w-full min-w-full"
        columns={columns}
        dataSource={posts}
        loading={loadingPosts}
        scroll={{ x: 1000 }}
      />
      <Modal
        title="Responses"
        className="w-full min-w-full"
        visible={responsesIsShown}
        centered
        closable={true}
        maskClosable={true}
        onCancel={() => setResponsesIsShown(false)}
        wrapClassName="w-full max-w-6xl mx-auto"
        // style={{ width: '100%' }}
        footer={null}
      >
        <Table
          className="w-full min-w-full"
          columns={responsesColumn}
          dataSource={responses}
          loading={loadingResponses}
          scroll={{ x: 1000 }}
        />
      </Modal>
    </div>
  );
}

export default Job_Responses;
