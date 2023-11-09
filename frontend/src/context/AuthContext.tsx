// @ts-nocheck
import React, { createContext, ReactNode, useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';

import authAxios from '../axios';
import { UserModel } from '../models/User';
import AuthHeader from "../services/AuthHeaders";
import AuthService from "../services/AuthService";

const DefaultProps = {
  login: () => null,
  logout: () => null,
  user: null,
  authAxios: axios,
}

export interface AuthProps {
  login: (username: string, password: string) => any;
  logout: () => void;
  authAxios: AxiosInstance;
  user: UserModel | null;
}

export const AuthContext = createContext<AuthProps>(DefaultProps);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => AuthService.getCurrentUser());

  async function login(username: string, password: string) {
    const data = await AuthService.login(username, password);
    setUser(data);
    return data;
  }

  function logout() {
    AuthService.logout();
    setUser(null);
    navigate('/login');
  }

  authAxios.interceptors.request.use((config) => {
    config.headers = AuthHeader();
    return config;
  });

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
}