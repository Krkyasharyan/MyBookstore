import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, InputNumber, Button, message } from 'antd';
import API_BASE_URL from '../config';

function UpdateBookView() {
    const [form] = Form.useForm();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const [book, setBook] = useState(null);

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        console.log('Fetching book...');
        console.log(id);
        const response = await fetch(`${API_BASE_URL}/api/books/${id}`);
        const data = await response.json();
        setBook(data);
        form.setFieldsValue(data);
    }

    const onFinish = async (values) => {
        // Add fetched book's ID to the values object
        values.id = book.id;
        const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });

        if (response.ok) {
            message.success('Book updated successfully');
        } else {
            message.error('Error updating book');
        }
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item label="Title" name="title">
                <Input />
            </Form.Item>
            <Form.Item label="Type" name="type">
                <Input />
            </Form.Item>
            <Form.Item label="Author" name="author">
                <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Price" name="price">
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Image URL" name="image_url">
                <Input />
            </Form.Item>
            <Form.Item label="Quantity" name="quantity">
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
        </Form>
    );
}

export default UpdateBookView;
