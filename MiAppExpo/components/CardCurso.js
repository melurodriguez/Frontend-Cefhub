import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function CardCurso({ data, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <View style={styles.container}>
        {/* Banner Certificado */}
        <View style={styles.bannerCertificado}>
          <Text style={styles.bannerText}>CERTIFICADO POR IAG</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.cursoTitle}>{data.descripcion}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons
              name="time-outline"
              size={18}
              color="#505c86"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.detailText}>Duración: {data.duracion} clases</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="globe-outline"
              size={18}
              color="#505c86"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.detailText}>Modalidad: {data.modalidad}</Text>
          </View>
        </View>

        <View style={styles.pricing}>
          <View style={styles.priceRow}>
            <Ionicons
              name="flame-outline"
              size={20}
              color="#E65100"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.finalPrice}>Precio final: ${data.precio} ARS</Text>
          </View>
          <View style={styles.priceRow}>
            <Ionicons
              name="card-outline"
              size={14}
              color="#505c86"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.installments}>
              Hasta <Text style={styles.bold}>6 cuotas sin interés</Text> de{" "}
              <Text style={styles.bold}>${Math.round(data.precio / 6)} ARS </Text>
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 8,
    alignItems: "center",
  },
  container: {
    backgroundColor: "#FFF2E5",
    padding: 22,
    borderRadius: 18,
    width: 340,
    elevation: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    position: "relative",
  },
  bannerCertificado: {
    position: "absolute",
    top: -8,
    right: 10,
    backgroundColor: "#505c86",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bannerText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Sora_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  header: {
    marginBottom: 10,
  },
  cursoTitle: {
    fontFamily: "Sora_700Bold",
    fontSize: 18,
    color: "#1E1E1E",
  },
  details: {
    marginVertical: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ffd3b6",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailText: {
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    color: "#1E1E1E",
  },
  pricing: {
    marginTop: 15,
    backgroundColor: "#F9E8DC",
    padding: 10,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  finalPrice: {
    fontFamily: "Sora_700Bold",
    fontSize: 18,
    color: "#E65100",
  },
  installments: {
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    color: "#505c86",
  },
  bold: {
    fontFamily: "Sora_600SemiBold",
    color: "#000",
  },
});
