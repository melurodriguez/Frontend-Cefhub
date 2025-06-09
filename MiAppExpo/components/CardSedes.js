import Checkbox from "expo-checkbox";
import { StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { RadioButton } from "react-native-paper";

export default function CardSedes({ sede }) {
  const [pressed, setPressed] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  function handlePress(id) {
    setPressed(!pressed);
    setSelectedId(id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.titulo} >{sede.nombre}</Text>
        <Text>Dirección: {sede.direccion}</Text>
        <Text>Teléfono: {sede.telefono}</Text>
        <Text>Promociom: {sede.promocion}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF2E5",
    borderRadius: 15,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    flexShrink: 1,
  },
  titulo: {
      fontFamily:'Sora_700Bold',
      fontSize: 20,
    }
});
