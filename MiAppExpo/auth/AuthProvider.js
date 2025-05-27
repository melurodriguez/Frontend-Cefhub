import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import AuthContext from './AuthContext';
import axios from 'axios'
import API_BASE_URL from '../utils/config';
import Splash from '../paginas/Splash';

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  //const [loading, setLoading] = useState(true);


  useEffect(() => {
    const cargarToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) setUserToken(token);
      //setLoading(false);
    };
    cargarToken();
  }, []);

  const login = async (username, password, rememberMe) => {
    try{
        const res = await axios.post(`${API_BASE_URL}/login`, { username, password });
        const token = res.data.token;

        await AsyncStorage.setItem('authToken', token);
        setUserToken(token);

        if (rememberMe) {
            await SecureStore.setItemAsync('username', username);
            await SecureStore.setItemAsync('password', password);
        } else {
            await SecureStore.deleteItemAsync('username');
            await SecureStore.deleteItemAsync('password');
        }

    }catch(err){
        console.error("Error de login:", err.response?.data || err.message);
        throw err;
    }
    
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout,  }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

//{loading ? (<Splash/>) : (children)}