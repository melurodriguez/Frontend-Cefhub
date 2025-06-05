import { useEffect, useState } from "react";
import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import RecipeCard from "../components/recipeCard";
import CardCurso from "../components/CardCurso";
import api from "../api/axiosInstance";

const menu = require("../assets/menu.png");
const user = require("../assets/user.png");

export default function Profile() {
  const [pressed, setPressed] = useState(0);
  const [recetas, setRecetas] = useState([]);
  const [cursos, setCursos] = useState([]);

  const buttons = ["Mis Favoritos", "Mis Cursos"];

  function handleClick(index) {
    setPressed(index);
    if (index === 0) {
      favorite_recipes();
    } else {
      courses();
    }
  }

  const getUserInfo = async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Error al obtener la info del usuario:', error);
      throw error;
    }
  };

  const favorite_recipes = async () => {
     try {
       const response = await api.get('/me/recetas_favoritas');
       return response.data;
     } catch (error) {
       console.error('Error al obtener recetas favoritas:', error);
       throw error;
     }
    };

  const courses =async () => {
   try {
     const response = await api.get('/me/cursos');
     return response.data;
   } catch (error) {
     console.error('Error al obtener los cursos del usuario:', error);
     throw error;
   }
 };

  useEffect(() => {
    favorite_recipes();
  }, []);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.page}>Mi Cuenta</Text>
        <Pressable>
          <Image source={menu} />
        </Pressable>
      </View>

      <View style={styles.userContainer}>
        <Image source={user} />
        <View>
          <Text>Mi Usuario</Text>
          <Text>Tipo Usuario</Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        {buttons.map((title, index) => (
          <Pressable key={index} onPress={() => handleClick(index)}>
            <Text style={[styles.btn, pressed === index && styles.btnPressed]}>
              {title}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ fontWeight: "700", fontSize: 20 }}>
        {buttons[pressed]}
      </Text>
      <View>
        {pressed === 0 &&
          recetas.map((receta, index) => (
            <View key={index} style={styles.receta}>
              <RecipeCard data={receta} />
            </View>
          ))}

        {pressed === 1 &&
          cursos.map((curso, index) => (
            <View key={index} style={styles.receta}>
              <CardCurso data={curso} />
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  page: {
    fontWeight: "700",
    fontSize: 24,
  },
  userContainer: {
    flexDirection: "row",
    backgroundColor: "#c0c0c0",
    borderRadius: 15,
    padding: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  btnPressed: {
    color: "#505c86",
    fontWeight: "700",
  },
  receta: {
    padding: 10,
  },
});
