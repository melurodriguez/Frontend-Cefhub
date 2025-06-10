import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import CardSedes from "../components/CardSedes";
import { useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import API_BASE_URL from "../utils/config";
import api from "../api/axiosInstance";
import { colors, fonts, sizes } from "../utils/themes";
import { AuthContext } from "../auth/AuthContext";
import PopUp from "../components/PopUp";

const { height } = Dimensions.get("window");

const cancel = require("../assets/cancel.png");

export default function InfoCurso({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState(null);
  const [sedes, setSedes] = useState([]);
  const { token } = useContext(AuthContext);
  const [isInscripto, setIsInscripto] = useState(false);
  const [visible, setPopUpVisible] = useState(false);

  useEffect(() => {
    api
      .get(`/curso/${id}`)
      .then((res) => setCurso(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setError("403");
        } else if (err.response?.status === 404) {
          setError("404");
        } else if (err.response?.status === 401) {
          setError("401");
        } else {
          setError("unknown");
        }
      });

    api
      .get(`/curso/${id}/sedes`)
      .then((res) => setSedes(res.data))
      .catch((err) => {
        console.error("Error al obtener la sede: ", err.message);
        console.error(err.config?.url);
      });
  }, [id]);

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
      } else if (error === "401") {
        title = "Acceso restringido";
        message = "Debe estar autenticado para ver esta información";
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
              navigation.goBack();
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
    <ScrollView style={styles.container}>
      <View style={styles.infoContainer}>
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
          <Image source={cancel} />
        </Pressable>

        <Text style={styles.titulo}>Curso ID: {curso.idCurso}</Text>

        <Text style={styles.objetivo}>Descripción</Text>
        <Text style={styles.objDesc}>{curso.descripcion}</Text>

        <Text style={styles.objetivo}>Contenidos</Text>
        <Text style={styles.objDesc}>{curso.contenidos}</Text>

        <Text style={styles.objetivo}>Requerimientos</Text>
        <Text style={styles.objDesc}>{curso.requerimientos}</Text>

        <Text style={styles.objetivo}>Duración</Text>
        <Text style={styles.objDesc}>{curso.duracion} horas</Text>

        <Text style={styles.objetivo}>Modalidad</Text>
        <Text style={styles.objDesc}>{curso.modalidad}</Text>

        <Text style={[styles.objetivo, { marginTop: 20 }]}>Sedes Disponibles:</Text>
        {sedes.map((sede, index) => (
          <CardSedes key={index} sede={sede} />
        ))}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
            justifyContent: "space-between",
            marginRight: 20,
          }}
        >
          <Text style={styles.objetivo}>Valor del curso:</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.objetivo}>${curso.precio} ARS</Text>
          </View>
        </View>

        {isInscripto ? (
          <View style={{ alignItems: "flex-end" }}>
            <Pressable
              style={styles.btn}
              onPress={() => navigation.navigate("OfertasCursos", { id: curso.idCurso })}
            >
              <Text style={styles.btnText}>Inscribirme</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ alignItems: "flex-end" }}>
            <Pressable style={styles.btn} onPress={() => setPopUpVisible(true)}>
              <Text style={styles.btnText}>Inscribirme</Text>
            </Pressable>
          </View>
        )}

        <PopUp
          action={`Ya estás inscripto en el curso ${curso.descripcion}`}
          visible={visible}
          onClose={() => setPopUpVisible(false)}
          duration={2000}
        />
      </View>
    </ScrollView>
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
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 30,
    marginTop: -(height * 0.07),
  },
  titulo: {
    fontFamily: "Sora_700Bold",
    fontSize: 26,
    paddingBottom: 10,
    color: "#333",
  },
  objetivo: {
    fontFamily: "Sora_700Bold",
    fontSize: 20,
    padding: 10,
  },
  objDesc: {
    fontSize: 16,
    lineHeight: 22,
    color: "#666",
    paddingHorizontal: 5,
    marginTop: 8,
    fontFamily: "Sora_400Regular",
  },
  btn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: sizes.radius,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  btnText: {
    color: colors.white,
    fontFamily: "Sora_700Bold",
    fontSize: fonts.medium,
    letterSpacing: 0.5,
  },
});
