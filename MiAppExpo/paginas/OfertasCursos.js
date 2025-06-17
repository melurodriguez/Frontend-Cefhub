import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, Button, TouchableOpacity , Pressable, Image} from "react-native";
import { useRoute } from "@react-navigation/native";
import api from "../api/axiosInstance";
import { colors } from "../utils/themes";

import PopUp from "../components/PopUp";
const cancel = require("../assets/cancel.png");

export default function OfertasCursos({ navigation }) {
  const route = useRoute();
  const { id } = route.params;

  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popUpVisible, setPopUpVisible] = useState(false);


  useEffect(() => {
    console.log("curso id", id);
    api
      .get(`/curso/${id}/ofertas`)
      .then((res) => {
        setOfertas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 404) {
          setError("No se encontraron ofertas.");
        } else {
          setError("Ocurrió un error al obtener las ofertas.");
        }
      });
  }, []);

  const onInscribirse = async (oferta) => {
    try {
      const res = await api.post(`/curso/${oferta}/alta`);
      setPopUpVisible(true)
    } catch (error) {
      if (error.response?.status === 403) {
        Alert.alert("Error", "Solo los alumnos pueden inscribirse a cursos");
      } else if (error.response?.status === 409) {
        Alert.alert("Ya estás inscripto", "No podés inscribirte dos veces al mismo curso");
      } else {
        Alert.alert("Error", "Ocurrió un error al intentar inscribirte");
      }
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
      <ScrollView style={styles.container}>
        <View>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image source={cancel} />
          </Pressable>
        </View>
        <Text style={styles.titulo}>Ofertas disponibles para este curso</Text>
        {ofertas.map((oferta, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.sedeNombre}>{oferta.nombreSede}</Text>
            <Text style={styles.detalle}>Dirección: {oferta.direccionSede}</Text>
            <Text style={styles.detalle}>Fechas: {oferta.fechaInicio} → {oferta.fechaFin}</Text>
            <Text style={styles.detalle}>Vacantes disponibles: {oferta.vacantesDisponibles}</Text>

            {oferta.bonificacionCursos > 0 && (
              <Text style={styles.promocion}>🔥{oferta.tipoPromocion}  ¡{oferta.bonificacionCursos }% de descuento disponible !</Text>
            )}

            <View style={styles.precios}>
              <Text style={styles.precioOriginal}>Precio original: ${oferta.precio} ARS</Text>
              {oferta.bonificacionCursos > 0 && (
                <Text style={styles.precioFinal}>
                  Precio final: ${oferta.precio - oferta.precio * (oferta.bonificacionCursos / 100)} ARS
                </Text>

              )}
            </View>

            <TouchableOpacity
              style={styles.boton}
              onPress={() => onInscribirse(oferta.idCronograma)}
            >
              <Text style={styles.botonTexto}>Inscribirse</Text>
            </TouchableOpacity>

            <PopUp
              action={ "Te inscribiste correctamente al curso 🎉"}
              visible={popUpVisible}
              onClose={() => setPopUpVisible(false)}
              duration={2000}
            />

          </View>
        ))}
      </ScrollView>
    );

}

const styles = StyleSheet.create({
  container: {
    padding: 16,

    backgroundColor: "#f4f6f8",
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontFamily:'Sora_700Bold',
    color: "#333",
    marginBottom: 20,
    marginTop:30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sedeNombre: {
    fontSize: 20,
    fontFamily:'Sora_700Bold',
    color: "#2c3e50",
    marginBottom: 8,
  },
  detalle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
    fontFamily:'Sora_400Regular',
  },
  promocion: {
    fontSize: 16,
    color: "#d32f2f",
    fontFamily:'Sora_600SemiBold',
    marginTop: 10,
    marginBottom: 6,
  },
  precios: {
    marginTop: 10,
  },
  precioOriginal: {
    textDecorationLine: "line-through",
    color: "#888",
    fontSize: 14,
  },
  precioFinal: {
    fontSize: 18,
    color: "#388e3c",
    fontFamily:'Sora_700Bold',
    marginTop: 4,
  },
  boton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 12,
      alignItems: "center",
    },
    botonTexto: {
      color: "#fff",
      fontFamily:'Sora_700Bold',
      fontSize: 16,
    },
  popUp:{
    backgroundColor:"#f4f6f8"
  },
  popUpText:{ fontFamily:'Sora_700Bold',}
});

