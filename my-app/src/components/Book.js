import React from 'react';
import { Card } from 'antd';

import {Link} from 'react-router-dom'

const { Meta } = Card;

export class Book extends React.Component{


    render() {

        const {info} = this.props;

        return (
            <Link to={{
                pathname: '/bookDetails',
                search: '?id=' + info.id}}
                target="_self"
            >
            <Card
                hoverable
                style={{width: 181}}
                cover={<img alt="image" src={info.image_url} className={"bookImg"}/>}
            >
                <Meta title={info.title} description={'¥' + info.price}/>
            </Card>
            </Link>
        );
    }

}