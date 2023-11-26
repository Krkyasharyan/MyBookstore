import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';

function UserListView() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:8080/api/users');
    const data = await response.json();
    setUsers(data);
  }

  const disableUser = async (userId) => {
    const requestOptions = { method: 'PUT' };
    await fetch(`http://localhost:8080/api/users/disableUser/${userId}`, requestOptions);
    fetchUsers(); // Refetch users after disabling a user
  }

  const enableUser = async (userId) => {
    const requestOptions = { method: 'PUT' };
    await fetch(`http://localhost:8080/api/users/enableUser/${userId}`, requestOptions);
    fetchUsers(); // Refetch users after enabling a user
  }

  const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Is Admin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: isAdmin => isAdmin ? 'Yes' : 'No',
    },
    {
      title: 'Is Disabled',
      dataIndex: 'isDisabled',
      key: 'isDisabled',
      render: isDisabled => isDisabled ? 'Yes' : 'No',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {!record.isAdmin && (
            <>
              <Button disabled={record.isDisabled} onClick={() => disableUser(record.id)}>Disable</Button>
              <Button disabled={!record.isDisabled} onClick={() => enableUser(record.id)}>Enable</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={users} />
  );
}

export default UserListView;
