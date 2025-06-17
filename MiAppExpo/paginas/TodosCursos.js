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

import CardCurso from "../components/CardCurso";
import { ScrollView } from "react-native";

const menu = require("../assets/menu.png");
const searchIcon = require("../assets/search.png");
const filter = require("../assets/filter.png");
const backArrow = require("../assets/backArrow.png");

import api from "../api/axiosInstance";

export default function TodosCursos({ navigation }) {
  const [search, setSearch] = useState("");
  const [cursos, setCursos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");


  useEffect(() => {
    api
      .get("/curso")
      .then((res) => setCursos(res.data))
      .catch((err) => {
        console.error("Error al obtener cursos:", err);
      });

    api
        .get("/sedes")
        .then((res) => setSedes(res.data))
        .catch((err) => console.error("Error al obtener sedes:", err));


  }, []);

  const porNombre = () => {
          api.get(`/curso/search/${search}`)
          .then((res2) => setCursos(res2.data))
          .catch((err) => console.error("Error al aplicar filtros:", err));

   };

  const filtrarPorSede = () => {
    if (!sedeSeleccionada) return;

    api
      .get(`/sedes/${sedeSeleccionada}`)
      .then((res) => setCursos(res.data))
      .catch((err) => console.error("Error al filtrar por sede:", err));

    setShowFilters(false);
  };


  return (
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
          <Text style={styles.rr}>Cursos Disponibles</Text>
          <Pressable onPress={() => setShowFilters(!showFilters)}>
            <Image source={filter} style={styles.filterIcon} />
          </Pressable>
        </View>
        {cursos.map((curso) => (
          <View style={styles.card} key={curso.idCurso}>
            <CardCurso
              data={curso}
              onPress={() => {
                navigation.navigate("InfoCurso", { id: curso.idCurso });
              }}
            />
          </View>
        ))}

      </View>
      <Modal
              animationType="slide"
              transparent={true}
              visible={showFilters}
              onRequestClose={() => setShowFilters(false)}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.filterTitle}>Filtrar por sede</Text>
          {sedes.map((sede) => (
            <Pressable
              key={sede.idSede}
              onPress={() => setSedeSeleccionada(sede.idSede)}
            >
              <Text style={styles.filterItem}>
                {sedeSeleccionada === sede.idSede ? "✅" : "▫️"} {sede.nombreSede}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.applyButton} onPress={filtrarPorSede}>
            <Text style={styles.applyButtonText}>Aplicar filtros</Text>
          </Pressable>
          <Pressable
              style={styles.applyButton}
              onPress={() => {
                setSedeSeleccionada("");
                api
                  .get("/curso")
                  .then((res) => setCursos(res.data))
                  .catch((err) => console.error("Error al limpiar filtros:", err));
                setShowFilters(false);
              }}
            >
              <Text style={styles.applyButtonText}>Limpiar filtros</Text>
            </Pressable>
        </View>
      </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 330,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#f1f5f5",
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

  searchInput:{
      width: 330,
      borderColor: "#d9d9d9",
      borderWidth: 1,
      paddingHorizontal: 15,
      borderRadius: 15,
      backgroundColor: "#f1f5f5",
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
});
