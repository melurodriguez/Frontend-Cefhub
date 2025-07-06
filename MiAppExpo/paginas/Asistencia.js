import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import api from "../api/axiosInstance";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const alertActive = useRef(false); // Flag para evitar múltiples alertas

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

      // Manejo de éxito
      if (response.status === 200 && response.data.ok) {
        Alert.alert("Asistencia registrada", response.data.mensaje || "¡Listo!", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
        await AsyncStorage.removeItem("idSede");
      }

    } catch (err) {
      console.error("Error al registrar asistencia:", err);

      if (err.response) {
        const { status, data } = err.response;

        if (status === 403) {
          Alert.alert("No autorizado", data.detail || "No estás inscripto en este curso.", [
            { text: "OK", onPress: () => setScanned(false) },
          ]);
        } else if (status === 500) {
          Alert.alert("Error del sistema", data.detail || "Hubo un problema interno al registrar la asistencia.", [
            { text: "OK", onPress: () => setScanned(false) },
          ]);
        } else {
          Alert.alert("Error", data.detail || "No se pudo registrar la asistencia.", [
            { text: "OK", onPress: () => setScanned(false) },
          ]);
        }

      } else {
        Alert.alert("Error de red", "No se pudo conectar con el servidor.", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
      }
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

    // 📍 Caso 1: Escanear una sede
    if (parsed.idSede) {
      try {
        await AsyncStorage.setItem(KEY_SEDE, String(parsed.idSede));
        console.log("Sede guardada localmente:", parsed.idSede);

        Alert.alert(
          "Sede guardada",
          `ID Sede: ${parsed.idSede}\nPodés salir o ir a otra sección.\nCuando escanees el curso, se registrará la asistencia.`,
          [
            {
              text: "OK",
              onPress: () => {
                alertActive.current = false;
                setScanned(false);
              },
            },
          ]
        );
      } catch (e) {
        Alert.alert("Error", "No se pudo guardar la sede localmente", [
          {
            text: "OK",
            onPress: () => {
              alertActive.current = false;
              setScanned(false);
            },
          },
        ]);
      }

    // 📍 Caso 2: Escanear un curso
    } else if (parsed.idCurso) {
      try {
        const storedSede = await AsyncStorage.getItem(KEY_SEDE);
        if (!storedSede) {
          Alert.alert("Error", "Primero debés escanear una sede.", [
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

        console.log("Curso escaneado:", parsed.idCurso);
        await registrarAsistencia(storedSede, parsed.idCurso);
      } catch (error) {
        console.error("Error general al procesar el curso:", error);
        Alert.alert("Error", "No se pudo registrar la asistencia.", [
          {
            text: "OK",
            onPress: () => {
              alertActive.current = false;
              setScanned(false);
            },
          },
        ]);
      }

    // 📍 Caso 3: QR inválido
    } else {
      Alert.alert("QR inválido", "El código QR no contiene ni idSede ni idCurso.", [
        {
          text: "OK",
          onPress: () => {
            alertActive.current = false;
            setScanned(false);
          },
        },
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

  return ( //LEE UN JSON CON ESTE FORMATO: {"idSede": 1} o {"idCurso": 2} EN EL QR
    <View style={styles.container}>
      {Platform.OS === 'android' && <StatusBar hidden />}
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      {scanned && (
        <TouchableOpacity onPress={() => {
          alertActive.current = false;
          setScanned(false);
        }} style={styles.button}>
          <Text style={styles.btnText}>Escanear de nuevo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  btnText: { fontSize: 16, fontWeight: 'bold' },
});
