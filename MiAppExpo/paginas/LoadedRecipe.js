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
    fontSize: 24,
    fontFamily:"Sora_700Bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
    textAlign: "center",
    fontFamily:"Sora_700Bold"
  },
  image: {
    width: 145,
    height: 145,
    marginBottom: 24,
    marginTop:24
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 10,
    color: "#444",
    fontFamily:"Sora_400Regular"
  },
  button: {
    backgroundColor: "#505C86",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontFamily:"Sora_700Bold",
    fontSize: 16,
  },
});