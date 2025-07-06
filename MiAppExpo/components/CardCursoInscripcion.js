import { View, Text, StyleSheet, Pressable } from "react-native";
import api from "../api/axiosInstance";
import { colors } from "../utils/themes";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


export default function CardCursoInscripcion({ data, onPress, onPopUp }) {
  const asistenciaPorc = Math.round((data.totalAsistencias / data.duracion )* 100);

  async function handleDarseDeBaja() {
    try {
      const response = await api.post(`curso/${data.idCronograma}/baja?precioAbonado=${data.precioFinal}`);
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
        <Pressable style={styles.card} onPress={onPress}>
          <Text style={[styles.nombre, { textTransform: 'uppercase' }]}>
            {data.nombreCurso}
          </Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={18} color="#555" />
            <Text style={styles.etiqueta}> Sede: </Text>
            <Text style={styles.horario}>{data.nombreSede}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="event-available" size={18} color="#555" />
            <Text style={styles.etiqueta}> Fecha inicio: </Text>
            <Text style={styles.horario}>{data.fechaInicio}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="event-busy" size={18} color="#555" />
            <Text style={styles.etiqueta}> Fecha fin: </Text>
            <Text style={styles.horario}>{data.fechaFin}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={18} color="#555" />
            <Text style={styles.etiqueta}> Duración: </Text>
            <Text style={styles.horario}>{data.duracion} clases</Text>
          </View>

          <View style={styles.separador} />

          <View style={styles.infoRow}>
            <Text style={styles.etiqueta}> Precio base:</Text>
            <Text style={styles.precioBase}> ${data.precioBase} ARS</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.etiqueta}> Precio abonado:</Text>
            <Text style={styles.precioFinal}> ${data.precioFinal.toFixed(2)} ARS</Text>
          </View>

          <View style={styles.separador} />

          <View style={[styles.infoRow, { marginTop: 10 }]}>
            <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.etiqueta}> Asistencia: </Text>
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
    backgroundColor: "#FFF8F0",
    marginVertical: 12,
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFE0C1",
    width: 340,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  nombre: {
    fontSize: 20,
    fontFamily: "Sora_700Bold",
    color: "#333",
    marginBottom: 16,
    marginTop: 6,
    textAlign: "center",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  etiqueta: {
    fontSize: 15,
    color: "#444",
    fontFamily: "Sora_600SemiBold",
    marginLeft: 8,
  },

  horario: {
    fontSize: 15,
    fontFamily: "Sora_600SemiBold",
    color: "#007B8A",
    marginLeft: 4,
  },

  asistenciaTexto: {
    fontSize: 15,
    fontFamily: "Sora_600SemiBold",
    color: "#4CAF50",
    marginLeft: 4,
  },

  barraAsistencia: {
    backgroundColor: "#E0E0E0",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 8,
  },

  barraProgreso: {
    backgroundColor: "#4CAF50",
    height: 10,
  },

  bajaBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignSelf: "center",
    marginTop: 16,
  },

  bajaTexto: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Sora_600SemiBold",
  },

  precioBase: {
    fontSize: 14,
    color: "#A0A0A0",
    fontFamily: "Sora_400Regular",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },

  precioFinal: {
    fontSize: 15,
    color: "#D32F2F",
    fontFamily: "Sora_700Bold",
    marginLeft: 6,
  },

  separador: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 10,
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
    fontFamily: "Sora_400Regular",
  },
});

