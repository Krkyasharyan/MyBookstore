import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Table, Space, Button, Image, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import CreateBookView from './CreateBookView';
import API_BASE_URL from '../config';

function BookListView() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateBook, setShowCreateBook] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState('');


  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/books`);
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
      const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
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

  const handleUpdate = async (mongoId) => {
    navigate(`/updateBook?id=${mongoId}`);
  };

  const handleSearch = async (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    if (event.target.value) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/books/searchByTag?tag=${event.target.value}`);
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          console.error('Error fetching books:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      fetchBooks(); // Fetch all books if the search term is cleared
    }
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
            <Button icon={<EditOutlined />} type="primary" onClick={() => handleUpdate(record.mongoId)}>
              Update
            </Button>
          </Link>
          <Button icon={<DeleteOutlined />} type="danger" onClick={() => handleDelete(record.mongoId)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <Input
        placeholder="Search Books"
        onChange={handleSearch}
        style={{ width: 200, marginBottom: 15 }}
        prefix={<SearchOutlined />}
      />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setShowCreateBook(!showCreateBook)}
        style={{ marginBottom: 15 }}
      >
        Create Book
      </Button>
      {showCreateBook && <CreateBookView />}
      <Table dataSource={books} columns={columns} />

    </div>
  );
}

export default BookListView;
