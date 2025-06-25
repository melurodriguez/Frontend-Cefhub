import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../auth/AuthContext";
import { useContext  } from "react";

export default function CardCalificacion({ data }) {
  const { user } = useContext(AuthContext);
  const renderEstrellas = (cantidad) => {
    const max = 5;
    return "★".repeat(cantidad) + "☆".repeat(max - cantidad);
  };
  const esAutor = data.nickname === user?.nickname;
  const estaAprobado = data.estado === "aprobado";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.nickname}>{data.nickname}</Text>
        {data.calificacion !== undefined  && (
          <Text style={styles.estrellas}>
            {data.calificacion} {renderEstrellas(data.calificacion)}
          </Text>
        )}
      </View>

      {(estaAprobado || esAutor) && (
        <Text style={styles.comentario}>
          {data.comentarios}
        </Text>
      )}

      { data.fechaEstado!== undefined && (
        <Text style={styles.fecha}>
          {new Date(data.fechaEstado).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      )}

      {!estaAprobado && esAutor && (
        <View style={styles.estadoPendiente}>
          <MaterialIcons name="access-time" size={16} color="#fbc02d" />
          <Text style={styles.estadoPendienteTexto}>{data.estado}</Text>
        </View>
      )}
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
      position: "relative", // necesario para posicionar el estado pendiente
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
      color: "#FFD700",
      fontFamily: "Sora_700Bold",
    },
    comentario: {
      fontFamily: "Sora_400Regular",
      fontSize: 14,
      color: "#555",
      lineHeight: 20,
      marginTop: 4,
    },
    fecha: {
      fontFamily: "Sora_400Regular",
      fontSize: 12,
      color: "#888",
      marginTop: 6,
    },
    estadoPendiente: {
      position: "absolute",
      bottom:10 ,
      right: 10,
      backgroundColor: "#FFF9C4",
      borderRadius: 12,
      paddingVertical: 2,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#FBC02D",
    },
    estadoPendienteTexto: {
      marginLeft: 4,
      fontFamily: "Sora_600SemiBold",
      color: "#F57F17",
      fontSize: 12,
      textTransform: "capitalize",
    }
  });