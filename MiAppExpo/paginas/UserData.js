import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
const flyingCat = require("../assets/flyingCat.png");

export default function UserData() {
  const { user } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image source={flyingCat} style={styles.image} />

        <Text style={styles.title}>Mis Datos</Text>
      

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={22} color="#5C6BC0" style={styles.icon} />
          <View>
            <Text style={styles.label}>Nombre de Usuario</Text>
            <Text style={styles.value}>{user.nickname}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={22} color="#5C6BC0" style={styles.icon} />
          <View>
            <Text style={styles.label}>Email Registrado</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="ribbon-outline" size={22} color="#5C6BC0" style={styles.icon} />
          <View>
            <Text style={styles.label}>Tipo de Usuario</Text>
            <Text style={styles.value}>{user.tipo_usuario}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FAFAFA",
    flexGrow: 1,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontFamily:"Sora_700Bold",
    color: "#333",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    fontFamily:"Sora_400Regular"
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
    fontFamily:"Sora_400Regular"
  },

});
