import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

const welcomeIcon = require("../assets/welcomeIcon.png");

export default function CodeForm({ navigation }) {
  function sendData() {
    console.log("sent");
    navigation.navigate("ThirdStepRegister");
  }
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={welcomeIcon} />
        <View style={styles.content}>
          <Text style={styles.title}>Ingresá tu código</Text>
          <Text>Se ha enviado un código a tu correo</Text>

          <View style={styles.inputContainer}>
            <TextInput style={styles.input}></TextInput>
            <TextInput style={styles.input}></TextInput>
            <TextInput style={styles.input}></TextInput>
            <TextInput style={styles.input}></TextInput>
          </View>

          <Pressable
            style={styles.button}
            onPress={() => {
              sendData();
            }}
          >
            <Text style={styles.btnText}>Verificar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 24,
    padding: 10,
  },
  text: {
    fontSize: 16,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 20,
  },
  input: {
    width: 53,
    height: 63,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    //paddingHorizontal: 10,
    borderRadius: 15,
    margin: 10,
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
