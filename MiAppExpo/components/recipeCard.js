import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import API_BASE_URL from "../utils/config";
const star = require("../assets/star.png");
const userIcon = require("../assets/user.png");

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
            <Image source={userIcon} style={styles.icon} />
            <Text style={styles.userText}>{data.nickname}</Text>
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{data.promedioCalificacion}</Text>
            <Image source={star} style={styles.icon} />
          </View>
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
    padding: 16,
    borderRadius: 16,
    width: 340,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  desc: {
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    color: "#666",
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
    width: 18,
    height: 18,
  },
  userText: {
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    color: "#555",
    marginLeft: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    marginRight: 6,
    color: "#444",
  },
});
