import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from './config';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState('Guest');

  const refreshUsername = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/getUserInfo`, {credentials: 'include'});
    const data = await response.json();
    const fetchedUsername = data.username || 'Guest';
    setUsername(fetchedUsername);
  };

  return (
    <UserContext.Provider value={{ username, setUsername, refreshUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
