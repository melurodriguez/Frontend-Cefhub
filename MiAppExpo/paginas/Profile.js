import { useEffect, useState, useContext } from "react";
import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import RecipeCard from "../components/recipeCard";
import CardCurso from "../components/CardCurso";
import api from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext";

const menu = require("../assets/menu.png");
const userAvatar = require("../assets/user.png");

export default function Profile() {
  const { logout } = useContext(AuthContext);
  const [pressed, setPressed] = useState(0);
  const [recetas, setRecetas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const[user, setUser]=useState(null)


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
      const response = await api.get('user/me');
      setUser(response.data)
      return response.data;
    } catch (error) {
      console.error('Error al obtener la info del usuario:', error);
      throw error;
    }
  };

  const favorite_recipes = async () => {
  try {
    const response = await api.get("user/me/recetas_favoritas");
    const ids = response.data;
    console.log("IDs favoritos:", ids);

    const recetasCompletas = await Promise.all(
      ids.map(async (id) => {
        console.log("Consultando receta con ID:", id);
        const res = await api.get(`recetas/${id}`);
        return res.data;
      })
    );

    setRecetas(recetasCompletas);
  } catch (error) {
    console.error("Error al obtener recetas favoritas:", error);
  }
};


  const courses =async () => {
   try {
     const response = await api.get('user/me/cursos');
     setCursos(response.data)
     return response.data;
   } catch (error) {
     console.error('Error al obtener los cursos del usuario:', error);
     throw error;
   }
 };

  useEffect(() => {
    favorite_recipes();
    getUserInfo();
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
        <Image source={user?.avatar ?? userAvatar} />
        <View>
          <Text>{user?.alias ?? "Mi Usuario"}</Text>
          <Text>{user?.tipo_usuario ?? "Tipo Usuario"}</Text>
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
              <RecipeCard data={receta} onPress={() => navigation.navigate("InfoReceta", { id: receta.id }) }/>
            </View>
          ))}

        {pressed === 1 &&
          cursos.map((curso, index) => (
            <View key={index} style={styles.receta}>
              <CardCurso data={curso} />
            </View>
          ))}
      </View>

      <View style={{ alignItems: "center", marginTop: 30 }}>
        <Pressable onPress={logout}>
          <Text style={{ color: "#d00", fontWeight: "bold", fontSize: 16 }}>
            Cerrar sesión
          </Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      paddingTop: 40,
      paddingHorizontal: 20,
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 20,
      marginTop:60
    },
    page: {
      fontWeight: "700",
      fontSize: 24,
    },
    userContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#c0c0c0",
      borderRadius: 15,
      padding: 10,
      width: "100%",
      marginBottom: 20,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 10,
    },
    userInfo: {
      flexShrink: 1,
    },
    alias: {
      fontWeight: "bold",
      fontSize: 18,
    },
    tipo: {
      color: "#333",
    },
    line: {
      backgroundColor: "#d9d9d9",
      width: "100%",
      height: 1,
      marginBottom: 20,
    },
    btnContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginBottom: 10,
    },
    btn: {
      fontSize: 16,
      color: "#333",
    },
    btnPressed: {
      color: "#505c86",
      fontWeight: "700",
    },
    sectionTitle: {
      fontWeight: "700",
      fontSize: 20,
      marginBottom: 15,
    },
    card: {
      padding: 5,
      marginBottom: 10,
      width: "100%",
    },
    logout: {
      color: "#d00",
      fontWeight: "bold",
      fontSize: 16,
    },
});
