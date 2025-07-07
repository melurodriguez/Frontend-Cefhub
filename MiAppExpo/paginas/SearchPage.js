import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import RecipeCard from "../components/recipeCard";
import CardCurso from "../components/CardCurso";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/themes.js";
import api from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext.js";
import PopUpCursos from "../components/PopUpCursos.js";


export default function SearchPage({ navigation }) {
  const [search, setSearch] = useState("");
  const [recetas, setRecetas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [popUpAutenticado,setPopUpAutenticado]=useState(false)
  const [popUpNotFound, setPopUpNotFound]=useState(false)
  const [popUpRestricted,setPopUpRestricted]=useState(false)
  const [popUpError, setPopUpError]=useState(false)

  const {token, user}=useContext(AuthContext)

  useFocusEffect(
      useCallback(() => {
        api
          .get("/recetas/?ordenar_por=reciente&limite=3")
          .then((res) => setRecetas(res.data))
          .catch((err) => {
            console.error("Error al obtener recetas:", err);
          });

        api
          .get("/curso")
          .then((res) => setCursos(res.data))
          .catch((err) => {
            console.error("Error al obtener cursos:", err);
          });

      }, [])
    );

  const porNombre = () => {
          api.get(`/recetas/?nombre_receta=${search}`)
          .then((res) => setRecetas(res.data))
          .catch((err) => console.error("Error al aplicar filtros:", err));

          api.get(`/curso/search/${search}`)
          .then((res2) => setCursos(res2.data))
          .catch((err) => console.error("Error al aplicar filtros:", err));


  };



  const handleCursos= async (curso)=>{
    if (!token) {
      setPopUpAutenticado(true);
      return;
    }

    if (!user || user["tipo_usuario"] === "Usuario") {
      setPopUpRestricted(true);
      return;
    }

    try {
      // Validamos que el curso exista y que el usuario tenga acceso
      const res = await api.get(`/curso/${curso.idCurso}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        navigation.navigate("InfoCurso", { id: curso.idCurso });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setPopUpNotFound(true);
      } else if (err.response?.status === 403) {
        setPopUpRestricted(true);
      } else if (err.response?.status === 401) {
        setPopUpAutenticado(true);
      } else {
        console.error("Error al validar acceso al curso:", err.message);
        setPopUpError(true);
      }
    }

  }

   return (
     <ScrollView>
       <View style={styles.header}>

         <Text style={styles.pageTitle}>Búsqueda</Text>

       </View>

       <View style={styles.searchContainer}>
         <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
         <TextInput
           value={search}
           placeholder="Buscar recetas o cursos..."
           onChangeText={setSearch}
           style={styles.input}
         />
         <Pressable onPress={porNombre}>
           <Ionicons name="arrow-forward-circle" size={26} color={colors.primary} />
         </Pressable>
       </View>

       <View style={styles.section}>
         <View style={styles.sectionHeader}>
           <View style={styles.rowIconTitle}>
             <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
             <Text style={styles.sectionTitle}>Recetas Recientes</Text>
           </View>
           <Pressable onPress={() => navigation.navigate("TodasRecetas")}>
             <Text style={styles.verTodos}>Ver todos →</Text>
           </Pressable>
         </View>

         {recetas.map((receta, index) => (
           <View style={styles.card} key={index}>
             <RecipeCard
               data={receta}
               onPress={() => navigation.navigate("InfoReceta", { id: receta.idReceta, avatar: receta.avatar })}
             />
           </View>
         ))}
       </View>

       <View style={styles.section}>
         <View style={styles.sectionHeader}>
           <View style={styles.rowIconTitle}>
             <Ionicons name="school-outline" size={20} color={colors.primary} />
             <Text style={styles.sectionTitle}>Cursos Populares</Text>
           </View>
           <Pressable onPress={() => navigation.navigate("TodosCursos")}>
             <Text style={styles.verTodos}>Ver todos →</Text>
           </Pressable>
         </View>

         {cursos.slice(0, 3).map((curso, index) => (
           <View style={styles.card} key={index}>
             <CardCurso
               data={curso}
               onPress={() => handleCursos(curso)}
             />
           </View>
         ))}
       </View>
       {popUpAutenticado && (
                 <PopUpCursos
                   action={"Acceso Restringido. \n\nDebes estar autenticado para ver esta información."}
                   visible={popUpAutenticado}
                   onClose={() => {
                     setPopUpAutenticado(false);
       
       
                   }}
                   onPress={() => {
                     setPopUpAutenticado(false);
                   }}
                 />
               )}
               {popUpRestricted && (
                 <PopUpCursos
                   action={"Acceso Restringido. \n\nDebes ser alumno para ver esta información."}
                   visible={popUpRestricted}
                   onClose={() => {
                     setPopUpRestricted(false);
       
                   }}
                   onPress={() => {
                     setPopUpRestricted(false);
       
       
                   }}
                 />
               )}
               {popUpNotFound && (
                 <PopUpCursos
                   action={"Error. \n\nCurso no encontrado."}
                   visible={popUpNotFound}
                   onClose={() => {
                     setPopUpNotFound(false);
       
       
                   }}
                   onPress={() => {
                     setPopUpNotFound(false);
       
       
                   }}
                 />
               )}
               {popUpError && (
                 <PopUpCursos
                   action={"Error. \n\nOcurrió un error inesperado."}
                   visible={popUpError}
                   onClose={() => {
                     setPopUpError(false);
       
       
                   }}
                   onPress={() => {
                     setPopUpError(false);
       
                   }}
                 />
               )}
     </ScrollView>
   );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    marginBottom: 10,
    marginTop: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Sora_700Bold",
    color: colors.black,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f5",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Sora_400Regular",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  rowIconTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Sora_700Bold",
    marginLeft: 4,
    color: colors.black,
  },
  verTodos: {
    fontFamily: "Sora_400Regular",
    color: colors.primary,
  },
  card: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
});
