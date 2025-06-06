import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Modal
} from "react-native";

import { colors } from "../utils/themes.js";

import RecipeCard from "../components/recipeCard";
import { ScrollView } from "react-native";

const menu = require("../assets/menu.png");
const searchIcon = require("../assets/search.png");
const filter = require("../assets/filter.png");
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
    sinIngrediente: ""
  });
  const [mostrarCampos, setMostrarCampos] = useState({
    tipo: false,
    conIngrediente: false,
    sinIngrediente: false
  });

  const limpiarFiltros = () => {
        setOrden("alfabetico");
          setFiltros({
            tipo: "",
            conIngrediente: "",
            sinIngrediente: ""
          });
          setMostrarCampos({
            tipo: false,
            conIngrediente: false,
            sinIngrediente: false
          });

          api.get("/recetas")
            .then((res) => setRecetas(res.data))
            .catch((err) => console.error("Error al limpiar filtros:", err));

          setShowFilters(false);

  };

  const aplicarFiltros = () => {
    const queryParams = [];

    if (orden === "recientes") {
      queryParams.push("sort=fecha_publicacion", "order=desc");
    }

    if (filtros.tipo) queryParams.push(`tipo=${filtros.tipo}`);
    if (filtros.conIngrediente) queryParams.push(`contiene_ingrediente=${filtros.conIngrediente}`);
    if (filtros.sinIngrediente) queryParams.push(`excluye_ingrediente=${filtros.sinIngrediente}`);

    const queryString = queryParams.join("&");

    api
      .get(`/recetas?${queryString}`)
      .then((res) => setRecetas(res.data))
      .catch((err) => console.error("Error al aplicar filtros:", err));

    setShowFilters(false);
  };

  const porNombre = () => {
        api.get(`/recetas?nombre=${search}`).then((res) => setRecetas(res.data))
        .catch((err) => console.error("Error al aplicar filtros:", err));

  };

  useEffect(() => {
    aplicarFiltros();
  }, []);


  return (
    <>
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image source={backArrow} style={{ tintColor: colors.black }} />
          </Pressable>
          <Text style={styles.pageTitle}>Búsqueda</Text>
          <Pressable>
            <Image source={menu} />
          </Pressable>
        </View>

        <View style={styles.resultTitle}>
          <TextInput
            value={search}
            placeholder="Search"
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Pressable onPress={porNombre}>
            <Image source={searchIcon} style={{ tintColor: "#000" }} />
          </Pressable>
        </View>

        <View>
          <View style={styles.resultTitle}>
            <Text style={styles.rr}>Recetas Disponibles</Text>
            <Pressable onPress={() => setShowFilters(!showFilters)}>
              <Image source={filter} style={styles.filterIcon} />
            </Pressable>
          </View>

          {recetas.map((receta, index) => (
            <View style={styles.card} key={index}>
              <RecipeCard
                data={receta}
                onPress={() =>
                  navigation.navigate("InfoReceta", { id: receta.id })
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

            <Pressable onPress={() =>
              setMostrarCampos({ ...mostrarCampos, tipo: !mostrarCampos.tipo })
            }>
              <Text style={styles.filterItem}>
                {mostrarCampos.tipo ? "✅" : "▫️"} Tipo de receta
              </Text>
            </Pressable>
            {mostrarCampos.tipo && (
              <TextInput
                placeholder="Ej: Postre, Entrada..."
                value={filtros.tipo}
                onChangeText={(text) => setFiltros({ ...filtros, tipo: text })}
                style={styles.input}
              />
            )}

            <Pressable onPress={() =>
              setMostrarCampos({
                ...mostrarCampos,
                conIngrediente: !mostrarCampos.conIngrediente
              })
            }>
              <Text style={styles.filterItem}>
                {mostrarCampos.conIngrediente ? "✅" : "▫️"} Contiene ingrediente
              </Text>
            </Pressable>
            {mostrarCampos.conIngrediente && (
              <TextInput
                placeholder="Ej: Chocolate, Zanahoria..."
                value={filtros.conIngrediente}
                onChangeText={(text) =>
                  setFiltros({ ...filtros, conIngrediente: text })
                }
                style={styles.input}
              />
            )}

            <Pressable onPress={() =>
              setMostrarCampos({
                ...mostrarCampos,
                sinIngrediente: !mostrarCampos.sinIngrediente
              })
            }>
              <Text style={styles.filterItem}>
                {mostrarCampos.sinIngrediente ? "✅" : "▫️"} No contiene ingrediente
              </Text>
            </Pressable>
            {mostrarCampos.sinIngrediente && (
              <TextInput
                placeholder="Ej: Gluten, Azúcar..."
                value={filtros.sinIngrediente}
                onChangeText={(text) =>
                  setFiltros({ ...filtros, sinIngrediente: text })
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
    width: 100,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#f1f5f5",
  },
  searchInput:{
    width: 330,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#f1f5f5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10,
    marginTop: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
    maxHeight: '70%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },


    closeButton: {
      alignSelf: 'flex-end',
      fontSize: 16,
      fontWeight: '600',
      color: '#007AFF',
      marginBottom: 10,
    },

    filterTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 15,
      marginBottom: 10,
      color: '#333',
    },

    filterItem: {
      fontSize: 16,
      marginLeft: 10,
      marginVertical: 6,
      color: '#555',
    },

    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginHorizontal: 10,
      marginBottom: 12,
      fontSize: 16,
      backgroundColor: '#fafafa',
    },

    applyButton: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 25,
      marginTop: 15,
      alignSelf: 'center',
    },

    applyButtonText: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '600',
      textAlign: 'center',
    },

});
