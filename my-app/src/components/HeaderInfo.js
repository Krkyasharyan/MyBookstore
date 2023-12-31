import React from 'react';
import { Row, Col } from 'antd';
import '../css/index.css'
import logo from '../assets/logo.png';
import {UserAvatar} from "./UserAvatar";

export class HeaderInfo extends React.Component {

    render(){

        const user = {"username": "user"};
        return(
            <div id="header">
                <div id="header-content">
                    <Row>
                        <Col xs={24} sm={24} md={5} lg={5} xl={5} xxl={4}>
                            <a id="logo" href={"/"}>
                                <img alt="logo"  className="logo" src={logo} style={{ height:45 }}/>
                            </a>
                        </Col>
                        <Col xs={0} sm={0} md={19} lg={19} xl={19} xxl={20}>
                            {<UserAvatar user={user}/>}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}