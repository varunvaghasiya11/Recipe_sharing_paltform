import React, { createContext, useContext, useState, useEffect } from 'react';
import * as userService from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error('Failed to parse stored user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await userService.login(email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await userService.register(username, email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    userService.logout();
    setUser(null);
  };

  const updateProfileDetails = async (formData) => {
    setLoading(true);
    try {
      const data = await userService.updateProfile(formData);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        updateProfileDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
