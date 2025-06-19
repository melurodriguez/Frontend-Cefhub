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
import api from "../api/axiosInstance";

const welcomeIcon=require('../assets/welcomeIcon.png')

export default function CardCreatePassword({ email, navigation }) {

const [form, setForm]=useState({
  contrasenia:"",
  contrasenia_repetida:""
})

const handleChange=(name, value)=>{
  setForm((prev) => ({ ...prev, [name]: value }));
}

const handleThirdStep=async()=>{

  if (form.contrasenia !== form.contrasenia_repetida){
    console.log("Las contraseñas no coinciden")
    return
  }

  try{
    const res= await api.post("/register/create-password", {password: form.contrasenia, email:email})
    console.log("Respuesta del backend:", res)
    navigation.navigate("FourthStepRegister", {email:email, password:form.contrasenia})
  }catch(err){
    console.log("Error al crear contraseña: ", err)
  }
  
}
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.catImage} />
        <View style={styles.content}>
          <Text style={styles.title}>Registrarme</Text>
          <TextInput
            value={form.contrasenia}
            placeholder="Contraseña"
            onChangeText={(value) => handleChange("contrasenia", value)}
            style={styles.input}
          />
          <TextInput
            value={form.constrasenia_repetida}
            placeholder="Repeti tu contraseña"
            onChangeText={(value) => handleChange("contrasenia_repetida",value)}
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleThirdStep}>
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
    fontFamily:'Sora_700Bold',
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
    fontFamily:'Sora_700Bold',
    fontSize: 20,
  },
});
