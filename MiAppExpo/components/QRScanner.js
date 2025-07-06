import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { Camera } from 'expo-camera';
import { useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../utils/themes";
import CameraView from "expo-camera";


export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions() ;
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);

  const isPermissionGranted= Boolean(permission?.granted)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert("QR Escaneado", `Contenido: ${data}`);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={requestPermission} style={{backgroundColor:colors.primary, borderRadius:15, paddingHorizontal:30}}><Text>Request Permissions</Text></Pressable>
      <Pressable disabled={!isPermissionGranted} >
        <Text style={{opacity: !isPermissionGranted ? 0.5: 1}}>Scan Code</Text>

      </Pressable>
      {scanned && (
        <Pressable onPress={() => setScanned(false)}>
          <Text>Escanear Otro QR</Text>
        </Pressable>
      )}

      <Camera style={StyleSheet.absoluteFillObject} facing="back" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});
