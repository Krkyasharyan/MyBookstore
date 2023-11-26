import React, { useState, useEffect } from 'react';
import { useNavigate} from "react-router-dom";
import { Form, Input, Button, Layout, Typography, Descriptions } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

function ProfileView() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user data when component is loaded
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8080/api/auth/getUserInfo`, {credentials: 'include',});
      const data = await response.json();
      const userId = data.userId;
      if (!userId) {
        navigate('/login');
        return;
      }
  
      fetchUser(userId);
    };
  
    fetchData();
  }, []);
  

  async function fetchUser(userId) {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/users/id/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setUser(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  }

  async function onSubmit(values) {
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
          <Title level={2}>Your Profile</Title>
          <Descriptions title="User Info" layout="vertical" bordered>
            <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
            <Descriptions.Item label="Phone Number">{user.phoneNumber}</Descriptions.Item>
          </Descriptions>
          <Title level={4} style={{ marginTop: '24px' }}>Edit Profile</Title>
          <Form 
            name="profile-form" 
            initialValues={{ 
              username: user.username, 
              password: user.password, 
              email: user.email, 
              address: user.address, 
              phoneNumber: user.phoneNumber 
            }} 
            onFinish={onSubmit}
          >
            <Form.Item name="username">
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item name="password">
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item name="email">
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item name="address">
              <Input prefix={<UserOutlined />} placeholder="Address" />
            </Form.Item>

            <Form.Item name="phoneNumber">
              <Input prefix={<UserOutlined />} placeholder="Phone Number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Edit Profile
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default ProfileView;
