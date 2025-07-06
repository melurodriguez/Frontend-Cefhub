import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";
import { AuthContext } from "../auth/AuthContext";
import * as SecureStore from "expo-secure-store";
import { sizes } from "../utils/themes";
import PopUp from "./PopUp";

const welcomeIcon = require("../assets/welcomeIcon.png");
const eye_open = require("../assets/eye-check.png");
const eye_closed = require("../assets/eye-closed.png");
const check= require('../assets/check.png');
const errorImg=require('../assets/error.png');
const doubt = require('../assets/doubt.png');

export default function LoginForm({ navigation }) {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [visibility, setVisibility] = useState(true);
  const [popUp, setPopUp]= useState(false);
  const [popUpInvalidCredentials, setPopUpInvalidCredentials]=useState(false);
  const [popUpErrorInesperado, setPopUpErrorInesperado]=useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const cargarCredenciales = async () => {
      const savedEmail = await SecureStore.getItemAsync("email");
      const savedPassword = await SecureStore.getItemAsync("password");
      if (savedEmail && savedPassword) {
        setForm({
          email: savedEmail,
          password: savedPassword,
          rememberMe: true,
        });
        setPopUp(true)
        //Alert.alert("Autocompletado", "Tus credenciales fueron cargadas.");
      }
    };
    cargarCredenciales();
  }, []);

  const validarFormulario = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    const emailVacio = !form.email.trim();
    const passwordVacio = !form.password.trim();

    if (emailVacio && passwordVacio) {
      newErrors.email = "Debés completar el email y la contraseña.";
      valid = false;
    } else {
      if (emailVacio) {
        newErrors.email = "El email es obligatorio.";
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "El email no tiene un formato válido.";
        valid = false;
      }

      if (passwordVacio) {
        newErrors.password = "La contraseña es obligatoria.";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };



 const handleLogin = async () => {
   if (!validarFormulario()) return;
   try {
     setLoading(true);
     const success = await login(form.email, form.password, form.rememberMe);
     if (success) {
       if (form.rememberMe) {
         await SecureStore.setItemAsync("email", form.email);
         await SecureStore.setItemAsync("password", form.password);
       } else {
         await SecureStore.deleteItemAsync("email");
         await SecureStore.deleteItemAsync("password");
       }
       navigation.navigate("Menú");
     }
   } catch (error) {
    if (error.response?.status ===401){
      setPopUpInvalidCredentials(true)
    }else{
      setPopUpErrorInesperado(true)
    }
    
    console.log("Error al iniciar sesión:", error);
   

   } finally {
     setLoading(false);
   }
 };


  return (
    <View style={styles.view}>
      <View style={styles.innerShadow}></View>
      <Image source={welcomeIcon} style={styles.catImage}></Image>
      <View style={styles.content}>
        <Text style={styles.text}>Iniciar Sesión</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(value) => {
            handleChange("email", value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={form.password}
            secureTextEntry={visibility}
            placeholder="Password"
            textContentType="password"
            onChangeText={(value) => {
              handleChange("password", value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          <Pressable onPress={() => setVisibility(!visibility)} style={styles.eyeButton}>
            <Image
              source={visibility ? eye_open : eye_closed}
              style={styles.eyeIcon}
            />
          </Pressable>
        </View>
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
        <View style={styles.check}>
          <Checkbox
            value={form.rememberMe}
            style= {{margin:10}}
            onValueChange={() => handleChange("rememberMe", !form.rememberMe)}
          ></Checkbox>
          <Text style={{fontFamily:'Sora_400Regular'}}>Recordarme</Text>
        </View>
        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.btnText}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Text>
        </Pressable>
        <View style={styles.extraOptions}>
          <Pressable style={styles.linkBtn} onPress={() => navigation.navigate("RegisterPage")}>
            <Text style={styles.linkText}>¿No tenés cuenta? <Text style={styles.linkBold}>Registrate</Text></Text>
          </Pressable>

          <Pressable style={styles.linkBtn} onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña? <Text style={styles.linkBold}>Recuperala</Text></Text>
          </Pressable>
        </View>

      </View>
      {popUp && <PopUp action={"Tus credenciales fueron cargadas"} visible={popUp} onClose={()=>setPopUp(false)} duration={3000} image={check}/>}
      {popUpInvalidCredentials && <PopUp action={"Email o Contraseña incorrecto."} visible={popUpInvalidCredentials} onClose={()=>setPopUpInvalidCredentials(false)} duration={2000} image={errorImg}/>}
      {popUpErrorInesperado && <PopUp action={"Error. \n\nOcurrió un error inesperado."} visible={popUpErrorInesperado} onClose={()=>setPopUpErrorInesperado(false)} duration={2000} image={doubt}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: "#fff",
    width: 344,
    height:525,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderRadius: sizes.radius,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 5,
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
  catImage: {
    width: 132,
    height: 133,
    position: "absolute",
    top: -90,
    alignSelf: "center",
    zIndex: 1,
  },
  innerShadow: {
    width: 344,
    height:480,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    backgroundColor: "transparent",
    zIndex: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,

  },
  content: {
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    borderColor: "#000",
  },
  text: {
    fontSize: 24,
    fontFamily:'Sora_700Bold',
    padding: 20,
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
  check: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width:"100%",
    alignItems:"center"
  },
  btn: {
    paddingBottom: 10,
    marginBottom:5
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
  },

  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: "#666",
  },
  extraOptions: {
    marginTop: 10,
    alignItems: "center",
    gap: 5,
  },

  linkBtn: {
    paddingVertical: 6,
  },

  linkText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Sora_400Regular",
    textAlign: "center",
  },

  linkBold: {
    fontFamily: "Sora_700Bold",
    color: "#505c86",
  },


});
