import { Tabs } from 'antd';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { MainLayout } from '../components/common';
import SearchCompanies from '../components/views/search/SearchCompanies';
import SearchJobs from '../components/views/search/SearchJobs';
import makeApiCall from '../utils/makeApiCall';

function Search({ postList, companyList, tags, states, tagSet }) {
  const [searchError, setSearchError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    setJobs(postList);
    setCompanies(companyList);
  }, []);

  const { TabPane } = Tabs;

  return (
    <MainLayout>
      <Head>
        <title>Search | Hire Me O!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full bg-primary py-10 px-5">
        <div className="w-full mx-auto" style={{ maxWidth: '1500px' }}>
          <p className="text-4xl font-semibold text-white">Search...</p>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center py-8 px-4 shadow">
        <p className="font-semibold text-2xl mb-4">Search Hire Me O!</p>
      </div>
      <div className="w-full max-w-6xl mx-auto my-8 px-2">
        <Tabs defaultActiveKey="1" centered={true}>
          <TabPane tab="Jobs" key="1">
            <SearchJobs
              jobs={jobs}
              setJobs={setJobs}
              tags={tags}
              states={states}
              text={'Job Title'}
              tagSet={tagSet}
            />
          </TabPane>
          <TabPane tab="Companies" key="2">
            <SearchCompanies
              companies={companies}
              setCompanies={setCompanies}
              tags={tags}
              states={states}
              text={'Company Name'}
              tagSet={tagSet}
            />
          </TabPane>
        </Tabs>
      </div>
    </MainLayout>
  );
}

Search.getInitialProps = async ({ query }) => {
  const { name, tags, state } = query;
  let posts = [];
  let companies = [];
  let tagss = [];
  let states = [];

  try {
    let qry = '';
    if (name) qry = `${qry}name=${name}`;
    if (tags) qry = `${qry && '' + qry + '&'}tags=${tags}`;
    if (state) qry = `${qry && '' + qry + '&'}state=${state}`;

    let { data } = await makeApiCall(`/posts/get-filtered-posts?${qry}`, { method: 'get' });
    posts = data.post;
    companies = data.companies;

    let res = await makeApiCall('/tags/get-tags', { method: 'get' });
    tagss = res.data.tags;

    res = await makeApiCall('/states/get-states', { method: 'get' });
    states = res.data.states;
  } catch (error) {
    console.log(error);
  }

  return {
    postList: posts,
    companyList: companies,
    tags: tagss,
    states: states,
    tagSet: tags,
  };
};

export default Search;
