import React, { useState } from 'react';
import { DatePicker, Table, Button } from 'antd';
import moment from 'moment';

function StatisticsView() {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'months'));
  const [endDate, setEndDate] = useState(moment());
  const [bookData, setBookData] = useState([]);
  const [userData, setUserData] = useState([]);

  const fetchBookData = async () => {
    const response = await fetch(`http://localhost:8080/api/statistics/books?start=${startDate.format('YYYY-MM-DD')}&end=${endDate.format('YYYY-MM-DD')}`);
    const data = await response.json();
    setBookData(data);
  };

  const fetchUserData = async () => {
    const response = await fetch(`http://localhost:8080/api/statistics/users?start=${startDate.format('YYYY-MM-DD')}&end=${endDate.format('YYYY-MM-DD')}`);
    const data = await response.json();
    setUserData(data);
  };

  const handleFetchData = () => {
    fetchBookData();
    fetchUserData();
  };

  const bookColumns = [
    { title: 'Book ID', dataIndex: 'bookId', key: 'bookId' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Sales', dataIndex: 'sales', key: 'sales' },
  ];

  const userColumns = [
    { title: 'User ID', dataIndex: 'userId', key: 'userId' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Expenditure', dataIndex: 'expenditure', key: 'expenditure' },
  ];

  return (
    <div>
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(dates) => {
          setStartDate(dates[0]);
          setEndDate(dates[1]);
        }}
      />
      <Button onClick={handleFetchData}>Fetch Data</Button>
      <Table dataSource={bookData} columns={bookColumns} title={() => 'Book Sales'} />
      <Table dataSource={userData} columns={userColumns} title={() => 'User Expenditure'} />
    </div>
  );
}

export default StatisticsView;
