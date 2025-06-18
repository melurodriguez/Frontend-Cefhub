import React, { useState, useCallback } from "react";
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
import SideMenu from "../components/CustomDrawer.js";
import { colors } from "../utils/themes.js";
import api from "../api/axiosInstance";
const searchIcon = require("../assets/search.png");
const filter = require("../assets/filter.png");
const backArrow = require("../assets/backArrow.png");

export default function SearchPage({ navigation }) {
  const [search, setSearch] = useState("");
  const [recetas, setRecetas] = useState([]);
  const [cursos, setCursos] = useState([]);

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
          api.get(`/recetas/?nombre_receta${search}`)
          .then((res) => setRecetas(res.data))
          .catch((err) => console.error("Error al aplicar filtros:", err));

          api.get(`/curso/search/${search}`)
          .then((res2) => setCursos(res2.data))
          .catch((err) => console.error("Error al aplicar filtros:", err));


  };

  const handleMenu = () => {
    setVisible(!visible);
  };

  const searchCurso = async (curso) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/curso/${curso.id}`);
      const data = await res.json();
    } catch (err) {}
  };

   return (
     <ScrollView>
       <View style={styles.header}>
         <Pressable onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color={colors.black} />
         </Pressable>
         <Text style={styles.pageTitle}>Búsqueda</Text>
         <View style={{ width: 24 }} />
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
               onPress={() =>
                 navigation.navigate("InfoReceta", { id: receta.idReceta })
               }
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
               onPress={() => navigation.navigate("InfoCurso", { id: curso.idCurso })}
             />
           </View>
         ))}
       </View>
     </ScrollView>
   );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: "space-between",
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
