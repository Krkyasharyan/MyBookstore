import React, { useEffect, useState } from 'react';
import { Space, Input, DatePicker, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Panel } = Collapse;

function OrderListView() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch('http://localhost:8080/api/orders');
    const data = await response.json();
    setOrders(data);
  }

  const onSearch = (value) => setSearchTerm(value);

  const onDateRangeChange = (dates, dateStrings) => {
    setDateRange(dates);
  }

  const filterOrders = () => {
    let filteredOrders = orders;
  
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderItems.some(item => item.book.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      
      // Check if start and end are moment objects
      if (moment.isMoment(start) && moment.isMoment(end)) {
        const hardcodedDate = moment("6/22/2023", "MM/DD/YYYY");
        
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = moment(order.time);
          
          if (start.isSameOrAfter(hardcodedDate)) {
            return orderDate.isBetween(start, end, undefined, '[]');
          } else {
            return false;
          }
        });
      }
    }
  
    return filteredOrders;
  }
  

  const filteredOrders = filterOrders();

  return (
    <div>
      <Space direction="vertical">
        <Search placeholder="Search by title" onSearch={onSearch} enterButton />
        <RangePicker onChange={onDateRangeChange} />
        {filteredOrders.map(order => (
          <div key={order.id}>
            <p>User: {order.buyerUsername}</p>
            <p>Time: {new Date(order.time).toLocaleString()}</p>
            <Collapse bordered={false} defaultActiveKey={['1']} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
              <Panel header="Order Items" key="1">
                {order.orderItems.map(orderItem => (
                  <p key={orderItem.id}>
                    Title: {orderItem.book.title} |
                    Price: {orderItem.book.price} |
                    Quantity: {orderItem.quantity}
                  </p>
                ))}
              </Panel>
            </Collapse>
          </div>
        ))}
      </Space>
    </div>
  );
}

export default OrderListView;
