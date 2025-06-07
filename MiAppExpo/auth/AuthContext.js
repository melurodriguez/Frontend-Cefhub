import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import axios from "axios";
import API_BASE_URL from "../utils/config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = async (accessToken, refreshToken, rememberMe) => {
        await AsyncStorage.setItem("access_token", accessToken);
        await AsyncStorage.setItem("refresh_token", refreshToken);
        console.log("guardados tokens")
  };

  const login = async (email, password, rememberMe) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }); 

      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const userData = response.data.user;

      setToken(accessToken);
      setUser(userData);
      await saveTokens(accessToken, refreshToken, rememberMe);

      console.log("Login exitoso:", userData);
      return true;
    } catch (err) {
      console.error("Error en el inicio de sesión:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    setLoading(false);
  };

  const loadToken = async () => {
    try {
      const storedAccessToken =
        Platform.OS === "web"
          ? localStorage.getItem("access_token")
          : await AsyncStorage.getItem("access_token");

      if (storedAccessToken) {
        setToken(storedAccessToken);
      }
    } catch (err) {
      console.error("Error cargando los tokens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

    /*
  const register_first_step = async (alias, email) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {alias, email});

      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const verification_code = async (email, user_code) => {

    try {
      const res = await axios.post(`${API_BASE_URL}/verify-code`, {email, user_code});

      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const setPassword = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/create-password`,{email, password});

      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const setAvatar = async (email, avatar) => {

    try {
      const res = await axios.post(`${API_BASE_URL}/choose-avatar`, {email, avatar});

      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const chooseRole = async (email, role) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/choose-role`, {email, role});

      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const studentPaymentMethod = async ({
    email,
    cardNumber,
    cardName,
    cardExpireDate,
    cardCVV,
  }) => {

    try {
      const res = await axios.post(`${API_BASE_URL}/payment-method`, {email, cardNumber, cardName, cardExpireDate, cardCCV});

      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const studentData = async ({ frontId, backId, procedureNumber }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/student-data`, {frontId, backId, procedureNumber});

      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  useEffect(() => {
    loadToken();
  }, []);
 */
  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
