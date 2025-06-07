import { useEffect, useState, useContext } from "react";
import { Pressable, View, Text, Image, StyleSheet, ScrollView } from "react-native";
import RecipeCard from "../components/recipeCard";
import CardCurso from "../components/CardCurso";
import api from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext";
import { colors, fonts, sizes } from "../utils/themes";

const menu = require("../assets/menu.png");
const userAvatar = require("../assets/user.png");

export default function Profile({navigation}) {
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

  const avatar= async()=>{
    const path=user.avatar.replace("img/cocinero1.jpg", "assets/user.png")
    return path;
  }

  useEffect(() => {
    favorite_recipes();
    getUserInfo();
  }, []);

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.page}>Mi Cuenta</Text>
        <Pressable>
          <Image source={menu} />
        </Pressable>
      </View>

      <View style={styles.userContainer}>
        <View style={styles.innerShadow}></View>
        <Image source={avatar}/>
        <View>
          <Text style={{fontWeight:fonts.bold, fontSize:fonts.small}}>{user?.alias ?? "Mi Usuario"}</Text>
          <Text style={{color:"#c0c0c0"}}>{user?.tipo_usuario ?? "Tipo Usuario"}</Text>
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
      <Text style={{ fontWeight: "700", fontSize: 20, margin:20}}>
        {buttons[pressed]}
      </Text>
      <View style={{marginHorizontal:10, alignItems:"center"}}>
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

    </ScrollView>
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
      alignSelf:"center"
    },
    userContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundColorLight,
      borderRadius: 15,
      padding: 10,
      width: sizes.width*0.9,
      marginBottom: 20,
      marginHorizontal:20,
      alignSelf:"center"
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
    receta:{
      marginVertical:10,
    },
    innerShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    backgroundColor: "transparent",
    zIndex: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,

  },
});
