import React, { useEffect } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import userPng from '../assets/profilePicture.jpg';
import { useUser } from '../UserContext';  // Import the custom hook
import { message } from 'antd';  // Import the message component
import { useWebSocket } from '../WebSocketContext';

export function UserAvatar({ user }) {
  const navigate = useNavigate();
  const { username, refreshUsername } = useUser();
  const { disconnectWebSocket } = useWebSocket();

  useEffect(() => {
    refreshUsername();  // Refresh the username from the server
  }, [])

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => navigate(`/myProfile`)}>
          Show Profile
        </a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={logOut}>
          Log Out
        </a>
      </Menu.Item>
    </Menu>
  );

  function logOut() {
  
    fetch ('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include',  // Don't forget to include credentials
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.elapsedTime);
      message.success(`Logged out successfully. Time elapsed: ${data.elapsedTime} s`);  // Display the elapsed time in a pop-up
      disconnectWebSocket();  // Close the WebSocket connection
      refreshUsername();
      navigate('/login');
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }
  

  return (
    <div id="avatar">
      <span className="name">Hi, {username}</span>
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar src={userPng} style={{cursor:"pointer"}} />
      </Dropdown>
    </div>
  );
}
