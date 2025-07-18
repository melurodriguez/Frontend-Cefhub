import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput, StyleSheet } from "react-native";
import api from "../api/axiosInstance"; // ajusta la ruta si es necesario
import { colors, fonts } from "../utils/themes";
import PopUp from './PopUp';

const check=require('../assets/check.png')
export default function CalificarReceta({ idReceta, token, onCalificacionExitosa }) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [popUpInvalidInput, setPopUpInvalidInput]=useState(false)
  const [popUpExito, setPopUpExito]=useState(false)
  const [popUpError, setPopUpError]=useState(false)
 
  const enviarCalificacion = async () => {
    if (rating === 0) {
      setPopUpInvalidInput(true)
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        `/recetas/${idReceta}/calificar`,
        { calificacion: rating, comentarios: comentario },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPopUpExito(true)
      setRating(0);
      setComentario("");
      if (onCalificacionExitosa) onCalificacionExitosa();
    } catch (error) {
      console.log(error);
      setPopUpError(true)
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calificá la receta</Text>

      <View style={styles.estrellasContainer}>
        {[...Array(5)].map((_, i) => {
          const starFilled = i < rating;
          return (
            <Pressable
              key={i}
              style={styles.estrella}
              onPress={() => setRating(i + 1)}
            >
              <Image
                source={
                  starFilled
                    ? require("../assets/star.png")
                    : require("../assets/emptyStar.png")
                }
                style={styles.estrellaImg}
              />
            </Pressable>
          );
        })}
      </View>

      <TextInput
        placeholder="Dejá tu comentario..."
        value={comentario}
        onChangeText={setComentario}
        multiline
        style={styles.comentario}
      />

      <Pressable
        onPress={enviarCalificacion}
        style={[
          styles.btnEnviar,
          {
            backgroundColor:
              rating === 0 || loading ? "#ccc" : colors.primary,
          },
        ]}
        disabled={rating === 0 || loading}
      >
        <Text style={styles.btnEnviarTexto}>
          {loading ? "Enviando..." : "Enviar"}
        </Text>
      </Pressable>
      {popUpInvalidInput && <PopUp action={"Error. \n\nPor favor, seleccioná una calificación."} visible={popUpInvalidInput} onClose={()=>setPopUpInvalidInput(false)} duration={2000}/>}
      {popUpExito && <PopUp action={"Su calificaión ha sido enviada"} visible={popUpExito} onClose={()=>setPopUpExito(false)} duration={2000} image={check}/>}
      {popUpError && <PopUp action={"Error. \n\nOcurrió un error inesperado"} visible={popUpError} onClose={()=>setPopUpError(false)} duration={2000}/>}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f5f5",
    padding: 20,
    marginRight: 10,
    marginTop: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  titulo: {
    fontFamily:"Sora_700Bold",
    fontSize: fonts.medium,
    marginBottom: 15,
    fontFamily: "Sora_700Bold",
    textAlign: "center",
  },
  estrellasContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  estrella: {
    paddingHorizontal: 5,
  },
  estrellaImg: {
    width: 30,
    height: 30,
  },
  comentario: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    minHeight: 80,
    padding: 12,
    fontFamily: "Sora_400Regular",
    textAlignVertical: "top",
    marginTop: 15,
    marginBottom: 10,
  },
  btnEnviar: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  btnEnviarTexto: {
    color: "white",
    fontFamily: "Sora_700Bold",
    fontSize: 16,
  },
});

