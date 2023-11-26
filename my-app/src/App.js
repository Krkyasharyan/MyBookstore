import React from 'react';
import './App.css';
import Router from "./Router";
import { UserProvider } from './UserContext';
import { WebSocketProvider } from './WebSocketContext';

class App extends React.Component {


  render() {
    return (
      <WebSocketProvider>
        <UserProvider>
          <Router/>
        </UserProvider>
      </WebSocketProvider>
    );
  }
}


export default App;
