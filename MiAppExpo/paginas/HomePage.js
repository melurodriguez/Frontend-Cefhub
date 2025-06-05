import { ScrollView } from "react-native";
import RecipeCard from "../components/recipeCard";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
const welcomeIcon = require("../assets/welcomeIcon.png");
import axios from "axios";

import API_BASE_URL from "../utils/config.js"; ///ACA IMPORTA EL URL PARA PEGARLE AL ENDPOINT

export default function HomePage({ navigation }) {
  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/recetas/ultimas`)
      .then((res) => setRecetas(res.data))
      .catch((err) => {
        console.error("Error al obtener recetas:", err);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.p}>¡Bienvenido a ChefHub!</Text>
        <Image source={welcomeIcon} style={{ width: 100, height: 100 }} />
      </View>
      <View style={styles.line}></View>
      <Text style={styles.rr}>Recetas Recientes</Text>

      {recetas.map((receta, index) => (
        <Pressable style={styles.card} key={index}>
          <RecipeCard
            data={receta}
            onPress={() => navigation.navigate("InfoReceta", { id: receta.id })}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rr: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 15,
  },
  line: {
    backgroundColor: "#d9d9d9",
    width: 357,
    height: 1,
    marginBottom: 20,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
    marginTop: 40,
  },
  p: {
    color: "#000",
    fontWeight: "700",
    padding: 20,
    fontSize: 24,
  },
  card: {
    padding: 5,
    margin: 5,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
