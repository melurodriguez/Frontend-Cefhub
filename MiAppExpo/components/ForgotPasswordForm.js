import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import api from "../api/axiosInstance";
import { sizes } from "../utils/themes";
import PopUp from "./PopUp";

const welcomeIcon=require('../assets/welcomeIcon.png')
const detective=require('../assets/detective.png')

export default function ForgotPasswordForm({navigation}) {

  const[email, setEmail]=useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popUpInvalidEmail, setPopUpInvalidEmail]=useState(false);
  const [popUpErrorInesperado, setPopUpErrorInesperado]=useState(false);

  const sendCode= async () =>{
    if (!email) return;
    setIsLoading(true);
    try{
      const res= await api.post('/forgot_password', JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' }
      })
      console.log("codigo enviado")
      navigation.navigate('CodeForgotPassword', {email:email})
    }catch(err){
      if(err.response?.status===404){
        setPopUpInvalidEmail(true)
      }else{
        setPopUpErrorInesperado(true)
      }
      console.error("error al enviar mail/codigo", err.response?.data || err.message || err)
    }finally{
      setIsLoading(false)
    }
  }

  return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Image source={welcomeIcon} style={styles.catImage} />
          <View style={styles.content}>
            <Text style={styles.title}>Ingresá tu Correo</Text>
            <Text style={{ fontFamily: "Sora_400Regular", paddingBottom: 20, marginHorizontal: 20 }}>
              Enviaremos un código de verificación a tu correo.
            </Text>
            <TextInput
              value={email}
              placeholder="Correo"
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Pressable
              style={[styles.button, isLoading && { opacity: 0.6 }]}
              onPress={sendCode}
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Enviar Código</Text>
              )}
            </Pressable>
          </View>
        </View>
        {popUpInvalidEmail && <PopUp action={"Error. \n\nEmail no encontrado."} visible={popUpInvalidEmail} onClose={()=>setPopUpInvalidEmail(false)} duration={2000} image={detective}/>}
        {popUpErrorInesperado && <PopUp action={"Error. \n\nOcurrió un error inesperado."} visible={popUpErrorInesperado} onClose={()=>setPopUpErrorInesperado(false)} duration={2000}/>}
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
    fontFamily:"Sora_700Bold",
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
      fontFamily:"Sora_700Bold", // Arreglado: estaba sin comillas
    },
});
