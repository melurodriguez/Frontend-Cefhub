import React from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import thinkingCat from "../assets/thinkingCat.png";

export default function UploadingScreen() {
  return (
    <View style={styles.container}>
      <Image source={thinkingCat} style={styles.image} />
      <ActivityIndicator size="large" color="#E65100" style={styles.loader} />
      <Text style={styles.text}>Subiendo receta...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  loader: {
    marginTop: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
});
