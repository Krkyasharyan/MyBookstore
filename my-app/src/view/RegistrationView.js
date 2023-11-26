import React, { useState } from 'react';
import { Form, Input, Button, Layout, Typography, Col, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function RegistrationView() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function checkUsername(username) {
    const response = await fetch(`http://localhost:8080/api/users/checkUsername`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (response.ok) {
      const data = await response.json();
      return data ? 'Username already exists!' : undefined;
    }
    return 'Error checking username!';
  }

  async function checkEmail(email) {
    const response = await fetch(`http://localhost:8080/api/users/checkEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      const data = await response.json();
      return data ? 'Email already exists!' : undefined;
    }
    return 'Error checking email!';
  }

  async function onFinish(values) {
    setLoading(true);

    const usernameError = await checkUsername(values.username);
    if (usernameError) {
      message.error(usernameError);
      setLoading(false);
      return;
    }
    const emailError = await checkEmail(values.email);
    if (emailError) {
      message.error(emailError);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: values.username,
        password: values.password,
        email: values.email,
        address: values.address,
        phoneNumber: values.phoneNumber,
        isAdmin: false,
        isDisabled: false,
      }

      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login')
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  }

  return (
    <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Col>
        <Title level={2}>Register</Title>
        <Form name="register-form" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item name="confirmPassword" dependencies={['password']} rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
            <Input prefix={<HomeOutlined />} placeholder="Address" />
          </Form.Item>

          <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Please input your phone number!' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Layout>
  );
}

export default RegistrationView;
