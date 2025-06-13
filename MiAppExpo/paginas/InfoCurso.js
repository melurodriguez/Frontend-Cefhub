import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import CardSedes from "../components/CardSedes";
import { useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Alert } from "react-native";
import { colors, fonts, sizes } from "../utils/themes";
import { AuthContext } from "../auth/AuthContext";
import PopUp from "../components/PopUp";

const { height, width } = Dimensions.get("window");

const cancel = require("../assets/cancel.png");

export default function InfoCurso({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState(null);
  const [sedes, setSedes] = useState([]);
  const { token } = useContext(AuthContext);
  const [isIncripto, setIsInscripto] = useState(false);
  const [visible, setPopUpVisible] = useState(false);

  useEffect(() => {
    api
      .get(`/curso/${id}`)
      .then((res) => setCurso(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setError("403");
        else if (err.response?.status === 404) setError("404");
        else if (err.response?.status === 401) setError("401");
        else setError("unknown");
      });

    api
      .get(`/curso/${id}/sedes`)
      .then((res) => setSedes(res.data))
      .catch((err) => {
        console.error("Error al obtener la sede: ", err.message);
        console.error(err.config?.url);
      });

    api
      .get(`/curso/${id}/inscripcion`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsInscripto(res.data.inscripto);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setIsInscripto(false);
        } else if (err.response?.status === 404) {
          setError("404");
        } else {
          console.error("Error al verificar inscripción:", err.message);
        }
      });
  }, [id, token]);


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

      Alert.alert(title, message, [
        {
          text: "Aceptar",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    }
  }, [error]);

  if (!curso || error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando curso...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.6 },
          ]}
          android_ripple={{ color: "#fff" }}
        >
          <Image source={cancel} style={styles.backIcon} />
        </Pressable>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{curso.descripcion}</Text>
        </View>


      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Temario</Text>
          <Text style={styles.cardText}>{curso.contenidos}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Insumos y Requerimientos</Text>
          <Text style={styles.cardText}>{curso.requerimientos}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Duración </Text>
          <Text style={styles.cardText}>
            {curso.duracion} semanas
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Modalidad</Text>
          <Text style={styles.cardText}>
            {curso.modalidad}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Sedes Disponibles</Text>
        {sedes.map((sede, index) => (
          <CardSedes key={index} sede={sede} />
        ))}

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Valor del curso:</Text>
          <Text style={styles.priceValue}>${curso.precio} ARS</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => {
              if (isIncripto) {
                setPopUpVisible(true);
              } else {
                navigation.navigate("OfertasCursos", { id: curso.idCurso });
              }
            }}
          >
            <Text style={styles.btnText}>
              {isIncripto ? "Ir a Ofertas" : "Inscribirme"}
            </Text>
          </Pressable>


        </View>

        <PopUp
          action={`Ya estás inscripto en el curso `}
          visible={visible}
          onClose={() => setPopUpVisible(false)}
          duration={2000}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || "#f5f5f5" },


  title: {
    fontFamily: "Sora_700Bold",
    fontSize: 28,
    color: colors.primaryDark || "#4A148C",
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: sizes.radius || 15,
    padding: 20,
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontFamily: "Sora_700Bold",
    fontSize: 20,
    marginBottom: 10,
    color: colors.primary || "#6A1B9A",
  },
  cardText: {
    fontFamily: "Sora_400Regular",
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  sectionTitle: {
    fontFamily: "Sora_700Bold",
    fontSize: 22,
    color: colors.primary || "#6A1B9A",
    marginTop: 20,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 25,
    paddingHorizontal: 10,
  },
  priceLabel: {
    fontFamily: "Sora_700Bold",
    fontSize: 18,
    color: "#222",
  },
  priceValue: {
    fontFamily: "Sora_700Bold",
    fontSize: 18,
    color: colors.primary || "#6A1B9A",
  },
  buttonWrapper: {
    alignItems: "flex-end",
    marginBottom: 40,
  },
  btn: {
    backgroundColor: colors.primary || "#6A1B9A",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: sizes.radius || 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    color: colors.white || "#fff",
    fontFamily: "Sora_700Bold",
    fontSize: fonts.medium || 18,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background || "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    fontFamily: "Sora_600SemiBold",
    color: "#666",
  },
});
