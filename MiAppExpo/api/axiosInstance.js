// src/api/axiosInstance.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../utils/config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar token a cada petición
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar refresh token cuando access token expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no es la petición de login o refresh para evitar loop infinito
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Guardar los nuevos tokens
        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("refresh_token", newRefreshToken);

        // Actualizar header y repetir la petición original
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (err) {
        // Aquí podés limpiar los tokens y redirigir al login
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        // Opcional: mandar a la pantalla de login
        // Ejemplo con React Navigation: navigation.navigate("Login");

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
