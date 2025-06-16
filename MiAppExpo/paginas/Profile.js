import { useEffect, useState, useContext } from "react";
import { Pressable, View, Text, Image, StyleSheet, ScrollView } from "react-native";
import RecipeCard from "../components/recipeCard";
import CardCursoInscripcion from "../components/CardCursoInscripcion";
import api from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext";
import PopUp from '../components/PopUp'
import { colors, fonts, sizes } from "../utils/themes";

const menu = require("../assets/menu.png");
const userAvatar = require("../assets/user.png");

export default function Profile({navigation}) {
  const [pressed, setPressed] = useState(0);
  const [recetas, setRecetas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const [visible, setPopUpVisible] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");


  const buttons = user?.tipo_usuario === "Alumno"
      ? ["Favoritos", "Mis Cursos", "Descargas"]
      : ["Favoritos", "Descargas"];

  function handleClick(index) {
      setPressed(index);
      const selected = buttons[index];
      if (selected === "Favoritos") {
        favorite_recipes();
      } else if (selected === "Mis Cursos") {
        courses();
      }
    }


  const favorite_recipes = async () => {
    try {
      const response = await api.get("user/me/recetas_favoritas");
      const ids = response.data;
      console.log("IDs favoritos:", ids);

      if (Array.isArray(ids) && ids.length > 0) {
        const recetasCompletas = await Promise.all(
          ids
            .filter(id => id != null) // descarta null/undefined
            .map(async (id) => {
              console.log("Consultando receta con ID:", id);
              const res = await api.get(`recetas/${id}`);
              return res.data;
            })
        );
        setRecetas(recetasCompletas);
      } else {
        setRecetas([]); // si no hay favoritos, deja el array vacío
      }
    } catch (error) {
      console.error("Error al obtener recetas favoritas:", error);
      setRecetas([]); // opcional: resetear si falla la request
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


  useEffect(()=>{
    if (user?.tipo_usuario === "Alumno") {
    courses();
  }
  }, [[user?.tipo_usuario]])


  useEffect(() => {
    favorite_recipes();
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
        <Image source={userAvatar}/>
        <View style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}>
          <Text style={{ fontWeight: fonts.bold, fontSize: fonts.small, fontFamily:'Sora_700Bold' }}>{user?.nickname ?? "Mi Usuario"}</Text>
          <Text style={{ color: "#c0c0c0" , fontFamily:'Sora_400Regular',}}>{user?.tipo_usuario ?? "Tipo Usuario"}</Text>
        </View>

        <View style={{ marginTop: 10, marginRight:10, alignItems: "flex-end" }}>
                <Pressable onPress={logout}>
                  <Text style={{ color: "#d00", fontWeight: "bold", fontSize: 16 }}>
                    Cerrar sesión
                  </Text>
                </Pressable>
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
      <Text style={{ fontFamily:'Sora_700Bold', fontSize: 20, margin:20}}>
        {buttons[pressed]}
      </Text>
      <View style={{ marginHorizontal: 10, alignItems: "center" }}>
        {buttons[pressed] === "Favoritos" && (
          (recetas?.length > 0) ? (
            recetas.map((receta, index) => (
              <View key={index} style={styles.receta}>
                <RecipeCard
                  data={receta}
                  onPress={() => navigation.navigate("InfoReceta", { id: receta.id })}
                />
              </View>
            ))
          ) : (
            <Text style={styles.page}>No tenés recetas favoritas</Text>
          )
        )}

        {buttons[pressed] === "Mis Cursos" && (
          (cursos?.length > 0) ? (
            cursos.map((curso, index) => (
              <View key={index} style={styles.receta}>
                <CardCursoInscripcion
                  data={curso}
                  onPress={courses}
                  onPopUp={(mensaje) => {
                    setPopUpMessage(mensaje);
                    setPopUpVisible(true);
                  }}
                />
              </View>
            ))
          ) : (
            <Text style={styles.page}>No estás inscripta a ningún curso</Text>
          )
        )}

        {buttons[pressed] === "Descargas" && (
          <Text style={styles.page}>Aún no descargaste recetas</Text>
        )}
      </View>

      <PopUp
        action={popUpMessage}
        visible={visible}
        onClose={() =>setPopUpVisible(false)}
        duration={2000}
      />



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
      width: "90%",
      marginBottom: 20,
      marginTop:60,
      marginHorizontal:20
    },
    page: {
      fontFamily:'Sora_700Bold',
      fontSize: 24,
      alignSelf:"center"
    },
    userContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.backgroundColorLight,
      borderRadius: 15,
      padding: 10,
      width:"100%",
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
      fontFamily:'Sora_700Bold',
      fontSize: 18,
    },
    tipo: {
      color: "#333",
      fontFamily:'Sora_400Regular'
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
      fontFamily:'Sora_400Regular',
    },
    btnPressed: {
      color: "#505c86",
      fontFamily:'Sora_700Bold',
    },
    sectionTitle: {
      fontFamily:'Sora_700Bold',
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
      fontFamily:'Sora_700Bold',
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
