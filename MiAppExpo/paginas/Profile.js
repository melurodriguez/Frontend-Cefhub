import { useEffect, useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Pressable, View, Text, Image, StyleSheet, ScrollView, Alert } from "react-native";
import RecipeCard from "../components/recipeCard";
import CardCursoInscripcion from "../components/CardCursoInscripcion";
import api from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext";
import PopUp from '../components/PopUp'
import PopUpLogOut from '../components/PopUpLogOut'
import { colors, fonts, sizes } from "../utils/themes";
import API_BASE_URL from "../utils/config";
const menu = require("../assets/menu.png");
const userAvatar = require("../assets/user.png");
import * as SecureStore from "expo-secure-store";

export default function Profile({navigation}) {
  const [pressed, setPressed] = useState(0);
  const [recetas, setRecetas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const[cuentaCorriente, setCuentaCorriente] = useState(0);
  const { user } = useContext(AuthContext);
  console.log("User en Profile:", user);
  const [visible, setVisible] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [popUpVisible, setPopUpVisible]=useState(false);
  const [recetasDescargadas, setRecetasDescargadas] = useState([]);
  const avatars = [
    require("../assets/user.png"),     // 0
    require("../assets/user2.png"),    // 1
    require("../assets/user3.png"),    // 2
    require("../assets/user4.png"),    // 3
    require("../assets/user5.png"),    // 4
    require("../assets/user6.png"),    // 5
  ];




  const buttons = user?.tipo_usuario === "Alumno"
      ? ["Favoritos", "Mis Cursos", "Descargas"]
      : ["Favoritos", "Descargas"];

  function handleClick(index) {
     setPressed(index);
   }



  const favorite_recipes = useCallback(async () => {
      try {
        const response = await api.get("user/me/recetas_favoritas");
        setRecetas(response.data);
      } catch (error) {
        console.error("Error al obtener recetas favoritas:", error);
        setRecetas([]);
      }
    }, []);

    const courses = useCallback(async () => {
      try {
        const response = await api.get('user/me/cursos');
        setCursos(response.data);
      } catch (error) {
        console.error('Error al obtener los cursos del usuario:', error);
        setCursos([]);
      }
    }, []);

    const cuentacorriente = useCallback(async () => {
        try {
            const response = await api.get("user/me");
            setCuentaCorriente(response.data.cuentaCorriente);

        } catch (error) {
            console.error("Error al obtener cuenta corriente:", error);
            setCuentaCorriente(0);
        }
    }, []);

    useFocusEffect(
      useCallback(() => {
        favorite_recipes();
        if (user?.tipo_usuario === "Alumno") {
          courses();
          cuentacorriente();
        }
      }, [])
    );

    useEffect(() => {
      const obtenerRecetasGuardadas = async () => {
        try {
          const recetasJson = await SecureStore.getItemAsync('recetas_guardadas');
          const recetas = recetasJson ? JSON.parse(recetasJson) : [];
          setRecetasDescargadas(recetas);
        } catch (error) {
          console.error("Error al obtener recetas locales:", error);
          setRecetasDescargadas([]);
        }
      };

      if (pressed === buttons.indexOf("Descargas")) {
        obtenerRecetasGuardadas();
      }
    }, [pressed]);

    function handleLogOut(){
      setPopUpVisible(true)
    }

    const guardarRecetasEnSecureStore = async (recetas) => {
      try {
        await SecureStore.setItemAsync('recetas_guardadas', JSON.stringify(recetas));
      } catch (error) {
        console.error("Error al guardar recetas en SecureStore:", error);
      }
    };

    const borrarReceta = (index) => {
      Alert.alert(
        "Confirmar eliminación",
        "¿Querés borrar esta receta descargada?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Borrar",
            style: "destructive",
            onPress: () => {
              const nuevasRecetas = [...recetasDescargadas];
              nuevasRecetas.splice(index, 1);
              setRecetasDescargadas(nuevasRecetas);
              // Opcional: actualizar también en SecureStore si las cargas desde ahí
              guardarRecetasEnSecureStore(nuevasRecetas);
            }
          }
        ]
      );
    };

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.page}>Mi Cuenta</Text>
      </View>

      <View style={styles.userContainer}>
        <View style={styles.innerShadow}></View>
        <Image  style={styles.avatar} source={avatars[parseInt(user.avatar)]}/>
        <View style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}>
          <Text style={{ fontWeight: fonts.bold, fontSize: fonts.medium, fontFamily:'Sora_700Bold' }}>{user?.nickname ?? "Mi Usuario"}</Text>
          <Text style={{ color: "#c0c0c0" , fontFamily:'Sora_400Regular',}}>{user?.tipo_usuario ?? "Tipo Usuario"}</Text>
        </View>

        
      </View>
      {user?.tipo_usuario === "Alumno" && (
        <Text style={styles.cuentaCorriente}>
          Cuenta corriente: {cuentaCorriente}
        </Text>
      )}


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
                  onPress={() => navigation.navigate("InfoReceta", { id: receta.idReceta })}
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
                    setVisible(true);
                  }}
                />
              </View>
            ))
          ) : (
            <Text style={styles.page}>No estás inscripta a ningún curso</Text>
          )
        )}

        {buttons[pressed] === "Descargas" && (
          recetasDescargadas.length > 0 ? (
            recetasDescargadas.map((receta, index) => (
              <View key={index} style={styles.receta}>
                <View style={{ position: 'relative' }}>
                  <Pressable
                    onPress={() => borrarReceta(index)}
                    style={styles.btnBorrarReceta}
                  >
                    <Text style={styles.textoBorrarReceta}>×</Text>
                  </Pressable>


                  <RecipeCard
                    data={receta}
                    onPress={() => navigation.navigate("InfoRecetaDescargadas", { receta })}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.page}>Aún no descargaste recetas</Text>
          )
        )}


      </View>

      <PopUp
        action={popUpMessage}
        visible={visible}
        onClose={() =>setVisible(false)}
        duration={2000}
      />
      { popUpVisible && <PopUpLogOut visible={popUpVisible} onClose={() => setPopUpVisible(false)}/>}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
      paddingTop: 40,
      paddingHorizontal: 20,
      alignItems: "center",
    },
    cuentaCorriente: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: '700',
        marginVertical: 10,
        marginHorizontal: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        paddingBottom: 4,
      },
    header: {
      flexDirection: "row",
      justifyContent: "center",
      width: "90%",
      marginBottom: 20,
      marginTop:60,
      marginHorizontal:20
    },
    page: {
      fontFamily:'Sora_700Bold',
      fontSize: 18,
      alignSelf:"center"
    },
    userContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.white,
      borderRadius: 15,
      padding: 20,
      width:"90%",
      marginBottom: 20,
      alignSelf:"center"
    },
    avatar: {
      width: 60,
      height: 60,
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
  btnBorrarReceta: {
      position: 'absolute',
      top: -2,
      right: -2,
      zIndex: 10,
      backgroundColor: 'rgba(255, 59, 48, 0.85)', // rojo intenso semi-transparente
      padding: 8,
      borderRadius: 15, // botón circular (si el ancho y alto es 30)
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },

    textoBorrarReceta: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
      lineHeight: 18,
      textAlign: 'center',
    },
});
