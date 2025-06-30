import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { sizes } from "../utils/themes";
import API_BASE_URL from "../utils/config";
import api from "../api/axiosInstance";
import PopUp from "./PopUp";

const welcomeIcon=require('../assets/welcomeIcon.png')

export default function CardCreatePassword({ email, navigation }) {

    const [form, setForm]=useState({
      contrasenia:"",
      contrasenia_repetida:""
    })
    const [popUpInvalida, setPopUpInvalida]=useState(false)
    const [popUpCoincidencia, setPopUpCoincidencia]=useState(false)
    const [popUpInesperado, setPopUpInesperado]= useState(false)

    const handleChange=(name, value)=>{
      setForm((prev) => ({ ...prev, [name]: value }));
    }



    // Reglas de validación
  const passwordRules = [
    { label: "Mínimo 8 caracteres", test: (pw) => pw.length >= 8 },
    { label: "Al menos una mayúscula", test: (pw) => /[A-Z]/.test(pw) },
    { label: "Al menos una minúscula", test: (pw) => /[a-z]/.test(pw) },
    { label: "Al menos un número", test: (pw) => /[0-9]/.test(pw) },
    { label: "Al menos un caracter especial", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
  ];

  // Si todas las reglas pasan
  const esContraseniaValida = passwordRules.every(({ test }) => test(form.contrasenia));
  // Las dos contraseñas coinciden
  const coincidenContrasenias = form.contrasenia === form.contrasenia_repetida && form.contrasenia !== "";

  const handleThirdStep = async () => {
    if (!esContraseniaValida) {
      setPopUpInvalida(true)
      //Alert.alert("Contraseña inválida", "Tu contraseña no cumple con los requisitos mínimos.");
      return;
    }
    if (!coincidenContrasenias) {
      setPopUpCoincidencia(true)
      //Alert.alert("Contraseña inválida", "Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await api.post("/register/create-password", {
        password: form.contrasenia,
        email: email,
      });
      console.log("Respuesta del backend:", res.data);

      const hashedPassword = res.data.hashed_password;

      navigation.navigate("FourthStepRegister", {
        email: email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log("Error al crear contraseña: ", err);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.catImage} />
        <View style={styles.content}>
          <Text style={styles.title}>Crear contraseña</Text>

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={form.contrasenia}
            placeholder="Contraseña"
            onChangeText={(value) => handleChange("contrasenia", value)}
            style={styles.input}
            secureTextEntry
          />

          <Text style={styles.label}>Repetí tu contraseña</Text>
          <TextInput
            value={form.contrasenia_repetida}
            placeholder="Repetí tu contraseña"
            onChangeText={(value) => handleChange("contrasenia_repetida", value)}
            style={styles.input}
            secureTextEntry
          />
          {/* Checklist validación */}
            <View style={{ alignSelf: "flex-start", marginLeft: 15, marginBottom: 10 }}>
              {passwordRules.map(({ label, test }, i) => (
                <Text
                  key={i}
                  style={{ color: test(form.contrasenia) ? "green" : "red", fontSize: 12, marginVertical: 2 }}
                >
                  {test(form.contrasenia) ? "✓ " : "✗ "} {label}
                </Text>
              ))}
            </View>
          {!coincidenContrasenias && form.contrasenia_repetida.length > 0 && (
            <Text style={{ color: "red", alignSelf: "flex-start", marginLeft: 15, marginBottom: 10 }}>
              Las contraseñas no coinciden
            </Text>
          )}

          <Pressable
            style={[styles.button, !(esContraseniaValida && coincidenContrasenias) && { backgroundColor: "#aaa" }]}
            onPress={handleThirdStep}
            disabled={!(esContraseniaValida && coincidenContrasenias)}
          >
            <Text style={styles.btnText}>Registrarme</Text>
          </Pressable>
        </View>
      </View>
      {popUpInvalida && <PopUp action={"Tu contraseña no cumple con los requisitos mínimos."} visible={popUpInvalida} onClose={()=>setPopUpInvalida(false)} duration={3000}/>}
      {popUpCoincidencia && <PopUp action={"Contraseña inválida. Las contraseñas no coinciden"} visible={popUpCoincidencia} onClose={()=>setPopUpCoincidencia(false)} duration={3000}/>}
      {popUpInesperado && <PopUp action={"Error. Ocurrió un error inesperado"} visible={popUpInesperado} onClose={()=>setPopUpInesperado(false)} duration={1500}/>}
        
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: sizes.height * 0.5,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    width: sizes.width * 0.8,
    minHeight: sizes.height * 0.55,
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
    fontFamily: "Sora_700Bold",
    fontSize: 24,
    padding: 20,
    paddingTop:40,
  },
  label: {
    fontFamily: "Sora_600SemiBold",
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 5,
  },
  input: {
    width: 277,
    height: 50,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginBottom: 10,
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
    fontFamily: "Sora_700Bold",
    fontSize: 20,
  },
});
