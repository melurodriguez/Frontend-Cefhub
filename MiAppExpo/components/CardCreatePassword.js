import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { sizes } from "../utils/themes";
import API_BASE_URL from "../utils/config";

export default function CardCreatePassword({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.catImage} />
        <View style={styles.content}>
          <Text style={styles.title}>Registrarme</Text>
          <TextInput
            value={form.email}
            placeholder="Correo"
            onChangeText={(value) => handleChange("email", value)}
            style={styles.input}
          />
          <TextInput
            value={form.username}
            placeholder="Nombre de Usuario"
            onChangeText={(value) => handleChange("username", value)}
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleFirstStep}>
            <Text style={styles.btnText}>Registarme</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: sizes.height * 0.5,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    width: sizes.width * 0.8,
    height: sizes.height * 0.45,
  },
  catImage: {
    width: 132,
    height: 133,
    position: "absolute",
    top: -90, // la mitad de la altura para que sobresalga
    alignSelf: "center",
    zIndex: 1,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 24,
    padding: 20,
  },
  input: {
    width: 277,
    height: 50,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "#f1f5f5",
  },
  button: {
    backgroundColor: "#505c86",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: 277,
    height: 50,
    margin: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
  },
});
