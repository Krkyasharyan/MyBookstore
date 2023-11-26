import React from 'react';
import {Layout} from 'antd'
import '../css/home.css'
import {BookCarousel} from "../components/BookCarousel";
import {BookList} from "../components/BookList";
import {SearchBar} from "../components/SearchBar";

const { Header, Content, Footer } = Layout;
class HomeView extends React.Component{

    render(){
        return(
            <Layout className="layout">
                    <Content style={{ padding: '0 50px' }}>
                        <SearchBar></SearchBar>
                        <div className="home-content">
                            <BookCarousel />
                            <BookList /> 
                                <div className={"foot-wrapper"}>
                            </div>
                        </div>
                    </Content>
            </Layout>
        );
    }
}

export default HomeView;