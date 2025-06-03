import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../utils/config';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // opcional
  const [loading, setLoading]=useState(true); //para manejar el splash (falta hacer)


  const saveToken = async (token, rememberMe) => {
    if (Platform.OS === 'web') {
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    } else {
      if (rememberMe) {
        await AsyncStorage.setItem('token', token);
      } else {
        await AsyncStorage.removeItem('token');
      }
    }
  };

  const login = async (email, password, rememberMe) => {
    const dataToSend = {
      email: email, 
      password: password,
    };
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, dataToSend);
      const accessToken = response.data.access_token;
      const userData = response.data.user;

      setToken(accessToken);
      setUser(userData);
      await saveToken(accessToken, rememberMe);

      console.log('Login exitoso:', userData);
    } catch (err) {
      console.error("Error en el inicio de sesión:", err);
      throw err;
    } finally {
      setLoading(false);
      return true;
    }


    //falta implement recordarme
   
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


