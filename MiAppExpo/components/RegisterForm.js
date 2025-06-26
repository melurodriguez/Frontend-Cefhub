import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { colors, sizes } from "../utils/themes";
import API_BASE_URL from "../utils/config";
import api from "../api/axiosInstance";

const welcomeIcon = require("../assets/welcomeIcon.png");

export default function RegisterForm({ navigation }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const[aliasSugeridos, setAliasSugeridos]=useState([])

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFirstStep = async () => {

    try {
      const res = await api.post("/register/first-step", {username: form.username, email:form.email});
      console.log("Respuesta del backend:", res);
      navigation.navigate("SecondStepRegister", {email:form.email});
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          Alert.alert("Alias en uso", "El alias ya está registrado. Por favor, elegí otro.");
          const sugerencias = await generarSugerenciasAlias(form.username);
          setAliasSugeridos(sugerencias);
        } else {
          Alert.alert("Error", err.response.data?.detail || "Ocurrió un error inesperado.");
        }
      } else {
        Alert.alert("Error", "No se pudo conectar con el servidor.");
      }
    }
  };

  const generarSugerenciasAlias= async(base)=>{
    const sufijos = [
      Math.floor(Math.random() * 100),
      new Date().getFullYear(),
      Math.floor(Math.random() * 9000 + 1000),
      "_dev",
      "_x",
      "_ok"
    ];

    
    const posibles= sufijos.map(sufijo => `${base}${sufijo}`);

    const sugerencias = await Promise.all(
        posibles.map(async (alias) => {
          try {
            const res = await api.get(`/alias-sugerido?alias=${alias}`);
            return res.data.disponible ? alias : null;
          } catch (err) {
            console.error(`Error al verificar alias: ${alias}`, err);
            return null;
          }
        })
    )
    console.log(sugerencias.filter(Boolean).slice(0,5))
    return sugerencias.filter(Boolean).slice(0, 5);

  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.catImage} />
        <View style={styles.content}>
          <Text style={styles.title}>Registrarme</Text>
          <TextInput
            value={form.email}
            placeholder="Correo"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(value) => handleChange("email", value)}
            style={styles.input}
          />
          
          <TextInput
            value={form.username}
            placeholder="Nombre de Usuario"
            onChangeText={(value) => handleChange("username", value)}
            style={styles.input}
          />
          {aliasSugeridos.length > 0 && 
          <View>
            <Text style={styles.sugerenciasTitle}>Sugerencias:</Text>
            {aliasSugeridos.map((alias, index) => (
              <Text key={index} style={styles.sugerencias}>{alias}</Text>
            ))}
          </View>
          }
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
    paddingVertical: 20,
    minHeight: sizes.height * 0.45,
  },
  catImage: {
    width: 132,
    height: 133,
    position: "absolute",
    top: -90,
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
  sugerenciasTitle:{
    fontFamily:"Sora_700Bold",
    color:colors.primary,
    fontSize:18,
    alignSelf:"center"
  },
  sugerencias:{
    fontFamily:"Sora_700Bold",
    fontSize:14,
    alignSelf:"center"
  }
});
