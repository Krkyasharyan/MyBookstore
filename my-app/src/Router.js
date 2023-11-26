import React from 'react';
import {
  Routes,
  Route,
  BrowserRouter
} from 'react-router-dom';
import HomeView from './view/HomeView';
import Profile from './view/ProfileView';
import ErrorPage from './view/ErrorPage';
import OrderView from './view/OrderView';
import Cart from './view/CartView';
import LayoutView from './view/LayoutView';
import BookDetails from './view/BookDetails';
import LoginView from './view/LoginView';
import RegistrationView from './view/RegistrationView';
import BookListView from './view/BookListView';
import UpdateBookView from './view/UpdateBookView';
import OrderListView from './view/OrderListView';
import UserListView from './view/UserListView';
import StatisticsView from './view/StatisticsView';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutView />}>
          <Route path="login" element={<LoginView />} />
          <Route path="homeView" element={<HomeView />} />
          <Route path="shoppingCart" element={<Cart />} />
          <Route path="myOrders" element={<OrderView />} />
          <Route path="myProfile" element={<Profile />} />
          <Route path="bookDetails" element={<BookDetails />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="register" element={<RegistrationView />} />
          <Route path="bookList" element={<BookListView />} />
          <Route path="orderList" element={<OrderListView />} />
          <Route path="updateBook" element={<UpdateBookView />} />
          <Route path="userList" element={<UserListView />} />
          <Route path="statistics" element={<StatisticsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;