import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, StatusBar, Pressable, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import api from "../api/axiosInstance";
import AsyncStorage from '@react-native-async-storage/async-storage';
import cancel from "../assets/cancel.png";

export default function QRScanner() {
  const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const alertActive = useRef(false);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const KEY_SEDE = 'idSede';

  const registrarAsistencia = async (sedeId, cursoId) => {
      const queryParams = [];
      if (sedeId) queryParams.push(`sede_id=${sedeId}`);
      if (cursoId) queryParams.push(`curso_id=${cursoId}`);
      const queryString = queryParams.join("&");

      try {
        const response = await api.post(`/user/me/asistencia?${queryString}`);
        if (response.status === 200 && response.data.ok) {
          Alert.alert("Asistencia registrada", response.data.mensaje || "¡Listo!", [
            { text: "OK", onPress: () => setScanned(false) },
          ]);
          await AsyncStorage.removeItem("idSede");
        }
      } catch (err) {
        console.error("Error al registrar asistencia:", err);
        const { status, data } = err.response || {};
        Alert.alert(
          status === 403 ? "No autorizado" :
          status === 500 ? "Error del sistema" : "Error",
          data?.detail || "No se pudo registrar la asistencia.",
          [{ text: "OK", onPress: () => setScanned(false) }]
        );
      } finally {
        alertActive.current = false;
      }
    };

    const handleBarcodeScanned = async ({ data }) => {
      if (scanned || alertActive.current) return;

      setScanned(true);
      alertActive.current = true;

      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        Alert.alert("Error", "El código QR no contiene datos válidos", [
          {
            text: "OK",
            onPress: () => {
              alertActive.current = false;
              setScanned(false);
            },
          },
        ]);
        return;
      }

      if (parsed.idSede) {
        try {
          await AsyncStorage.setItem(KEY_SEDE, String(parsed.idSede));
          Alert.alert(
            "Sede guardada",
            `ID Sede: ${parsed.idSede}`,
            [{
              text: "OK", onPress: () => {
                alertActive.current = false;
                setScanned(false);
              }
            }]
          );
        } catch {
          Alert.alert("Error", "No se pudo guardar la sede", [
            {
              text: "OK", onPress: () => {
                alertActive.current = false;
                setScanned(false);
              }
            }
          ]);
        }

      } else if (parsed.idCurso) {
        try {
          const storedSede = await AsyncStorage.getItem(KEY_SEDE);
          if (!storedSede) {
            Alert.alert("Error", "Primero debés escanear una sede.", [
              {
                text: "OK", onPress: () => {
                  alertActive.current = false;
                  setScanned(false);
                }
              }
            ]);
            return;
          }

          await registrarAsistencia(storedSede, parsed.idCurso);
        } catch (error) {
          console.error("Error al procesar curso:", error);
          Alert.alert("Error", "No se pudo registrar la asistencia.", [
            {
              text: "OK", onPress: () => {
                alertActive.current = false;
                setScanned(false);
              }
            }
          ]);
        }

      } else {
        Alert.alert("QR inválido", "El código no contiene idSede ni idCurso", [
          {
            text: "OK", onPress: () => {
              alertActive.current = false;
              setScanned(false);
            }
          }
        ]);
      }
    };

    if (!permission) return <View style={styles.center}><Text>Solicitando permisos...</Text></View>;

    if (!permission.granted) {
      return (
        <View style={styles.center}>
          <Text>Se requieren permisos de cámara</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.button}>
            <Text style={styles.btnText}>Conceder permiso</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'android' && <StatusBar hidden />}

        {/* Botón para volver */}
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={cancel} style={styles.backIcon} />
        </Pressable>

        {/* Cámara solo visible si se activa */}
        {cameraVisible ? (
          <>
            <CameraView
              style={styles.camera}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
          </>
        ) : (
          <View style={styles.center}>
            <Text style={styles.title}>Listo para escanear</Text>
            <TouchableOpacity onPress={() => setCameraVisible(true)} style={styles.button}>
              <Text style={styles.btnText}>Empezar escaneo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    button: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 20 },
    btnText: { fontSize: 16, fontWeight: 'bold' },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
    backIcon: { width: 70, height: 70 },
    title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  });