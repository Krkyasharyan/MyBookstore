import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Space, Button, Image, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import CreateBookView from './CreateBookView';

function BookListView() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateBook, setShowCreateBook] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error('Error fetching books:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/books/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
      } else {
        message.error('Error deleting book');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Cover Photo',
      dataIndex: 'image_url',
      key: 'coverPhoto',
      render: (text) => <Image width={50} height={70} src={text} />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Link
            to={{
              pathname: '/updateBook',
              search: `?id=${record.id}`,
            }}
            target="_self"
          >
            <Button icon={<EditOutlined />} type="primary">
              Update
            </Button>
          </Link>
          <Button icon={<DeleteOutlined />} type="danger" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <Input placeholder="Search Books" onChange={handleSearch} style={{ width: 200, marginBottom: 15 }} prefix={<SearchOutlined />} />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setShowCreateBook(!showCreateBook)}
        style={{ marginBottom: 15 }}
      >
        Create Book
      </Button>
      {showCreateBook && <CreateBookView />}
      <Table dataSource={filteredBooks} columns={columns} />
    </div>
  );
}

export default BookListView;
