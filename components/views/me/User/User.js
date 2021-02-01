import { Tabs } from 'antd';
import { useState } from 'react';
import Security from './Security';
import UserDetails from './UserDetails';

function User() {
  const [edit2, setEdit2] = useState(false);

  const { TabPane } = Tabs;
  return (
    <div className="w-full max-w-4xl mx-4 my-8">
      <p className="text-2xl font-medium">Your User Profile</p>
      <Tabs defaultActiveKey="1">
        <TabPane tab="User Details" key="1">
          <UserDetails />
        </TabPane>
        <TabPane tab="Security" key="2">
          <Security />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default User;
