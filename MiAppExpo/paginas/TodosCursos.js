import { useState, useEffect, useContext } from "react";
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
import PopUpCursos from "../components/PopUpCursos.js";
const backArrow = require("../assets/backArrow.png");
import { Ionicons } from "@expo/vector-icons";
import api from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext.js";

export default function TodosCursos({ navigation }) {
  const [search, setSearch] = useState("");
  const [cursos, setCursos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [popUpAutenticado,setPopUpAutenticado]=useState(false)
  const [popUpNotFound, setPopUpNotFound]=useState(false)
  const [popUpRestricted,setPopUpRestricted]=useState(false)
  const [popUpError, setPopUpError]=useState(false)

  const {token, user}=useContext(AuthContext)



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
    const params = {};

    if (sedeSeleccionada) params.id_sede = sedeSeleccionada;
    if (estadoSeleccionado !== null) params.en_curso = estadoSeleccionado;

    api
      .get("/curso", { params })
      .then((res) => setCursos(res.data))
      .catch((err) => console.error("Error al filtrar:", err))
      .finally(() => setShowFilters(false));
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
          <Text style={styles.rr}>Cursos Disponibles</Text>
          <Pressable onPress={() => setShowFilters(!showFilters)}>
            <Ionicons name="filter-outline" size={24} color={colors.primary} />
          </Pressable>
        </View>

        {cursos.map((curso) => (
          <View style={styles.card} key={curso.idCurso}>
            <CardCurso
              data={curso}
              onPress={() => {
                handleCursos(curso);
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
          {sedes.map((sede, index) => (
            <Pressable
              key={`${sede.idSede}-${index}`}
              onPress={() => setSedeSeleccionada(sede.idSede)}
            >
              <Text style={styles.filterItem}>
                {sedeSeleccionada === sede.idSede ? "✅" : "▫️"} {sede.nombreSede}
              </Text>
            </Pressable>
          ))}
          <Text style={styles.filterTitle}>Filtrar por estado</Text>
          <Pressable onPress={() => setEstadoSeleccionado(true)}>
            <Text style={styles.filterItem}>
              {estadoSeleccionado === true ? "✅" : "▫️"} En curso
            </Text>
          </Pressable>
          <Pressable onPress={() => setEstadoSeleccionado(false)}>
            <Text style={styles.filterItem}>
              {estadoSeleccionado === false ? "✅" : "▫️"} No comenzaron
            </Text>
          </Pressable>
          <Pressable style={styles.applyButton} onPress={filtrarPorSede}>
            <Text style={styles.applyButtonText}>Aplicar filtros</Text>
          </Pressable>
          <Pressable
              style={styles.applyButton}
              onPress={() => {
                setSedeSeleccionada("");
                setEstadoSeleccionado(null);
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
