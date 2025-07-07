import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { sizes } from "../utils/themes";
import api from "../api/axiosInstance";
import { useState } from "react";

const welcomeIcon = require("../assets/welcomeIcon.png");
export default function TipoUsuarioForm({navigation, email, password}) {


    const handleTipoUsuario=async (tipoUsuario)=>{
      if(tipoUsuario === "usuario"){
        navigation.navigate("LoginPage")
      }else{
        navigation.navigate("RegistroAlumnoScreen", {email: email})
      }
    }

    return(
        <View style={styles.form}>
            <Image source={welcomeIcon} style={styles.img}/>
            <Text style={styles.title}>¿Cómo continuar?</Text>
            <Pressable style={styles.button} onPress={()=>handleTipoUsuario("usuario")}><Text style={styles.btnText}>Usuario</Text></Pressable>
            <Pressable style={styles.button} onPress={()=>handleTipoUsuario("alumno")}><Text style={styles.btnText}>Alumno</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#fff",
    borderRadius:15,
    width: sizes.width * 0.8,
    height: sizes.height * 0.45,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
    paddingBottom: 10,

  },
  text: {
    fontSize: 16,
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
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontFamily:'Sora_700Bold',
    fontSize: 20,
  },
});
