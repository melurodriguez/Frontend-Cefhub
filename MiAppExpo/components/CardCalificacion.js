import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CardCalificacion({ nickname, calificacion, comentario }) {
  const renderEstrellas = (cantidad) => {
    const max = 5;
    return "★".repeat(cantidad) + "☆".repeat(max - cantidad);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.nickname}>{nickname || "Anónimo"}</Text>
        {calificacion !== undefined && (
          <Text style={styles.estrellas}>{renderEstrellas(calificacion)}</Text>
        )}
      </View>
      <Text style={styles.comentario}>{comentario || "Sin comentarios."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nickname: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    color: "#333",
  },
  estrellas: {
    fontSize: 16,
    color: "#FFD700", // dorado para estrellas
    fontFamily: "Sora_700Bold",
  },
  comentario: {
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
