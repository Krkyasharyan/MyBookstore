import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { Book } from './Book';

export function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/books')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        setBooks(data);
        console.log("hello");
      });
  }, []);

  return (
    <List
      grid={{ gutter: 10, column: 4 }}
      dataSource={books}
      pagination={{
        onChange: function(page) {
          console.log(page);
        },
        pageSize: 16,
      }}
      renderItem={function(item) {
        return (
          <List.Item>
            <Book info={item} />
          </List.Item>
        );
      }}
    />
  );
}
