import React, { createContext, useState, useEffect, useContext } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);

  const disconnectWebSocket = () => {
    if (ws) {
      ws.close();
      setWs(null); // Reset the state
      console.log('WebSocket connection closed');
    }
  };

  const connectWebSocket = (userId) => {
    if (ws) {
      ws.close();
    }
  
    const newWs = new WebSocket(`ws://localhost/transfer/${userId}`);
  
    newWs.onopen = () => {
      console.log('WebSocket connection opened');
    };
  
    newWs.onerror = (error) => {
      console.error(`WebSocket Error: ${error}`);
    };
  
    newWs.onclose = (event) => {
      if (event.wasClean) {
        console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.log('WebSocket Connection died');
      }
    };
  
    setWs(newWs);
  };

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        console.log(`Received message: ${event.data}`);
        // You can add logic to update global state or call a function here
      };
    }
  }, [ws]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.onclose = () => {
            ws.close();
            console.log('WebSocket connection closed');
        };
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws, connectWebSocket, disconnectWebSocket}}>
      {children}
    </WebSocketContext.Provider>
  );
};
