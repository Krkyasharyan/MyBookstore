import React from 'react';
import { List } from 'antd';
import { Book } from './Book';

export function BookList({ books }) {
    return (
        <List
            grid={{ gutter: 10, column: 4 }}
            dataSource={books}
            pagination={{
                onChange: page => {
                    console.log(page);
                },
                pageSize: 16,
            }}
            renderItem={item => (
                <List.Item>
                    <Book info={item} />
                </List.Item>
            )}
        />
    );
}
