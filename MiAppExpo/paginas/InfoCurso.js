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
import { AuthContext } from "../auth/AuthContext";
const flyingCat = require("../assets/readingCat.png");
import PopUp from "../components/PopUp";
import PopUpCursos from "../components/PopUpCursos";
import { CommonActions } from '@react-navigation/native';


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
  const [popUpAutenticado,setPopUpAutenticado]=useState(false)
  const [popUpNotFound, setPopUpNotFound]=useState(false)
  const [popUpRestricted,setPopUpRestricted]=useState(false)
  const [popUpError, setPopUpError]=useState(false)

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
          console.log("Error al verificar inscripción:", err.message);
        }
      });
  }, [id, token]);


  useEffect(() => {
    if (error) {
      let title = "";
      let message = "";

      if (error === "403") {
        setPopUpRestricted(true)
      } else if (error === "404") {
        setPopUpNotFound(true)
      } else if (error === "401") {
        setPopUpAutenticado(true)
      } else {
        setPopUpError(true)
      }
    }
  }, [error]);

  if (!curso ) {
    return (
      <>
       
      </>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerWrapper}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image source={cancel} />
          </Pressable>

          <View style={styles.headerContent}>
            <View style={styles.textPriceContainer}>
              <Text style={styles.titulo}>{curso.descripcion}</Text>
              <View style={styles.priceRowTop}>
                {curso.precioOriginal && curso.precioOriginal > curso.precio && (
                  <Text style={styles.priceOriginal}>${curso.precioOriginal} ARS</Text>
                )}
                <Text style={styles.priceOferta}>${curso.precio} ARS</Text>
                <Text style={styles.priceLabelOferta}>OFERTA</Text>
              </View>
            </View>
            <Image
              source={flyingCat}
              style={styles.flyingCatImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Parte inferior: contenido, sedes, botón */}
        <View style={styles.infoContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Temario</Text>
            <Text style={styles.cardText}>{curso.contenidos}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Insumos y Requerimientos</Text>
            <Text style={styles.cardText}>{curso.requerimientos}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Duración</Text>
            <Text style={styles.cardText}>{curso.duracion} semanas</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Modalidad</Text>
            <Text style={styles.cardText}>{curso.modalidad}</Text>
          </View>

          <Text style={styles.sectionTitle}>Sedes Disponibles</Text>
          {sedes.map((sede, index) => (
            <CardSedes key={index} sede={sede} />
          ))}

          <View style={styles.buttonWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                pressed && { opacity: 0.7 },
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
        </View>
      </ScrollView>
    </View>
  );
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    paddingBottom: 40,
  },

  headerWrapper: {
    backgroundColor: "#505c86",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 30,
    paddingTop: 40,
    paddingHorizontal: 20,
    shadowColor: "#2a3b8f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#4a5cbf",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textPriceContainer: {
    flex: 1,
    paddingRight: 10,
  },
  titulo: {
    fontFamily: "Sora_700Bold",
    fontSize: 26,
    color: "#fff",
    marginBottom: 10,
  },
  priceRowTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceOriginal: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    color: "#E65100",
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  priceOferta: {
    fontFamily: "Sora_700Bold",
    fontSize: 28,
    color: "#1E1E1E",
    marginRight: 10,
  },
  priceLabelOferta: {
    fontFamily: "Sora_700Bold",
    fontSize: 14,
    color: "#F9E8DC",
    backgroundColor: "#3f4ca7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: "hidden",
  },
  flyingCatImage: {
    width: 110,
    height: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 7,
  },

  /* ----- PARTE INFERIOR ----- */
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: "#f6f8ff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#4a5cbf",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: "Sora_700Bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#505c86",
  },
  cardText: {
    fontFamily: "Sora_400Regular",
    fontSize: 15,
    color: "#333",
  },
  sectionTitle: {
    fontFamily: "Sora_700Bold",
    fontSize: 22,
    marginVertical: 20,
    color: "#505c86",
  },
  buttonWrapper: {
    marginTop: 20,
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#505c86",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 7,
  },
  btnText: {
    fontFamily: "Sora_700Bold",
    fontSize: 18,
    color: "#fff",
  },
});

