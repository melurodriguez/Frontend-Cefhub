import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../utils/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // opcional
  const [loading, setLoading]=useState(true); //para manejar el splash (falta hacer)

  //loggeo usando el fromato de OAuth (URLSearchParams)
  const login = async (username, password, rememberMe) => {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    

    const response = await axios.post(`${API_BASE_URL}/login`, form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = response.data.access_token;
    setLoading(false);
    setToken(accessToken);

    //recordarme
    if (rememberMe) {
      await AsyncStorage.setItem('token', accessToken);
    } else {
      await AsyncStorage.removeItem('token'); 
    }
  };

  //función para cerrar sesión
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    setLoading(false);
  };

  //función para cargar token entrecierres y aperturas de app
  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  };

  const register_first_step = async(alias, email) => {
    const form= URLSearchParams();
    form.append('alias', alias);
    form.append('email', email);
    try{
      const res= await axios.post(`${API_BASE_URL}/register`,form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      return res.data

    }catch (err){
      throw err.response.data;
    }
    
  }


  const verification_code = async(email, user_code) => {
    const form=URLSearchParams();
    form.append('email', email);
    form.append('code', user_code);

    try{
      const res= await axios.post(`${API_BASE_URL}/verify-code`, form , {
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      })

      return res.data

    }catch(err){
      throw err.response.data
    }
    

  }

  const setPassword = async (email, password) => {
    const form=URLSearchParams();
    form.append('email', email);
    form.append('password', password);

    try{
      const res= await axios.post(`${API_BASE_URL}/create-password`, form , {
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      })

      return res.data

    }catch(err){
      throw err.response.data
    }
  }

  const setAvatar = async (email, avatar) => {
    const form=URLSearchParams();
    form.append('email', email);
    form.append('avatar', avatar);

    try{
      const res= await axios.post(`${API_BASE_URL}/choose-avatar`, form , {
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      })

      return res.data

    }catch(err){
      throw err.response.data
    }
  }

  const chooseRole = async (email, role) => {
    const form=URLSearchParams();
    form.append('email', email);
    form.append('role', role);

    try{
      const res= await axios.post(`${API_BASE_URL}/choose-role`, form , {
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      })

      return res.data

    }catch(err){
      throw err.response.data
    }
  }

  const studentPaymentMethod = async ({email, cardNumber, cardName, cardExpireDate, cardCVV}) =>{
    const form=URLSearchParams();
    form.append('email', email);
    form.append('cardNumber', cardNumber);
    form.append('cardName', cardName);
    form.append('cardExpireDate', cardExpireDate);
    form.append('cardCVV', cardCVV);

    try{
      const res= await axios.post(`${API_BASE_URL}/payment-method`, form , {
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      })

      return res.data

    }catch(err){
      throw err.response.data
    }
  }

  const studentData = async({frontId, backId, procedureNumber}) =>{
    const form=URLSearchParams();
    form.append('frontId', frontId);
    form.append('backId', backId);
    form.append('procedureNumber', procedureNumber);

    try{
      const res= await axios.post(`${API_BASE_URL}/student-data`, form , {
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      })

      return res.data

    }catch(err){
      throw err.response.data
    }
  }

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout , loading}}>
      {children}
    </AuthContext.Provider>
  );
};


