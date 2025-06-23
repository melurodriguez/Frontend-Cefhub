import { View, Image, Pressable, Text, StyleSheet  } from "react-native";

const flyingCat = require("../assets/flyingCat.png");

export default function LoadedRecipe({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Listo!</Text>
      <Text style={styles.subtitle}>
        La solicitud de tu receta ha sido enviada.
      </Text>
      <Image source={flyingCat} style={styles.image} />
      <Text style={styles.message}>
        Te enviaremos una notificación con su estado de aprobación a la brevedad.
      </Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Menú")}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF9F0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    color: "#555",
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 10,
    color: "#444",
  },
  button: {
    backgroundColor: "#505C86",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});