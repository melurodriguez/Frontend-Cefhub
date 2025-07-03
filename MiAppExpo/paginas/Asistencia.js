import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable, ScrollView, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SecureStore from 'expo-secure-store';
import { colors, fonts } from "../utils/themes";

export default function Asistencia() {
  const [tienePermiso, setTienePermiso] = useState(null);
  const [mostrarScanner, setMostrarScanner] = useState(false);
  const [escaneado, setEscaneado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setTienePermiso(status === 'granted');
    })();
  }, []);

  const manejarEscaneo = async ({ data }) => {
    setEscaneado(true);
    setMostrarScanner(false);
    await guardarAsistenciaDesdeQR(data);
  };

  const verHistorial = async () => {
    const json = await SecureStore.getItemAsync("asistencias");
    const asistencias = json ? JSON.parse(json) : [];
    setHistorial(asistencias.reverse());
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Asistencia</Text>

      {tienePermiso === null && <Text>Solicitando permiso de cámara...</Text>}
      {tienePermiso === false && <Text>No se tiene acceso a la cámara.</Text>}

      {tienePermiso && (
        <>
          {!mostrarScanner && (
            <>
              <Pressable style={styles.boton} onPress={() => {
                setEscaneado(false);
                setMostrarScanner(true);
              }}>
                <Text style={styles.textoBoton}> Escanear código QR</Text>
              </Pressable>

              <Pressable style={[styles.boton, { backgroundColor: colors.secondary }]} onPress={verHistorial}>
                <Text style={styles.textoBoton}> Ver historial</Text>
              </Pressable>
            </>
          )}

          {mostrarScanner && (
            <View style={styles.scannerContainer}>
              <BarCodeScanner
                onBarCodeScanned={escaneado ? undefined : manejarEscaneo}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
          )}
        </>
      )}

      {/* Modal de historial */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.titulo}>Historial de Asistencia</Text>
          {historial.length === 0 ? (
            <Text style={styles.sinAsistencias}>Aún no registraste asistencias.</Text>
          ) : (
            historial.map((asistencia, index) => (
              <View key={index} style={styles.historialItem}>
                <Text style={styles.textoHistorial}> Curso: {asistencia.idCurso}</Text>
                <Text style={styles.textoHistorial}> Fecha: {new Date(asistencia.fechaEscaneo).toLocaleString()}</Text>
              </View>
            ))
          )}
          <Pressable style={styles.botonCerrar} onPress={() => setModalVisible(false)}>
            <Text style={styles.textoBoton}>Cerrar</Text>
          </Pressable>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

// Funciones auxiliares
function parsearQRInsert(sql) {
  const regex = /VALUES\s*\(\s*(\d+),\s*(\d+),\s*'([\d-]+)',\s*'([\d-]+)',\s*(\d+)\s*\)/i;
  const match = sql.match(regex);
  if (!match) return null;
  return {
    idSede: parseInt(match[1]),
    idCurso: parseInt(match[2]),
    fechaInicio: match[3],
    fechaFin: match[4],
    vacantesDisponibles: parseInt(match[5]),
  };
}

async function guardarAsistenciaDesdeQR(qrData) {
  const curso = parsearQRInsert(qrData);
  if (!curso) {
    Alert.alert(" Error", "El código QR no tiene el formato correcto.");
    return;
  }

  const idUsuario = await SecureStore.getItemAsync("idUsuario");
  if (!idUsuario) {
    Alert.alert(" Error", "No se encontró el usuario en la app.");
    return;
  }

  const nuevaAsistencia = {
    idUsuario: parseInt(idUsuario),
    fechaEscaneo: new Date().toISOString(),
    ...curso,
  };

  const asistenciasPreviasJson = await SecureStore.getItemAsync("asistencias");
  const asistenciasPrevias = asistenciasPreviasJson ? JSON.parse(asistenciasPreviasJson) : [];

  asistenciasPrevias.push(nuevaAsistencia);
  await SecureStore.setItemAsync("asistencias", JSON.stringify(asistenciasPrevias));

  Alert.alert(
    "Asistencia registrada",
    `Usuario: ${idUsuario}\nCurso: ${curso.idCurso}\nFecha: ${nuevaAsistencia.fechaEscaneo}`
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  titulo: {
    fontFamily: "Sora_700Bold",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: colors.primary,
  },
  boton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  textoBoton: {
    color: "white",
    fontSize: 16,
    fontFamily: "Sora_600SemiBold",
  },
  scannerContainer: {
    height: 400,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  historialItem: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  textoHistorial: {
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    color: "#333",
  },
  botonCerrar: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  sinAsistencias: {
    fontFamily: "Sora_400Regular",
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  }
});
