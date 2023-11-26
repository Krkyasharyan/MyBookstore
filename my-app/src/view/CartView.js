import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout, Table, Button, message } from 'antd';
import { useWebSocket } from '../WebSocketContext';


const { Header, Content, Footer } = Layout;

function ShoppingCart() {

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
    {
      title: '',
      dataIndex: 'id',
      key: 'remove',
      render: (id, record) => (
        <Button type="danger" onClick={() => handleRemove(id, record)}>
          Remove
        </Button>
      ),
    },
  ];

  const navigate = useNavigate();
  
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { ws } = useWebSocket();

  const fetchTotalPrice = async (booksData) => {
    const priceRequest = booksData.map(book => ({
      price: book.price,
      quantity: book.quantity,
    }));
  
    try {
      const response = await fetch('http://localhost:8080/api/services/getPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(priceRequest),
      });
  
      const data = await response.json();
      setTotalPrice(data);
    } catch (error) {
      console.error('Error fetching total price:', error);
    }
  };

  



  useEffect(() => {
    fetch('http://localhost:8080/api/auth/getUserInfo', {credentials: 'include'})
      .then(response => response.json())
      .then(data => setUserId(data.userId))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        //console.log("Order received:", event.data);
        console.log("Received WebSocket message:", event.data);
        // show alert window, then on click OK navigate to OrderView
        alert("Order Completed: " + event.data);
        navigate('/OrderView');
      };
    }
  }, [ws]);

  useEffect(() => {
    if (!userId) return;
  
    fetch(`http://localhost:8080/api/cart/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        const booksData = data.cartItems.map(cartItem => ({
          id: cartItem.book.id,
          title: cartItem.book.title,
          price: cartItem.book.price,
          quantity: cartItem.quantity,
        }));
  
        setBooks(booksData);
        fetchTotalPrice(booksData);  // Pass the booksData directly
      })
      .catch(error => console.log(error));
  }, [userId]);



  
  

  const handlePayment = async () => {
    // handle payment here and then navigate to myOrders
    await fetch(`http://localhost:8080/api/orders/user/${userId}`, {
      method: 'POST',
    });

    //navigate('/myOrders');
  };

  const handleRemove = async (id, record) => {
    const bookId = id;
    try {
      await fetch(`http://localhost:8080/api/cart/${bookId}/${userId}`, {
        method: 'DELETE',
      });
      const updatedBooks = books.filter(book => book.id !== id);
  
      // Using the function service to get the new total price after removing a book.
      const bookPrices = updatedBooks.map(book => ({
        bookPrice: book.price,
        quantity: book.quantity,
      }));
      
      setBooks(updatedBooks);
      // setTotalPrice(newTotalPrice);
      fetchTotalPrice(updatedBooks);
  
      message.success('Book removed from cart successfully');
    } catch (error) {
      console.log(error);
      message.error('Error removing book from cart');
    }
  };
  
  
  
  return (
    <Layout>
      <Content>
        <h1>Shopping Cart</h1>
        <Table columns={columns} dataSource={books} pagination={false} />
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <div style={{ marginBottom: 10 }}>Total Price: {totalPrice}¥</div>
          <Button type="primary" onClick={handlePayment}>
            Pay
          </Button>
        </div>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default ShoppingCart;
