import React, { useState } from 'react';
import { Form, Input, Button, Layout, Typography, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {useUser} from "../UserContext";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useWebSocket } from '../WebSocketContext';
import API_BASE_URL from '../config';

const { Title } = Typography;

function LoginView() {
  const [loading, setLoading] = useState(false);
  const { refreshUsername } = useUser();
  const navigate = useNavigate();
  const { connectWebSocket } = useWebSocket();

  async function onFinish(values) {
    setLoading(true);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
      credentials: 'include',
    });

    setLoading(false); 

    if (response.ok) {
      const responseData = await response.json(); // I'm assuming your backend will send the userId as part of the response. Modify as needed.
      const userId = responseData.userId; // Retrieve this from the response

      connectWebSocket(userId);

      refreshUsername();
      navigate('/homeView');
    } else {
      message.error('Invalid username or password.');
    }
  }

  return (
    <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Col>
        <Title level={2}>Welcome to Our Bookstore</Title>
        <Form name="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '10px' }}>
              Log in
            </Button>
            <Button type="link" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Layout>
  );
}

export default LoginView;
