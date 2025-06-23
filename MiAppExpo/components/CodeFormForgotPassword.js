import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { sizes } from "../utils/themes";
import { useState } from "react";
import api from "../api/axiosInstance";
const welcomeIcon = require("../assets/welcomeIcon.png");

export default function CodeFormForgotPassword({email, navigation }) {

  const[codeDigits, setCodeDigits]=useState(["","","",""])

  const handleChange = (value, index) => {
    const updated = [...codeDigits];
    updated[index] = value;
    setCodeDigits(updated);
  };

  const handleCode = async () => {
    const code = codeDigits.join(""); 
    console.log("Código ingresado:", code);
    if (code.length !== 4) {
      console.log("debe tener 4 digitos")
      return
    }

    try{
      const res= await api.post("/forgot-password-code-verification", {email: email, code:code})
      console.log("Respuesta del backend:", res);
      navigation.navigate("ResetPassword", {email: email});
    }catch(err){
      console.log("Error en el envio del codigo: ", err)
    }
  };

  return (
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.img}/>
        <View style={styles.content}>
          <Text style={styles.title}>Ingresá tu código</Text>
          <Text style={{fontFamily:'Sora_400Regular',}}>Se ha enviado un código a tu correo</Text>

          <View style={styles.inputContainer}>
            {codeDigits.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
              value={digit}
              onChangeText={(value) => handleChange(value.slice(-1), index)}
              keyboardType="numeric"
              maxLength={1}
            />
            ))}
          </View>

          <Pressable
            style={styles.button}
            onPress={() => {
              handleCode();
            }}
          >
            <Text style={styles.btnText}>Verificar</Text>
          </Pressable>
        </View>
      </View>

  );
}

const styles = StyleSheet.create({
  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#fff",
    borderRadius:15,
    width: sizes.width * 0.8,
    height: sizes.height * 0.45,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  img:{
    width: 132,
    height: 133,
    position: "absolute",
    top: -90, // la mitad de la altura para que sobresalga
    alignSelf: "center",
    zIndex: 1,
  },
  title: {
    fontFamily:'Sora_700Bold',
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
    fontFamily:'Sora_700Bold',
    fontSize: 20,
  },
});
