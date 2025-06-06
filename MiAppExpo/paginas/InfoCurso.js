import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import CardSedes from "../components/CardSedes";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import API_BASE_URL from "../utils/config";
import api from "../api/axiosInstance";
import { Alert } from "react-native"; // agregalo arriba con los imports
const { height } = Dimensions.get("window"); //CAMBIAR

const cancel = require("../assets/cancel.png");
const pasteleria = require("../assets/pasteleriaCurso.png");

export default function InfoCurso({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  console.log(id);
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/curso/${id}`)
      .then((res) => setCurso(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          //console.log("Acceso restringido", "Debes ser alumno para ver esta información");
          setError("403");
        } else if (err.response?.status === 404) {
          //console.log("Error", "Curso no encontrado");
          setError("404");
        } else {
          //console.error(err);
          setError("unknown");
        }
      });
  }, []);

  useEffect(() => {
    if (error) {
      let title = "";
      let message = "";

      if (error === "403") {
        title = "Acceso restringido";
        message = "Debes ser alumno para ver esta información";
      } else if (error === "404") {
        title = "Error";
        message = "Curso no encontrado";
      } else {
        title = "Error";
        message = "Ocurrió un error inesperado";
      }

      Alert.alert(
        title,
        message,
        [
          {
            text: "Aceptar",
            onPress: () => {
              navigation.goBack()
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [error]);




  if (!curso || error) {
    return (
      <View style={styles.container}>
        <Text>Cargando curso...</Text>
      </View>
    );
  }




  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: `${API_BASE_URL}/static/${curso.imagen_curso_url}` }}
        resizeMode="cover"
        style={styles.imgBg}
      >
        <View>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image source={cancel} />
          </Pressable>
        </View>
      </ImageBackground>
      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{curso.nombre}</Text>
        <Text style={styles.desc}>{curso.descripcion_breve}</Text>
        <Text style={styles.objetivo}>Objetivo</Text>
        <Text style={styles.objDesc}>{curso.descripcion_completa}</Text>
        <Text style={styles.objetivo}>Temas</Text>
        {curso.temas?.map((tema, index) => (
          <Text key={index}>{tema}</Text>
        ))}
        <Text style={styles.objetivo}>Prácticas</Text>
        {curso.practicas?.map((practica, index) => (
          <Text key={index}>{practica}</Text>
        ))}
        <Text style={styles.objetivo}>Insumos</Text>
        {curso.insumos?.map((insumo, index) => (
          <Text key={index}>{insumo}</Text>
        ))}


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBg: {
    width: "100%",
    height: height * 0.3,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopStartRadius: 50,
    borderStartEndRadius: 50,
    justifyContent: "space-around",
    paddingLeft: 20,
    paddingTop: 40,
    marginTop: -(height * 0.07),
  },
  titulo: {
    fontWeight: "700",
    fontSize: 24,
    padding: 10,
  },
  desc: {
    padding: 10,
  },
  objetivo: {
    fontWeight: "700",
    fontSize: 20,
    padding: 10,
  },
  objDesc: {
    padding: 10,
  },
});
