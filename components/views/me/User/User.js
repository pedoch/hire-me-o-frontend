import { Tabs } from 'antd';
import Security from './Security';
import Skills_Experience from './Skills_Experience';
import UserDetails from './UserDetails';

function User() {
  const { TabPane } = Tabs;
  return (
    <div className="w-full max-w-4xl mx-4 my-8">
      <p className="text-2xl font-medium">Your User Profile</p>
      <Tabs defaultActiveKey="1">
        <TabPane tab="User Details" key="1">
          <UserDetails />
        </TabPane>
        <TabPane tab="Skills and Experience" key="2">
          <Skills_Experience />
        </TabPane>
        <TabPane tab="Security" key="3">
          <Security />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default User;
