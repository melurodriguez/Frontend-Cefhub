import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";
import { colors, sizes } from "../utils/themes";
import API_BASE_URL from "../utils/config";
import api from "../api/axiosInstance";
import { MaterialIcons } from '@expo/vector-icons';

const welcomeIcon = require("../assets/welcomeIcon.png");

export default function RegisterForm({ navigation }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const [aliasSugeridos, setAliasSugeridos] = useState([]);
  const [aliasDisponible, setAliasDisponible] = useState(null);
  const [verificandoAlias, setVerificandoAlias] = useState(false);
  const [emailValido, setEmailValido] = useState(null); // true | false | null
  const [cargando, setCargando] = useState(false);



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
      Alert.alert("Alias inválido", "Por favor, elegí un alias disponible.");
      return;
    }

    setCargando(true); // 👈 Inicia loading

    try {
      const res = await api.post("/register/first-step", {
        username: form.username,
        email: form.email,
      });
      console.log("Respuesta del backend:", res);
      navigation.navigate("SecondStepRegister", { email: form.email });
    } catch (err) {
      if (err.response) {
        Alert.alert("Error", err.response.data?.detail || "Ocurrió un error inesperado.");
      } else {
        Alert.alert("Error", "No se pudo conectar con el servidor.");
      }
    } finally {
      setCargando(false); // 👈 Termina loading
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
          <View style={styles.inputWithIcon}>
            <TextInput
              value={form.username}
              placeholder="Nombre de Usuario"
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

          {aliasDisponible === false && (
            <Text style={styles.aliasNoDisponible}>Alias en uso . Probá con alguno de estos:</Text>
          )}

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
          <View style={styles.inputWithIcon}>
            <TextInput
              value={form.email}
              placeholder="Correo"
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


          {/* BOTÓN */}
          <Pressable
            disabled={cargando || !aliasDisponible || verificandoAlias || !emailValido}
            style={[
              styles.button,
              (cargando || !aliasDisponible || verificandoAlias || !emailValido) && { backgroundColor: "#aaa" },
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
