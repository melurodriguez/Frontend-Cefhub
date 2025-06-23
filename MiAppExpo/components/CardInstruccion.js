import { View, Text, FlatList, Image, Dimensions } from "react-native";
import API_BASE_URL from "../utils/config";
import { StyleSheet } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CardInstruccion({ paso }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Paso {paso.nroPaso}</Text>
      <Text style={styles.descripcion}>{paso.descripcionPaso}</Text>

      {paso.multimedia?.length > 0 && (
        <FlatList
          data={paso.multimedia.filter((item) => item.tipo === "foto")}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: `${API_BASE_URL}/static/${item.url}` }}
              style={styles.imagen}
              resizeMode="cover"
            />
            )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginRight:20,
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  titulo: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  descripcion: {
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  imagen: {
    width: SCREEN_WIDTH * 0.7,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
});
