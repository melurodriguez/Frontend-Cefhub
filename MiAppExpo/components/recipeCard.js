import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import API_BASE_URL from "../utils/config";
const star = require("../assets/star.png");
const userIcon = require("../assets/user.png");
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function RecipeCard({ data, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Image
            source={{ uri: `${API_BASE_URL}/static/${data.fotoPrincipal}` }}
            style={styles.img}
          />
          <View style={styles.recipeContent}>
            <Text numberOfLines={1} style={styles.title}>{data.nombreReceta}</Text>
            <Text numberOfLines={2} style={styles.desc}>{data.descripcionReceta}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.userInfo}>
            <Image source={{ uri: `${API_BASE_URL}/static/${data.avatar}` }} style={styles.icon} />
            <Text style={styles.userText}>{data.nickname}</Text>
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{data.promedioCalificacion}</Text>
            <Image source={star} style={styles.icon} />
          </View>
        </View>

        {data.estado && data.estado !== "aprobado" && (
          <View style={styles.estadoPendiente}>
            <MaterialIcons name="access-time" size={16} color="#fbc02d" />
            <Text style={styles.estadoPendienteTexto}>{data.estado}</Text>
          </View>
        )}

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
    padding: 16,
    borderRadius: 16,
    width: 340,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  estadoPendiente: {
    position: "absolute",
    bottom: 10,
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
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  img: {
    width: 110,
    height: 90,
    borderRadius: 12,
  },
  recipeContent: {
    paddingLeft: 16,
    flex: 1,
  },
  title: {
    fontFamily: "Sora_700Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  desc: {
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    color: "#1E1E1E",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 25,
    height: 25,
  },
  userText: {
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: "Sora_400Regular",
    fontSize: 15,
    marginRight: 6,
    color: "#444",
  },
});
