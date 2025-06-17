import { StyleSheet, View, Text, Pressable } from "react-native";

export default function CardCurso({ data, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.cursoTitle}>{data.descripcion}</Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.detailText}>Duración: {data.duracion} clases</Text>
          <Text style={styles.detailText}>Modalidad: {data.modalidad}</Text>
        </View>

        <View style={styles.pricing}>
          <Text style={styles.finalPrice}>🔥 Precio final: ${data.precio} ARS</Text>
          <Text style={styles.installments}>
            Hasta <Text style={styles.bold}>6 cuotas sin interés</Text> de{" "}
            <Text style={styles.bold}>${Math.round(data.precio / 6)} ARS </Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  pressable: {
    marginVertical: 5,
    alignItems: "center",
  },
  container: {
    backgroundColor: "#FFF2E5",
    padding: 22,
    borderRadius: 18,
    width: 340,
    elevation: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  header: {
    marginBottom: 10,
  },
  cursoTitle: {
    fontFamily: "Sora_700Bold",
    fontSize: 20,
    color: "#1E1E1E",
  },
  details: {
    marginVertical: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ffd3b6",
  },
  detailText: {
    fontFamily: "Sora_400Regular",
    fontSize: 15,
    color: "#444",
    marginVertical: 4,
  },
  pricing: {
    marginTop: 15,
    backgroundColor: "#F9E8DC",
    padding: 10,
    borderRadius: 12,
  },
  finalPrice: {
    fontFamily: "Sora_700Bold",
    fontSize: 18,
    color: "#E65100",
    marginBottom: 6,
  },
  installments: {
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    color: "#555",
  },
  bold: {
    fontFamily: "Sora_600SemiBold",
    color: "#000",
  },
});
