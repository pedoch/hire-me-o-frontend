import { Avatar, Skeleton } from 'antd';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { useEffect, useState } from 'react';
import handleError from '../../../utils/handleAPIErrors';
import makeApiCall from '../../../utils/makeApiCall';
import FilterWidget from './FilterWidget';

function SearchJobs({ jobs, setJobs, tags, states, text, tagSet }) {
  const [jobsLoading, setJobsLoading] = useState(false);
  const [name, setName] = useState('');
  const [state, setState] = useState([]);
  const [tagss, setTags] = useState([]);

  TimeAgo.addLocale(en);

  const timeAgo = new TimeAgo('en-US');

  useEffect(() => {
    if (tagSet) setTags([tagSet]);
  }, []);

  const queryJobs = async () => {
    setJobsLoading(true);
    try {
      let qry = '';
      if (name) qry = `${qry}name=${name}`;
      if (tagss) qry = `${qry && '' + qry + '&'}tags=${tagss.join()}`;
      if (state) qry = `${qry && '' + qry + '&'}state=${state}`;

      let { data } = await makeApiCall(`/posts/get-filtered-posts?${qry}`, { method: 'get' });

      setJobs(data.post);
    } catch (error) {
      handleError('Unable to search for jobs', error);
    } finally {
      setJobsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto my-8 phone:p-3">
      <FilterWidget
        states={states}
        tags={tags}
        text={text}
        name={name}
        setName={setName}
        state={state}
        setState={setState}
        tagss={tagss}
        setTags={setTags}
        searching={jobsLoading}
        cb={queryJobs}
      />
      <p className="text-xl mb-10">Results:</p>
      {jobsLoading ? (
        <div
          className="w-full grid justify-center grid-cols-3 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
          style={{ maxWidth: '1500px' }}
        >
          {[1, 2, 3].map((job, index) => (
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
      ) : jobs.length > 0 ? (
        <div
          className="w-full grid justify-center grid-cols-3 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
          style={{ maxWidth: '1500px' }}
        >
          {jobs.map((job, index) => (
            <a href={`/job/${job._id}`} key={job.title + index} className="hover:text-black">
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
                  <a href={`/company/${job.companyId._id}`}>
                    <p className="text-lg font-semibold text-primary">{job.companyId.name}</p>
                  </a>
                </span>
                <div>
                  <p className="text-sm">{job.state}</p>
                  <p className="text-sm">{timeAgo.format(new Date(job.createdAt))}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p>Nothnig to see here...🙃</p>
      )}
    </div>
  );
}

export default SearchJobs;
