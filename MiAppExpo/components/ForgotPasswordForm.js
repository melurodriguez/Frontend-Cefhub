import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import api from "../api/axiosInstance";
import { sizes } from "../utils/themes";

const welcomeIcon=require('../assets/welcomeIcon.png')

export default function ForgotPasswordForm({navigation}) {

  const[email, setEmail]=useState("")

  const sendCode= async () =>{

    try{
      const res= await api.post('/forgot_password', JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' }
    })
      console.log("codigo enviado")
      navigation.navigate('CodeForgotPassword', {email:email})
    }catch(err){
      console.error("error al enviar mail/codigo", err.response?.data || err.message || err)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.catImage} />
        <View style={styles.content}>
          <Text style={styles.title}>Ingresa tu Correo</Text>
          <Text style={{fontFamily:"Sora_400Regular", paddingBottom:20}}>Enviaremos un código de verificacion a tu correo.</Text>
          <TextInput
            value={email}
            placeholder="Correo"
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Pressable style={styles.button} onPress={sendCode}>
            <Text style={styles.btnText}>Enviar Código</Text>
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
    height: sizes.height * 0.5,
    width:sizes.width*0.8
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
