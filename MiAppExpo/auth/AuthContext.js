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
      console.log("Error en el inicio de sesión:", err);
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

        // Hacer fetch para obtener info del usuario
        const response = await api.get('/user/me');  // o la ruta correcta para info usuario
        setUser(response.data);
      }
    } catch (err) {
      console.log("Error cargando los tokens o usuario:", err);
      setUser(null);
      setToken(null);
      // Opcional: limpiar tokens si están corruptos
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);


  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
