import { Tabs } from 'antd';
import CompanyDetails from './CompanyDetails';
import Job_Responses from './Jobs_Responses';

function User() {
  const { TabPane } = Tabs;
  return (
    <div className="w-full max-w-6xl mx-4 my-8 px-5">
      <p className="text-2xl font-medium">Your Company Profile</p>
      <Tabs defaultActiveKey="1" size="large">
        <TabPane tab="Company Details" key="1">
          <CompanyDetails />
        </TabPane>
        <TabPane tab="Jobs and Responses" key="2">
          <Job_Responses />
        </TabPane>
        {/* <TabPane tab="Jobs and Companies" key="3">
          <Jobs_Companies />
        </TabPane>
        <TabPane tab="Security" key="4">
          <Security />
        </TabPane> */}
      </Tabs>
    </div>
  );
}

export default User;
