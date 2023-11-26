import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import { BookOutlined, UserOutlined, UnorderedListOutlined, ShoppingCartOutlined, ContainerOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import { Outlet, Link, useLocation } from "react-router-dom";
import '../css/index.css';

const { Sider } = Layout;

async function getIsAdmin() {
  try {
    const response = await fetch('http://localhost:8080/api/auth/getUserInfo', { credentials: 'include' });
    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    // Handle errors or set a default value if the request fails
    console.error(error);
    return false; // Assuming a default value of false for isAdmin
  }
}

class SideBar extends Component {
  state = {
    collapsed: false,
    isAdmin: false, // Initialize isAdmin in the component state
  };

  async componentDidMount() {
    // Set isAdmin in the component state once the data is available
    const isAdmin = await getIsAdmin();
    this.setState({ isAdmin });
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { selectedMenu } = this.props;
    const { isAdmin } = this.state; // Use isAdmin from component state

    const userMenu = (
        <>
            <Menu.Item key="1">
                <BookOutlined className='book' style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px' }}>
                    <Link style={{ color: 'gray' }} to="homeView">Books</Link>
                </span>
            </Menu.Item>
            <Menu.Item key="2">
                <ShoppingCartOutlined className="shopping-cart" style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px',  color: 'red'}}>
                    <Link style={{ color: 'gray' }} to="shoppingCart">My Cart</Link>
                </span>
            </Menu.Item>
            <Menu.Item key="3">
                <UnorderedListOutlined className="unordered-list" style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px' }}>
                    <Link style={{ color: 'gray' }}  to="myOrders">My Orders</Link>
                </span>
            </Menu.Item>
            <Menu.Item key="4">
                <UserOutlined className="user" style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px' }}>
                    <Link style={{ color: 'gray' }}  to="myProfile">My Profile</Link>
                </span>
            </Menu.Item>
        </>
    );

    const adminMenu = (
        <>
            <Menu.Item key="1">
                <BookOutlined className='book' style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px' }}>
                    <Link style={{ color: 'gray' }} to="homeView">Books</Link>
                </span>
            </Menu.Item>
            <Menu.Item key="2">
                <ContainerOutlined className="book-list" style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px',  color: 'red'}}>
                    <Link style={{ color: 'gray' }} to="bookList">Book List</Link>
                </span>
            </Menu.Item>
            <Menu.Item key="3">
                <UnorderedListOutlined className="order-list" style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px' }}>
                    <Link style={{ color: 'gray' }}  to="orderList">Order List</Link>
                </span>
            </Menu.Item>
            <Menu.Item key="4">
                <TeamOutlined className="user-list" style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px' }}>
                    <Link style={{ color: 'gray' }}  to="userList">User List</Link>
                </span>
            </Menu.Item>
            <Menu.Item key="5">
                <BarChartOutlined className="statistics" style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '16px' }}>
                    <Link style={{ color: 'gray' }} to="statistics">Statistics</Link>
                </span>
            </Menu.Item>
        </>
    );

    return (
      <>
        <div style={{ width: this.state.collapsed ? "80px" : "180px", maxWidth: this.state.collapsed ? "80px" : "180px", minWidth: this.state.collapsed ? "80px" : "180px" }}>
          <div className="mySider">
            <Sider collapsible collapsed={this.state.collapsed} width="180px" onCollapse={this.onCollapse} className="sider" style={{ background: '#fff' }}>
              <Menu selectedKeys={[selectedMenu]} mode="inline">
                {isAdmin ? adminMenu : userMenu}
              </Menu>
            </Sider>
          </div>
        </div>
        <Outlet />
      </>
    );
  }
}

const SideBarWrapper = () => {
  const location = useLocation();
  console.log(location.pathname);
  let selectedMenu = '1'; // default selected menu item

  if (location.pathname === '/homeView') {
    selectedMenu = '1';
  } else if (location.pathname === '/bookList' || location.pathname === '/shoppingCart') {
    selectedMenu = '2';
  } else if (location.pathname === '/orderList' || location.pathname === '/myOrders') {
    selectedMenu = '3';
  } else if (location.pathname === '/userList' || location.pathname === '/myProfile') {
    selectedMenu = '4';
  } else if (location.pathname === '/statistics') {
    selectedMenu = '5';
  }

  return <SideBar selectedMenu={selectedMenu} />;
};

export default SideBarWrapper;
