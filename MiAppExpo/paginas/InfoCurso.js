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
import axios from "axios";

const { height } = Dimensions.get("window"); //CAMBIAR

const cancel = require("../assets/cancel.png");
const pasteleria = require("../assets/pasteleriaCurso.png");

export default function InfoCurso({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  console.log(id);
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/curso/${id}`)
      .then((res) => setCurso(res.data))
      .catch((err) => console.error(err));
  }, []);

  const sedes = [
    {
      id: 1,
      sede: "Sede Montserrat",
      direccion: {
        calle: "Lima",
        altura: "707",
      },
      telefono: "11111111",
      correo: "ejemplo@gmail.com",
    },
    {
      id: 2,
      sede: "Sede Montserrat",
      direccion: {
        calle: "Lima",
        altura: "707",
      },
      telefono: "11111111",
      correo: "ejemplo@gmail.com",
    },
    {
      id: 3,
      sede: "Sede Montserrat",
      direccion: {
        calle: "Lima",
        altura: "707",
      },
      telefono: "11111111",
      correo: "ejemplo@gmail.com",
    },
  ];

  if (!curso) {
    return (
      <Text
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "700",
        }}
      >
        Cargando receta...
      </Text>
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

        {sedes.map((sede, index) => (
          <CardSedes key={sede.id} sede={sede} />
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
