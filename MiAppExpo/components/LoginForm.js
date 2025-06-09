import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import { AuthContext } from "../auth/AuthContext";
import * as SecureStore from "expo-secure-store";
import { sizes } from "../utils/themes";

const welcomeIcon = require("../assets/welcomeIcon.png");
const eye_open = require("../assets/eye-check.png");
const eye_closed = require("../assets/eye-closed.png");

export default function LoginForm({ navigation }) {
  const { login } = useContext(AuthContext); //extraigo la funcion login del authprovider

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [visibility, setVisibility] = useState(true);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const cargarCredenciales = async () => {
      const savedUsername = await SecureStore.getItemAsync("username");
      const savedPassword = await SecureStore.getItemAsync("password");
      if (savedUsername && savedPassword) {
        setForm((prev) => ({
          ...prev,
          username: savedUsername,
          password: savedPassword,
          rememberMe: true,
        }));
      }
    };
    cargarCredenciales();
    //handleLogin() --> es menos seguro
  }, []);

  const handleLogin = async () => {
    try {
      const success = await login(form.email, form.password, form.rememberMe);
      if (success) {
        navigation.navigate("Menú");
      }
    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas o problema de red.");
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
          onChangeText={(value) => {
            handleChange("email", value);
          }}
        ></TextInput>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={styles.input}
            value={form.password}
            secureTextEntry={visibility}
            placeholder="Password"
            onChangeText={(value) => {
              handleChange("password", value);
            }}
          ></TextInput>
          <Pressable onPress={() => setVisibility(!visibility)}>
            <Image
              source={visibility ? eye_open : eye_closed}
              style={{ width: 20, height: 20 }}
            />
          </Pressable>
        </View>
        <View style={styles.check}>
          <Checkbox
            value={form.rememberMe}
            style= {{margin:10}}
            onValueChange={() => handleChange("rememberMe", !form.rememberMe)}
          ></Checkbox>
          <Text style={{fontFamily:'Sora_400Regular'}}>Recordarme</Text>
        </View>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.btnText}>Ingresar</Text>
        </Pressable>
        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate("RegisterPage")}>
          <Text style={{fontFamily:'Sora_400Regular',}}>No tenés cuenta? Registrate</Text>
        </Pressable>
        <Pressable style={styles.btn}>
          <Text style={{fontFamily:'Sora_400Regular',}}>Olvidaste tu contraseña? Recuperala</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: "#fff",
    width: 344,
    height:480,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderRadius: sizes.radius,
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
    top: -90, // la mitad de la altura para que sobresalga
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
    marginTop: 45,
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
});
