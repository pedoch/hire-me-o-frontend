import { Avatar, Input, Select } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { MainLayout } from '../components/common';
import makeApiCall from '../utils/makeApiCall';

function Home({ tags, states }) {
  const { Option } = Select;

  return (
    <MainLayout>
      <Head>
        <title>Home | Hire Me O!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{ backgroundImage: `url("/images/jumbotron-home.jpg")` }}
        className="w-full h-64 bg-left bg-green-700 bg-cover"
        title="Photo by Free To Use on Unsplash"
      ></div>
      <div className="w-full flex flex-col justify-center items-center py-8 px-4 shadow">
        <p className="font-semibold text-2xl mb-4">Find the right job for you!</p>
        <Input.Group compact className="w-full max-w-xl">
          <Select
            style={{ width: '40%' }}
            size="large"
            defaultActiveFirstOption={true}
            defaultValue="jobs"
          >
            <Option value="jobs">Jobs</Option>
            <Option value="company">Company</Option>
          </Select>
          <Input.Search
            style={{ width: '60%' }}
            size="large"
            placeholder="Search..."
            // enterButton="Search"
          />
        </Input.Group>
      </div>
      <div className="w-full py-8 px-4 flex flex-col items-center">
        <p className="text-2xl mb-8">
          Are you an <b>Employer</b> or a <b>Seeker</b>?
        </p>
        <div
          className="w-full justify-around flex text-lg flex-wrap"
          style={{ maxWidth: '1000px' }}
        >
          <p className="shadow rounded max-w-md p-8 text-center mt-4">
            <Link href="/signup?selected=company">
              <a className="text-green-700 font-semibold">SIGN UP</a>
            </Link>{' '}
            as an Employer and register your company/business and gain access to potential
            employees.
          </p>
          <p className="shadow rounded max-w-md p-8 text-center mt-4">
            <Link href="/signup?selected=seeker">
              <a className="text-green-700 font-semibold">SIGN UP</a>
            </Link>{' '}
            as a job seeker, build your profile, upload your CV and start applying for your dream
            job!
          </p>
        </div>
      </div>
      <div className="w-full py-8 px-4 flex flex-col items-center">
        <p className="text-2xl mb-2 font-semibold">Top Jobs</p>
        <hr className="w-full max-w-xs mb-8" />
        <div
          className="w-full grid grid-cols-4 tablet:grid-cols-3 smallTablet:grid-cols-2 phone:grid-cols-1"
          style={{ maxWidth: '1500px' }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((job, index) => (
            <Link href="#" key={index}>
              <a className="hover:text-black">
                <div className="col-span-1 shadow h-64 rounded p-4 m-2 flex flex-col justify-between hover:shadow-lg">
                  <span>
                    <Avatar shape="square" size={64} className="mb-2" />
                    <p className="font-semibold text-lg">Software Developemnt Intern at StriTech</p>
                    <Link href="/stritech">
                      <a>
                        <p className="text-sm">StriTech</p>
                      </a>
                    </Link>
                    <p className="text-sm">Lagos</p>
                  </span>
                  <p className="text-sm">1 month ago</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full py-8 px-4 flex flex-col items-center mb-16">
        <p className="text-2xl mb-2 font-semibold">Job Categories</p>
        <hr className="w-full max-w-xs mb-8" />
        {tags ? (
          <ul className="ul-list-spread" style={{ maxWidth: '1500px' }}>
            {tags.map((tag, index) => (
              <Link href={`/search?tag=${tag.name}`} key={index}>
                <a className="hover:text-green-700 hover:underline">
                  <li className="text-lg mb-2">{tag.name}</li>
                </a>
              </Link>
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
  let states = [];
  let tags = [];
  try {
    // let res = await makeApiCall("/states/get-states", { method: "get" });
    // states = res.data.states;
    let { data } = await makeApiCall({ url: '/tags/get-tags', method: 'get' });
    // let res = await axios.get("/tags/get-tags");
    tags = data.tags;
  } catch (error) {
    console.log(error);
  } finally {
    return {
      props: {
        // states,
        tags,
      },
    };
  }
}

export default Home;
