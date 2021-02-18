import { Tabs } from 'antd';
import Jobs_Companies from './Jobs_Companies';
import Security from './Security';
import Skills_Experience from './Skills_Experience';
import UserDetails from './UserDetails';

function User() {
  const { TabPane } = Tabs;
  return (
    <div className="w-full max-w-6xl mx-4 my-8 px-5">
      <p className="text-2xl font-medium">Your User Profile</p>
      <Tabs defaultActiveKey="1">
        <TabPane tab="User Details" key="1">
          <UserDetails />
        </TabPane>
        <TabPane tab="Skills and Experience" key="2">
          <Skills_Experience />
        </TabPane>
        <TabPane tab="Jobs and Companies" key="3">
          <Jobs_Companies />
        </TabPane>
        <TabPane tab="Security" key="4">
          <Security />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default User;
