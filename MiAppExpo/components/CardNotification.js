import { View, Text, Image, StyleSheet } from "react-native";
import { sizes, fonts, colors } from "../utils/themes";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function CardNotification({ data, isNew = false }) {
  function formatFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const now = new Date();

    const diffMs = now - fecha;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hoy " + fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Ayer " + fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    } else {
      return fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
    }
  }

  return (
    <View style={[styles.container, isNew && styles.newNotification]}>
      <MaterialIcons
        name={isNew ? "notifications" : "notifications-none"}
        size={30}
        color={isNew ? colors.primary : "#999"}
        style={styles.icon}
      />
      <View style={styles.content}>
        <Text style={styles.descripcion}>{data.descripcion}</Text>
        <Text style={styles.fecha}>{formatFecha(data.fecha_envio)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginVertical: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  newNotification: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  icon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  descripcion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  fecha: {
    fontSize: 12,
    color: "#666",
  },
});