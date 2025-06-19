import InfoCurso from "../paginas/InfoCurso";
import API_BASE_URL from "../utils/config";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from "react-native";
import api from "../api/axiosInstance";
import { colors } from "../utils/themes";


export default function CardCursoInscripcion({ data, onPress, onPopUp }) {
  const asistenciaPorc = Math.round((data.totalAsistencias / data.duracion )* 100);
  async function handleDarseDeBaja() {
    try {
      const response = await api.post(`curso/${data.idCronograma}/baja`);
      onPopUp("Has sido dado/a de baja del curso");
      //console.log("pop up")
      await onPress()
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.detail}`);
      } else {
        alert("Ocurrió un error al intentar darte de baja.");
      }
      console.error(error);
    }
  }

  return (
    <>

      <Pressable style={styles.card} onPress={onPress}>
        <Text style={[styles.nombre, { textTransform: 'uppercase' }]}>
          {data.nombreCurso}
        </Text>
        <View style={styles.infoRow}>
                  <Text style={styles.etiqueta}>Sede: </Text>
                  <Text style={styles.horario}>{data.nombreSede} </Text>
        </View>
        <View style={styles.infoRow}>
                  <Text style={styles.etiqueta}>Duracion : </Text>
                  <Text style={styles.horario}>{data.duracion} clases</Text>
        </View>
        <View style={styles.infoRow}>
                  <Text style={styles.etiqueta}>Fecha inicio: </Text>
                  <Text style={styles.horario}>{data.fechaInicio} </Text>
        </View>
        <View style={styles.infoRow}>
              <Text style={styles.etiqueta}>Fecha fin: </Text>
              <Text style={styles.horario}>{data.fechaFin}</Text>
        </View>
        <View style={[styles.infoRow, { marginTop: 10 }]}>
          <Text style={styles.etiqueta}>Asistencia: </Text>
          <Text style={styles.asistenciaTexto}> {asistenciaPorc} %</Text>
        </View>

        <View style={styles.barraAsistencia}>
          <View
            style={[
              styles.barraProgreso,
              { width: `${asistenciaPorc}%` }
            ]}
          />
        </View>
        <Pressable style={styles.bajaBtn} onPress={handleDarseDeBaja}>
          <Text style={styles.bajaTexto}>Darse de baja</Text>
        </Pressable>


      </Pressable>
      
      
    </>
      
    );

}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF2E5",
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    borderColor:"#000",
    width: 340,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignSelf: "center",
  },
   diasContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      gap: 4,
      flexWrap: "wrap",
    },
    dia: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#111",
      justifyContent: "center",
      alignItems: "center",
    },
    diaActivo: {
      backgroundColor: "#B0D9E7",
    },
    diaTexto: {
      color: "#fff",
      fontSize: 12,
      fontFamily:"Sora_400Regular"
    },
  nombre: {
    fontSize: 18,
    fontFamily:"Sora_700Bold",
    color: "#333333",
    marginBottom: 14,
    marginTop:10,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  etiqueta: {
    fontSize: 15,
    color: "#555",
    fontFamily:"Sora_600SemiBold",},
  horarioBox: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  horario: {
    fontSize: 15,
    fontFamily:"Sora_600SemiBold",
    color: "#007B8A",
    marginLeft: 12,
  },
  asistenciaTexto: {
    fontSize: 15,
    fontFamily:"Sora_600SemiBold",
    color: "#4CAF50",
  },
  barraAsistencia: {
    backgroundColor: "#E0E0E0",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 15,
  },
  barraProgreso: {
    backgroundColor: "#4CAF50",
    height: 10,
  },
  bajaBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 12,
  },

  bajaTexto: {
    color: "#fff",
    fontSize: 14,
    fontFamily:"Sora_600SemiBold",
  },

});
