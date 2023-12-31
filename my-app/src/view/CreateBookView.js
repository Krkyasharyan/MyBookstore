import React from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import API_BASE_URL from '../config';

function CreateBookView() {
  const onFinish = async (values) => {
    try {
      console.log(values);
      const response = await fetch(`${API_BASE_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Book created successfully');
      } else {
        message.error('Error creating book');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please input the type!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Author" name="author" rules={[{ required: true, message: 'Please input the author!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item label="Image URL" name="image_url" rules={[{ required: true, message: 'Please input the image URL!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please input the quantity!' }]}>
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Book
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CreateBookView;
