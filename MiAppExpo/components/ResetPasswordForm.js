import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator
} from "react-native";
import { sizes } from "../utils/themes";
import api from "../api/axiosInstance";

const welcomeIcon=require('../assets/welcomeIcon.png')
const eye_open = require("../assets/eye-check.png");
const eye_closed = require("../assets/eye-closed.png");

export default function ResetPasswordForm({email, navigation}) {

    const [form, setForm]=useState({
        contrasenia:"",
        contrasenia_repetida:""
    })
    const [isLoading, setIsLoading] = useState(false);
    const [visibility, setVisibility] = useState(true);
    const[popUpErrorInesperado, setPopUpErrorInesperado]=useState(false);

      const passwordRules = [
        { label: "Mínimo 8 caracteres", test: (pw) => pw.length >= 8 },
        { label: "Al menos una mayúscula", test: (pw) => /[A-Z]/.test(pw) },
        { label: "Al menos una minúscula", test: (pw) => /[a-z]/.test(pw) },
        { label: "Al menos un número", test: (pw) => /[0-9]/.test(pw) },
        { label: "Al menos un caracter especial", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
      ];
    const esContraseniaValida = passwordRules.every(({ test }) => test(form.contrasenia));
    const coincidenContrasenias = form.contrasenia === form.contrasenia_repetida && form.contrasenia !== "";

    const handleChange=(name, value)=>{
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleReset = async () => {
        if (!esContraseniaValida) {
          console.log("La contraseña no cumple con los requisitos de seguridad.");
          return;
        }

        if (!coincidenContrasenias) {
          console.log("Las contraseñas no coinciden.");
          return;
        }

        setIsLoading(true);
        try {
          const res = await api.post("/reset-password", { password: form.contrasenia, email });
          console.log("Respuesta del backend:", res);
          navigation.navigate("LoginPage");
        } catch (err) {
          if(err.response?.status === 500){
            setPopUpErrorInesperado(true)
          }
          console.log("Error al crear contraseña: ", err);
        } finally {
          setIsLoading(false);
        }
      };


    return (
        <View style={styles.container}>
          <View style={styles.form}>
            <Image source={welcomeIcon} style={styles.catImage} />
            <View style={styles.content}>
              <View style={{alignItems:"center"}}>
                <Text style={styles.title}>Creá una nueva contraseña</Text>
              </View>
              
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={form.contrasenia}
                  secureTextEntry={visibility}
                  placeholder="Contraseña"
                  textContentType="password"
                  onChangeText={(value) => {
                    handleChange("contrasenia", value);
                  }}
                />
                <Pressable onPress={() => setVisibility(!visibility)} style={styles.eyeButton}>
                  <Image
                    source={visibility ? eye_open : eye_closed}
                    style={styles.eyeIcon}
                  />
                </Pressable>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={form.contrasenia_repetida}
                  secureTextEntry={visibility}
                  placeholder="Repetí tu contraseña"
                  textContentType="password"
                  onChangeText={(value) => {
                    handleChange("contrasenia_repetida", value);
                  }}
                />
                <Pressable onPress={() => setVisibility(!visibility)} style={styles.eyeButton}>
                  <Image
                    source={visibility ? eye_open : eye_closed}
                    style={styles.eyeIcon}
                  />
                </Pressable>
              </View>
              {/* Checklist de validación */}
                <View style={{ alignSelf: "flex-start", marginLeft: 15, marginBottom: 10 }}>
                  {passwordRules.map(({ label, test }, i) => (
                    <Text
                      key={i}
                      style={{
                        color: test(form.contrasenia) ? "green" : "red",
                        fontSize: 12,
                        marginVertical: 2,
                        fontFamily: "Sora_400Regular",
                      }}
                    >
                      {test(form.contrasenia) ? "✓ " : "✗ "} {label}
                    </Text>
                  ))}
                </View>

                {/* Mensaje de error si no coinciden */}
                {!coincidenContrasenias && form.contrasenia_repetida.length > 0 && (
                  <Text style={{ color: "red", alignSelf: "flex-start", marginLeft: 15, marginBottom: 10 , fontFamily:"Sora_700Bold"}}>
                    Las contraseñas no coinciden
                  </Text>
                )}

              <Pressable
                style={[styles.button, isLoading && { opacity: 0.6 }]}
                onPress={handleReset}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Cambiar Contraseña</Text>
                )}
              </Pressable>
            </View>
          </View>
          {popUpErrorInesperado && <PopUp action={"Error. \n\nOcurrió un error inesperado."} visible={popUpErrorInesperado} onClose={()=>setPopUpErrorInesperado(false)} duration={2000}/>}
        </View>
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical:20,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    width: sizes.width * 0.8,
    paddingBottom: 30,
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
    fontSize: 20,
    paddingTop:60,
    paddingBottom:20,
    textAlign:"center",
    maxWidth:"60%"
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
    fontSize: 16,
  },
    passwordContainer: {
    width: 277,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#f1f5f5",
    paddingHorizontal: 10,
    marginBottom: 20,
    position: "relative",
  },
    passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
    eyeButton: {
    padding: 5,
    position: 'absolute',
    right: 10,
  },

  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: "#666",
  },
});
