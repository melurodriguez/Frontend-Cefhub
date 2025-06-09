import InfoCurso from "../paginas/InfoCurso";
import API_BASE_URL from "../utils/config";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from "react-native";
import api from "../api/axiosInstance";

export default function CardCursoInscripcion({ data, onPress }) {
  const asistenciaPorc = Math.round((data.asistencia.length / 10) * 100); //editar
  const diasTextoACodigo = {
    lunes: "LU",
    martes: "MA",
    miércoles: "MI",
    miercoles: "MI",
    jueves: "JU",
    viernes: "VI",
    sábado: "SA",
    sabado: "SA",
    domingo: "DO"
  };
  const dias = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];


  function obtenerDiasActivos(horario) {
    const diasEnTexto = Object.keys(diasTextoACodigo);
    return diasEnTexto
      .filter(dia => horario.toLowerCase().includes(dia))
      .map(dia => diasTextoACodigo[dia]);
  }

  const diasActivos = obtenerDiasActivos(data.horario);
  const soloHora = data.horario.replace(/^.*?(\d{1,2}:\d{2}.*)$/, '$1');
  async function handleDarseDeBaja() {
    try {
      const response = await api.post(`curso/${data.inscripcion_id}/baja`);
      alert("Te diste de baja exitosamente.");
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
      <Pressable style={styles.card} onPress={onPress}>
        <Text style={[styles.nombre, { textTransform: 'uppercase' }]}>
          {data.nombre_curso}
        </Text>
        <View style={styles.diasContainer}>
          {dias.map((dia, index) => (
            <View
              key={index}
              style={[
                styles.dia,
                diasActivos.includes(dia) && styles.diaActivo,
              ]}
            >
              <Text style={styles.diaTexto}>{dia}</Text>
            </View>
          ))}
          <Text style={styles.horario}>
            {soloHora}
          </Text>
        </View>
        <View style={styles.infoRow}>
                  <Text style={styles.etiqueta}>Fecha inicio: </Text>
                  <Text style={styles.horario}>{data.fecha_inicio} </Text>
        </View>
        <View style={styles.infoRow}>
              <Text style={styles.etiqueta}>Fecha fin: </Text>
              <Text style={styles.horario}>{data.fecha_fin}</Text>
        </View>
        <View style={[styles.infoRow, { marginTop: 10 }]}>
          <Text style={styles.etiqueta}>Asistencia: </Text>
          <Text style={styles.asistenciaTexto}>{asistenciaPorc}%</Text>
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
    },
  nombre: {
    fontSize: 18,
    fontWeight: "700",
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
    fontWeight: "600",
  },
  horarioBox: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  horario: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007B8A",
    marginLeft: 12,
  },
  asistenciaTexto: {
    fontSize: 15,
    fontWeight: "600",
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
    backgroundColor: "#F44336",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 12,
  },

  bajaTexto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

});
