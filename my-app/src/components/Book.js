import React from 'react';
import { Card } from 'antd';

import {Link} from 'react-router-dom'

const { Meta } = Card;

export class Book extends React.Component{


    render() {

        const {info} = this.props;

        const image_url = info.image_url;
        const imageUrl = info.imageUrl;

        const finalImageUrl = imageUrl ? imageUrl : image_url;


        return (
            <Link to={{
                pathname: '/bookDetails',
                search: '?id=' + info.mongoId}}
                target="_self"
            >
            <Card
                hoverable
                style={{width: 181}}
                cover={<img alt="image" src={finalImageUrl} className={"bookImg"}/>}
            >
                <Meta title={info.title} description={'¥' + info.price}/>
            </Card>
            </Link>
        );
    }

}