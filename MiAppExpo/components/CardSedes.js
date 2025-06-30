import Checkbox from "expo-checkbox";
import { StyleSheet, View, Text , Linking, TouchableOpacity} from "react-native";
import { useState } from "react";
import { RadioButton } from "react-native-paper";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function CardSedes({ sede }) {
  const [pressed, setPressed] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  function handlePress(id) {
    setPressed(!pressed);
    setSelectedId(id);
  }

  return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.nombre}>{sede.nombreSede}</Text>
          <Text style={styles.direccion}>{sede.direccionSede}</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={20} color="#333" />
            <Text style={styles.infoText}>{sede.telefonoSede}</Text>
          </View>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => Linking.openURL(`mailto:${sede.mailSede}`)}
          >
            <MaterialIcons name="email" size={20} color="#333" />
            <Text style={[styles.infoText, styles.link]}>{sede.mailSede}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => Linking.openURL(`https://wa.me/${sede.whatsApp}`)}
          >
            <FontAwesome name="whatsapp" size={20} color="#25D366" />
            <Text style={[styles.infoText, styles.link]}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFF2E5",
      borderRadius: 15,
      marginTop: 15,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    textContainer: {
      flexShrink: 1,
    },
    nombre: {
      fontFamily: 'Sora_700Bold',
      fontSize: 22,
      marginBottom: 4,
      color: "#333",
    },
    direccion: {
      fontFamily: 'Sora_400Regular',
      fontSize: 16,
      color: "#555",
      marginBottom: 10,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    infoText: {
      fontFamily: 'Sora_400Regular',
      fontSize: 16,
      marginLeft: 8,
      color: "#333",
    },
    link: {
      color: "#1E90FF",
      textDecorationLine: "underline",
    },
  });
