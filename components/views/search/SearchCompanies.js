import { Avatar, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import handleError from '../../../utils/handleAPIErrors';
import makeApiCall from '../../../utils/makeApiCall';
import FilterWidget from './FilterWidget';

function SearchCompanies({ companies, setCompanies, tags, states, text, tagSet }) {
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [name, setName] = useState('');
  const [state, setState] = useState([]);
  const [tagss, setTags] = useState([]);

  useEffect(() => {
    if (tagSet) setTags([tagSet]);
  }, []);

  const queryCompanies = async () => {
    setCompaniesLoading(true);
    try {
      let qry = '';
      if (name) qry = `${qry}name=${name}`;
      if (tagss) qry = `${qry && '' + qry + '&'}tags=${tagss.join()}`;
      if (state) qry = `${qry && '' + qry + '&'}state=${state}`;

      let { data } = await makeApiCall(`/posts/get-filtered-posts?${qry}`, { method: 'get' });

      setCompanies(data.companies);
    } catch (error) {
      handleError('Unable to search for companies', error);
    } finally {
      setCompaniesLoading(false);
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
        searching={companiesLoading}
        cb={queryCompanies}
      />
      <p className="text-xl mb-10">Results:</p>
      {companiesLoading ? (
        <div
          className="w-full grid justify-center grid-cols-3 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
          style={{ maxWidth: '1500px' }}
        >
          {[1, 2, 3].map((job, index) => (
            <div
              key={index}
              className="col-span-1 shadow h-auto rounded p-4 m-2 flex flex-col justify-between hover:shadow-lg"
            >
              <span className="flex">
                <Skeleton.Avatar size={73} shape="square" className="mr-2" active={true} />
                <Skeleton paragraph={{ rows: 1 }} active={true} />
              </span>
            </div>
          ))}
        </div>
      ) : companies.length > 0 ? (
        <div
          className="w-full grid justify-center grid-cols-3 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
          style={{ maxWidth: '1500px' }}
        >
          {companies.map((company, index) => (
            <a
              href={`/company/${company._id}`}
              key={company.name + index}
              className="hover:text-black h-auto mb-2"
            >
              <div className="col-span-1 shadow rounded p-4 m-2 h-full flex flex-col justify-between hover:shadow-lg">
                <span className="flex">
                  <Avatar shape="square" size={73} className="mr-2" src={company.profilePicture}>
                    {company.name}
                  </Avatar>
                  <div className="h-full">
                    <p className="font-semibold text-lg">{company.name}</p>
                    <p className="">
                      {company.subscribers || 0}{' '}
                      {company.subscribers === 1 ? 'subscriber' : 'subscribers'}
                    </p>
                    <p className="text-sm mt-auto">{company.state}</p>
                  </div>
                </span>
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

export default SearchCompanies;
