import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { sizes } from "../utils/themes";
import { useState, useRef } from "react";
import api from "../api/axiosInstance";
import PopUp from "./PopUp";
const welcomeIcon = require("../assets/welcomeIcon.png");


export default function CodeForm({email, navigation }) {

  const[codeDigits, setCodeDigits]=useState(["","","",""])
  const inputRefs = useRef([]);
  const [popUpIncorrecto, setPopUpIncorrecto]=useState(false)
  const [popUpInesperado, setPopUpInesperado]=useState(false)
  const [popUpServidor, setPopUpServidor]=useState(false) 

  const handleChange = (value, index) => {
    const newDigits = [...codeDigits];

    if (value.length === 4) {
      const split = value.split("");
      setCodeDigits(split);
      split.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].setNativeProps({ text: digit });
        }
      });
      return;
    }

    newDigits[index] = value.slice(-1);
    setCodeDigits(newDigits);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };


  const handleCode = async () => {
    const code = codeDigits.join(""); 
    console.log("Código ingresado:", code);
    if (code.length !== 4) {
      console.log("debe tener 4 digitos")
      return
    }

    try{
      const res= await api.post("/register/code-verification", {email: email, code:code})
      console.log("Respuesta del backend:", res);
      navigation.navigate("ThirdStepRegister", {email: email});
    }catch(err){
      if (err.response) {
        if (err.response.status === 403) {
          setPopUpIncorrecto(true)
          //Alert.alert("Codigo Incorrecto", "Verifica tu mail.");
        } else {
          setPopUpInesperado(true)
          //Alert.alert("Error", err.response.data?.detail || "Ocurrió un error inesperado.");
        }
      } else {
        setPopUpServidor(true)
        //Alert.alert("Error", "No se pudo conectar con el servidor.");
      }
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
                ref={(el) => (inputRefs.current[index] = el)}
                style={styles.input}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                keyboardType="numeric"
                maxLength={4}
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
        {popUpIncorrecto && <PopUp action={"Codigo ingresado incorrecto"} visible={popUpIncorrecto} onClose={()=>setPopUpIncorrecto
          (false)} duration={1500}/>}
        {popUpInesperado && <PopUp action={"Ocurrió un error inesperado"} visible={popUpInesperado} onClose={()=>setPopUpInesperado(false)} duration={1500}/>}
        {popUpServidor && <PopUp action={"No se pudo conectar con el servidor."} visible={popUpServidor} onClose={()=>setPopUpServidor(false)} duration={1500}/>}
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
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
