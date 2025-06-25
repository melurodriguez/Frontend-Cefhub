import React from "react";
import { View, Text, StyleSheet, Button, BackHandler, Platform, Image } from "react-native";
import trainingCat from "../assets/trainingCat.png";

export default function NoConexion() {
  const cerrarApp = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    }
  };

  return (
    <View style={styles.container}>
      <Image source={trainingCat} style={{ width: 200, height: 200 }} />
      <Text style={styles.message}>
        Ups! Parece que no hay conexión{"\n"}
        Conéctate para poder seguir usando la app
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Cerrar aplicación" onPress={cerrarApp} color="#505c86" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  message: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Sora_700Bold",
  },
  buttonContainer: {
    width: "60%",
    borderRadius: 10,

    },
});
