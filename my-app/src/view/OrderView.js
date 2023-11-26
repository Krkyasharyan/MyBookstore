import React, { useState, useEffect } from 'react';
import { Layout, Table, Tabs, Input, DatePicker, Button } from 'antd';
import moment from 'moment';
import '../css/home.css';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
];

const userId = fetch ('http://localhost:8080/api/auth/getUserInfo', {credentials: 'include'}).then(response => response.json()).then(data => data.userId);

function OrderView() {
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [dateRange, setDateRange] = useState([]);


  // Fetch userId
  useEffect(() => {
    fetch('http://localhost:8080/api/auth/getUserInfo', {credentials: 'include'})
      .then(response => response.json())
      .then(data => setUserId(data.userId))
      .catch(error => console.log(error));
  }, []);

  // Fetch orders
  useEffect(() => {

    if(!userId) return;

    fetch(`http://localhost:8080/api/orders/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        const orderTabs = data.map(order => {
          const booksData = order.orderItems.map(orderItem => ({
            id: orderItem.book.id,
            title: orderItem.book.title,
            price: orderItem.book.price,
            quantity: orderItem.quantity,
          }));

          const totalPrice = booksData.reduce((acc, book) => {
            return acc + book.price * book.quantity;
          }, 0);

          return {
            orderId: order.id,
            books: booksData,
            totalPrice: totalPrice,
            time: order.time,
          };
        });
        setOrders(orderTabs);
        setFilteredOrders(orderTabs);
      })
      .catch(error => console.log(error));
  }, [userId]);

  const handleSearch = () => {
    const filtered = orders.filter(order => {
      const books = order.books.filter(book => {
        return book.title.toLowerCase().includes(searchValue.toLowerCase());
      });
      return books.length > 0 && isOrderInDateRange(order);
    });
    setFilteredOrders(filtered);
  };

  const isOrderInDateRange = order => {
    if (dateRange.length === 0) {
      return true;
    }
    const [startDate, endDate] = dateRange;
    const orderDate = moment(order.time);
    return orderDate.isBetween(startDate, endDate, 'day', '[]');
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleReset = () => {
    setSearchValue('');
    setDateRange([]);
    setFilteredOrders(orders);
  };

  return (
    <Content style={{ marginLeft: '10px', marginTop: '10px' }}>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by title"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ marginRight: 16 }}
        />
        <RangePicker value={dateRange} onChange={handleDateRangeChange} />
        <Button type="primary" onClick={handleReset} style={{ marginLeft: 16 }}>
          Reset
        </Button>
      </div>
      <Tabs defaultActiveKey="1">
        {filteredOrders.map((order, index) => (
          <TabPane tab={`Order ${index + 1}`} key={index + 1}>
            <Table columns={columns} dataSource={order.books} pagination={false} />
            <div style={{ textAlign: 'right', marginTop: 20 }}>
              <span style={{ marginRight: 20 }}>Total: {order.totalPrice}</span>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </Content>
  );
}

export default OrderView;
