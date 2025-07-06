import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal
} from "react-native";
import { colors, sizes } from "../utils/themes";
import API_BASE_URL from "../utils/config";
import api from "../api/axiosInstance";
import { MaterialIcons } from '@expo/vector-icons';
import PopUp from "./PopUp";


const welcomeIcon = require("../assets/welcomeIcon.png");

export default function RegisterForm({ navigation }) {
   const [form, setForm] = useState({
      username: "",
      email: "",
      nombre: "",
      direccion: "",
    });

  const [aliasSugeridos, setAliasSugeridos] = useState([]);
  const [aliasDisponible, setAliasDisponible] = useState(null);
  const [verificandoAlias, setVerificandoAlias] = useState(false);
  const [emailValido, setEmailValido] = useState(null);
  const [cargando, setCargando] = useState(false);
  const nombreYDireccionCompletos = form.nombre.trim() !== "" && form.direccion.trim() !== "";
  const [popUpAlias, setPopUpAlias]= useState(false)
  const [popUpCorreo, setPopUpCorreo]= useState(false)
  const [popUpHbailitado, setPopUpHabilitado]= useState(false)
  const [popUpInesperado, setPopUpInesperado]= useState(false)
  const [popUpServidor, setPopUpServidor]= useState(false)





  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const verificarAlias = async () => {
    const alias = form.username.trim();
    if (!alias) return;

    setVerificandoAlias(true);
    try {
      const res = await api.get(`/alias-sugerido?alias=${alias}`);
      setAliasDisponible(res.data.disponible);

      if (!res.data.disponible) {
        const sugerencias = await generarSugerenciasAlias(alias);
        setAliasSugeridos(sugerencias);
      } else {
        setAliasSugeridos([]);
      }
    } catch (err) {
      console.error("Error al verificar alias", err);
      setAliasDisponible(null);
    } finally {
      setVerificandoAlias(false);
    }
  };


  const handleFirstStep = async () => {
    if (!aliasDisponible) {
      setPopUpAlias(true)
      return;
    }

    setCargando(true);

    try {
      const res = await api.post("/register/first-step", {
        username: form.username,
        email: form.email,
        nombre: form.nombre,
        direccion: form.direccion,
      });

      const data = res.data;
      console.log("Respuesta del backend:", data);

      if (data.status === "usuario_existente") {
        if (data.puede_recuperar) {
          setPopUpCorreo(true)
        } else {
          setPopUpHabilitado(true)
        }
        return;
      }

      navigation.navigate("SecondStepRegister", { email: form.email });

    } catch (err) {
      if (err.response) {
        setPopUpInesperado(true)
        //Alert.alert("Error", err.response.data?.detail || "Ocurrió un error inesperado.");
      } else {
        setPopUpServidor(true)
        //Alert.alert("Error", "No se pudo conectar con el servidor.");
      }
    } finally {
      setCargando(false);
    }
  };



  const generarSugerenciasAlias = async (base) => {
    const sufijos = [
      Math.floor(Math.random() * 100),
      new Date().getFullYear(),
      Math.floor(Math.random() * 9000 + 1000),
      "_dev",
      "_x",
      "_ok",
    ];

    const posibles = sufijos.map((sufijo) => `${base}${sufijo}`);

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
    );
    return sugerencias.filter(Boolean).slice(0, 5);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.catImage} />
        <View style={styles.content}>
          <Text style={styles.title}>Registrarme</Text>
           

          {/* NICKNAME (alias) PRIMERO */}
          <View style={{ marginBottom: 8, alignSelf: "flex-start" }}>
            <Text style={styles.label}>Nombre de Usuario</Text>
          </View>
          <View style={styles.inputWithIcon}>
            <TextInput
              value={form.username}
              onChangeText={(value) => {
                handleChange("username", value);
                setAliasDisponible(null);
              }}
              onBlur={verificarAlias}
              style={[styles, { flex: 1, marginBottom: 0 }]}
            />
            {verificandoAlias ? (
              <ActivityIndicator size="small" />
            ) : aliasDisponible === true ? (
              <MaterialIcons name="check-circle" size={20} color="green" />
            ) : aliasDisponible === false ? (
              <MaterialIcons name="cancel" size={20} color="red" />
            ) : null}
          </View>
          {/* SUGERENCIAS */}
            {aliasSugeridos.length > 0 && (
              <View style={styles.sugerenciasContainer}>
                {aliasSugeridos.map((alias, index) => (
                  <Pressable
                    key={index}
                    style={styles.sugerenciaItem}
                    onPress={() => {
                      handleChange("username", alias);
                      setAliasDisponible(true);
                      setAliasSugeridos([]);
                    }}
                  >
                    <Text style={styles.sugerenciaText}>{alias}</Text>
                  </Pressable>
                ))}
              </View>
            )}

          {/* EMAIL */}
          <View style={{ marginTop: 10, marginBottom: 8, alignSelf: "flex-start" }}>
            <Text style={styles.label}>Correo Electrónico</Text>
          </View>
          <View style={styles.inputWithIcon}>
            <TextInput
              value={form.email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => {
                handleChange("email", value);
                setEmailValido(validarEmail(value));
              }}
              style={[styles, { flex: 1, marginBottom: 0 }]}
            />
            {emailValido === true ? (
              <MaterialIcons name="check-circle" size={20} color="green" />
            ) : emailValido === false ? (
              <MaterialIcons name="cancel" size={20} color="red" />
            ) : null}
          </View>

          {/* NOMBRE */}
          <View style={{ marginTop: 10, marginBottom: 8, alignSelf: "flex-start" }}>
            <Text style={styles.label}>Nombre completo</Text>
          </View>
          <View style={styles.inputWithIcon}>
            <TextInput
              value={form.nombre}
              onChangeText={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
              style={[styles, { flex: 1, marginBottom: 0 }]}
            />
          </View>

          {/* DIRECCIÓN */}
          <View style={{ marginTop: 10, marginBottom: 8, alignSelf: "flex-start" }}>
            <Text style={styles.label}>Dirección</Text>
          </View>
          <View style={styles.inputWithIcon}>
            <TextInput
              value={form.direccion}
              onChangeText={(value) => setForm((prev) => ({ ...prev, direccion: value }))}
              style={[styles, { flex: 1, marginBottom: 0 }]}
            />
          </View>


          {/* BOTÓN */}
          <Pressable
            disabled={cargando || !aliasDisponible || verificandoAlias || !emailValido || !nombreYDireccionCompletos}
            style={[
              styles.button,
              (cargando || !aliasDisponible || verificandoAlias || !emailValido || !nombreYDireccionCompletos) && { backgroundColor: "#aaa" },
            ]}

            onPress={handleFirstStep}
          >
            {cargando ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Registrarme</Text>
            )}
          </Pressable>
          
        </View>
      </View>
      {popUpAlias && <PopUp action={"Alias inválido. Por favor, elegí un alias disponible"} visible={popUpAlias} onClose={()=>setPopUpAlias(false)} duration={1500}/>}
      {popUpCorreo && <Modal
              animationType="fade"
              transparent={true}
              visible={popUpCorreo}
              onRequestClose={() => setPopUpCorreo(false)}
            >
              <View style={styles.overlay}>
                <View style={styles.popup}>
                  <Text style={styles.popupTitle}>Correo ya registrado</Text>
                  <Text style={styles.popupMessage}>¿Querés recuperar tu contraseña?</Text>
                  <View style={styles.popupButtons}>
                    <Pressable onPress={() => setPopUpCorreo(false)} style={styles.cancelButton}>
                      <Text style={styles.cancelText}>Cancelar</Text>
                    </Pressable>
                    <Pressable onPress={()=>navigation.navigate("ForgotPassword")} style={styles.deleteButton}>
                      <Text style={styles.deleteText}>Sí, recuperar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>}
            {popUpHbailitado && <PopUp action={"Cuenta deshabilitada. El correo ya está registrado, pero no podés recuperar tu contraseña automáticamente.\n\nContactanos a chefhubemail@gmail.com para recibir ayuda."} visible={popUpHbailitado} onClose={()=>setPopUpHabilitado(false)} duration={3000}/>}
            {popUpInesperado && <PopUp action={"Error. \n\nOcurrió un error inesperado"} visible={popUpInesperado} onClose={()=>setPopUpInesperado(false)} duration={1500}/>}
            {popUpServidor && <PopUp action={"Error. \n\nNo se pudo conectar con el servidor."} visible={popUpServidor} onClose={()=>setPopUpServidor(false)} duration={1500}/>}
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
  label: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
    color: "#333",
    marginLeft: 25,
  },

  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    width: sizes.width * 0.8,
    paddingVertical: 20,
    minHeight: sizes.height * 0.45,
    marginVertical:10
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#f1f5f5",
    width: 277,
    height: 50,
    marginBottom: 5,
    paddingHorizontal: 10,
  },

  aliasNoDisponible: {
    color: "red",
    fontSize: 14,
    fontFamily: "Sora_700Bold",
    marginTop: 5,
    marginBottom: 10,
  },

  sugerenciasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
    marginTop: 4,
  },

  sugerenciaItem: {
    backgroundColor: "#e3e6f0",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  sugerenciaText: {
    color: "#333",
    fontSize: 12,
    fontFamily: "Sora_600SemiBold",
  },


  catImage: {
    width: 120,
    height: 120,
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
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 18,
    fontFamily: "Sora_700Bold",
    marginBottom: 10,
  },
  popupMessage: {
    fontSize: 14,
    fontFamily: "Sora_400Regular",
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#f1f5f5",
  },
  cancelText: {
    fontFamily: "Sora_700Bold",
    color: "#333",
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: colors.red,
  },
  deleteText: {
    fontFamily: "Sora_700Bold",
    color: "#fff",
  },
});
