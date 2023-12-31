import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Layout, message } from 'antd';
import { Row, Col } from 'antd';
import '../css/BookDetails.css';
import API_BASE_URL from '../config';

//const { Header, Content, Footer } = Layout;

const { Meta } = Card;

function BookDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const [desired_quantity, setQuantity] = useState(1);

    const handleQuantityChange = async (event) => {
      await setQuantity(event.target.value);
    };

    const handleAddToCart = async () => {
      const userId = await fetch (`${API_BASE_URL}/api/auth/getUserInfo`, {credentials: 'include'}).then(response => response.json()).then(data => data.userId);
      const bookId = new URLSearchParams(location.search).get("id");
      console.log(bookId);
      if(userId == null){
        message.error('Please login first.');
        return;
      }
    
      let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };
    
      await fetch(`${API_BASE_URL}/api/cart?userId=${userId}&bookId=${bookId}&quantity=${desired_quantity}`, requestOptions);
      requestOptions = {method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({quantity: quantity - desired_quantity})};
      await fetch(`${API_BASE_URL}/api/books/${bookId}`, requestOptions);
      navigate('/shoppingCart');
    };
    

    const [book, setBook] = useState(null);
    
    useEffect(() => {
      console.log("Fetching book...");
      const fetchBook = async () => {

        const bookId = new URLSearchParams(location.search).get("id");
        const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`);
        const data = await response.json();
        setBook(data);

      };
      fetchBook();
    }, []);
    if (book === null) return (<div>Loading...</div>);

    const {title, type, price, author, description, image_url, quantity} = book; // parse JSON string to JavaScript object
    return (
      <Layout style={{ marginLeft: "10px", marginTop: "10px"}}>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={12}>
            <Card cover={<img alt={title} src={image_url} />}>
              <Card.Meta title={title} description={author} />
            <Row gutter={[8, 8]}>
              <Col span={12}>Price: {price}</Col>
              <Col span={12}>Status: In Stock</Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Card.Meta title="Introduction" description={description} />
          </Card>
          <Col span={24}>
                <label htmlFor="quantity">Quantity: </label>
                <input style={{ marginLeft: "10px" }}
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={quantity}
                  value={desired_quantity}
                  onChange={handleQuantityChange}
                />
                <Button type="primary" style={{ marginTop: "10px", marginLeft: "25px" }} onClick={handleAddToCart}>Add to Cart</Button>
            </Col>
        </Col>
      </Row>
    </Layout>
    );
}

export default BookDetails;
