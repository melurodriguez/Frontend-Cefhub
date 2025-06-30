import { View, Text, FlatList, Image, Dimensions, ScrollView } from "react-native";
import API_BASE_URL from "../utils/config";
import { StyleSheet } from "react-native";
import Video from 'expo-video';



const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CardInstruccion({ paso }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Paso {paso.nroPaso}</Text>
      <Text style={styles.descripcion}>{paso.descripcionPaso}</Text>


      {paso.multimedia?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {paso.multimedia.map((item, index) => {
            const uri = `${API_BASE_URL}/static/${item.url}`;
            if (item.tipo === "foto") {
              return (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.imagen}
                  resizeMode="cover"
                />
              );
            } else if (item.tipo === "video") {
              return (
                <Video
                  key={index}
                  source={{ uri }}
                  style={[styles.imagen, { backgroundColor: "#000" }]}
                  resizeMode="contain"
                  useNativeControls
                  isLooping={false}
                  shouldPlay={false}
                />
              );
            } else {
              return null;
            }
          })}
        </ScrollView>
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
