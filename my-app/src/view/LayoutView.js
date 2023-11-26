import React from 'react';
import {Layout} from 'antd'
import {HeaderInfo} from "../components/HeaderInfo";
import SideBarWrapper from "../components/SideBar";
import '../css/home.css'

const { Header} = Layout;



class LayoutView extends React.Component{

    constructor(props) {
        super(props);

    }

    render(){
        return(
            <Layout className="layout">
                <Header>
                    <HeaderInfo />
                </Header>
                <Layout>
                    <SideBarWrapper />
                </Layout>
            </Layout>
        );
    }
}

export default LayoutView;