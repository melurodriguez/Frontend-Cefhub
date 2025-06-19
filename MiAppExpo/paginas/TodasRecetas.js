import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/themes.js";
import RecipeCard from "../components/recipeCard";
import { ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
const menu = require("../assets/menu.png");
const backArrow = require("../assets/backArrow.png");

import api from "../api/axiosInstance";

export default function TodasRecetas({ navigation }) {
  const [search, setSearch] = useState("");
  const [recetas, setRecetas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [orden, setOrden] = useState("alfabetico");
  const [filtros, setFiltros] = useState({
    tipo: "",
    conIngrediente: "",
    sinIngrediente: "",
    nickname: "", // 👈 nuevo
  });
  const [mostrarCampos, setMostrarCampos] = useState({
    tipo: false,
    conIngrediente: false,
    sinIngrediente: false,
    nickname: false, // 👈 nuevo
  });

  // drop downs
  const [tipos, setTipos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  const limpiarFiltros = () => {
    setOrden("alfabetico");
    setFiltros({
      tipo: "",
      conIngrediente: "",
      sinIngrediente: "",
    });
    setMostrarCampos({
      tipo: false,
      conIngrediente: false,
      sinIngrediente: false,
    });

    api
      .get("/recetas")
      .then((res) => setRecetas(res.data))
      .catch((err) => console.error("Error al limpiar filtros:", err));

    setShowFilters(false);
  };

  const aplicarFiltros = () => {
    const queryParams = [];

    if (orden === "recientes") {
      queryParams.push("ordenar_por=reciente");
    } else if (orden === "alfabetico") {
      queryParams.push("ordenar_por=nombre");
    }

    if (filtros.tipo) queryParams.push(`id_tipo=${filtros.tipo}`);
    if (filtros.conIngrediente)
      queryParams.push(`id_ingrediente_incluye=${filtros.conIngrediente}`);
    if (filtros.sinIngrediente)
      queryParams.push(`id_ingrediente_excluye=${filtros.sinIngrediente}`);
    if (filtros.nickname) queryParams.push(`nickname=${filtros.nickname}`);

    const queryString = queryParams.join("&");

    api
      .get(`/recetas?${queryString}`)
      .then((res) => setRecetas(res.data))
      .catch((err) => console.error("Error al aplicar filtros:", err));

    setShowFilters(false);
  };

  const porNombre = () => {
    const query = `nombre_receta=${search}`;
    api
      .get(`/recetas?${query}`)
      .then((res) => setRecetas(res.data))
      .catch((err) => console.error("Error al buscar por nombre:", err));
  };

  useEffect(() => {
    // Cargar tipos de receta
    api
      .get("/recetas/tipos")
      .then((res) => setTipos(res.data))
      .catch((err) => console.error("Error al cargar tipos:", err));

    // Cargar ingredientes
    api
      .get("/recetas/ingredientes")
      .then((res) => setIngredientes(res.data))
      .catch((err) => console.error("Error al cargar ingredientes:", err));

    aplicarFiltros();
  }, []);

  return (
    <>
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

        <View>
          <View style={styles.resultTitle}>
            <Text style={styles.rr}>Recetas Disponibles</Text>
            <Pressable onPress={() => setShowFilters(!showFilters)}>
              <Ionicons name="filter-outline" size={24} color={colors.primary} />
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
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilters}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable onPress={() => setShowFilters(false)}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </Pressable>
            <Text style={styles.filterTitle}>Ordenar por</Text>

            <Pressable onPress={() => setOrden("alfabetico")}>
              <Text style={styles.filterItem}>
                {orden === "alfabetico" ? "✅" : "▫️"} Orden alfabético (A-Z)
              </Text>
            </Pressable>

            <Pressable onPress={() => setOrden("recientes")}>
              <Text style={styles.filterItem}>
                {orden === "recientes" ? "✅" : "▫️"} Más recientes primero
              </Text>
            </Pressable>

            <Text style={styles.filterTitle}>Filtrar por</Text>

            <Pressable
              onPress={() =>
                setMostrarCampos({
                  ...mostrarCampos,
                  tipo: !mostrarCampos.tipo,
                })
              }
            >
              <Text style={styles.filterItem}>
                {mostrarCampos.tipo ? "✅" : "▫️"} Tipo de receta
              </Text>
            </Pressable>
            {mostrarCampos.tipo && (
              <Picker
                selectedValue={filtros.tipo}
                onValueChange={(itemValue) =>
                  setFiltros({ ...filtros, tipo: itemValue })
                }
                style={styles.input}
              >
                <Picker.Item label="Seleccione un tipo" value="" />
                {tipos.map((tipo) => (
                  <Picker.Item
                    key={tipo.idTipo}
                    label={tipo.descripcion}
                    value={tipo.idTipo}
                  />
                ))}
              </Picker>
            )}

            <Pressable
              onPress={() =>
                setMostrarCampos({
                  ...mostrarCampos,
                  conIngrediente: !mostrarCampos.conIngrediente,
                })
              }
            >
              <Text style={styles.filterItem}>
                {mostrarCampos.conIngrediente ? "✅" : "▫️"} Contiene
                ingrediente
              </Text>
            </Pressable>
            {mostrarCampos.conIngrediente && (
              <Picker
                selectedValue={filtros.conIngrediente}
                onValueChange={(itemValue) =>
                  setFiltros({ ...filtros, conIngrediente: itemValue })
                }
                style={styles.input}
              >
                <Picker.Item label="Seleccione un ingrediente" value="" />
                {ingredientes.map((ingrediente) => (
                  <Picker.Item
                    key={ingrediente.idIngrediente}
                    label={ingrediente.nombre}
                    value={ingrediente.idIngrediente}
                  />
                ))}
              </Picker>
            )}

            <Pressable
              onPress={() =>
                setMostrarCampos({
                  ...mostrarCampos,
                  sinIngrediente: !mostrarCampos.sinIngrediente,
                })
              }
            >
              <Text style={styles.filterItem}>
                {mostrarCampos.sinIngrediente ? "✅" : "▫️"} No contiene
                ingrediente
              </Text>
            </Pressable>
            {mostrarCampos.sinIngrediente && (
              <Picker
                selectedValue={filtros.sinIngrediente}
                onValueChange={(itemValue) =>
                  setFiltros({ ...filtros, sinIngrediente: itemValue })
                }
                style={styles.input}
              >
                <Picker.Item label="Seleccione un ingrediente" value="" />
                {ingredientes.map((ingrediente) => (
                  <Picker.Item
                    key={ingrediente.idIngrediente}
                    label={ingrediente.nombre}
                    value={ingrediente.idIngrediente}
                  />
                ))}
              </Picker>
            )}
            <Pressable
              onPress={() =>
                setMostrarCampos({
                  ...mostrarCampos,
                  nickname: !mostrarCampos.nickname,
                })
              }
            >
              <Text style={styles.filterItem}>
                {mostrarCampos.nickname ? "✅" : "▫️"} Creador
              </Text>
            </Pressable>

            {mostrarCampos.nickname && (
              <TextInput
                placeholder="Ingrese nickname"
                value={filtros.nickname}
                onChangeText={(text) =>
                  setFiltros({ ...filtros, nickname: text })
                }
                style={styles.input}
              />
            )}

            <Pressable style={styles.applyButton} onPress={aplicarFiltros}>
              <Text style={styles.applyButtonText}>Aplicar filtros</Text>
            </Pressable>

            <Pressable style={styles.applyButton} onPress={limpiarFiltros}>
              <Text style={styles.applyButtonText}>Limpiar filtros</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Sora_400Regular",
  },
  searchInput: {
    width: 330,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#f1f5f5",
  },

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
  card: {
    padding: 5,
    alignItems: "center",
  },
  rr: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 15,
  },
  resultTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
    maxHeight: "70%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  closeButton: {
    alignSelf: "flex-end",
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 10,
  },

  filterTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    color: "#333",
  },

  filterItem: {
    fontSize: 16,
    marginLeft: 10,
    marginVertical: 6,
    color: "#555",
  },

  applyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 15,
    alignSelf: "center",
  },

  applyButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
