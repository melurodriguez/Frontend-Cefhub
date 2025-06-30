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

export default function ResetPasswordForm({email, navigation}) {

    const [form, setForm]=useState({
        contrasenia:"",
        contrasenia_repetida:""
    })
    const [isLoading, setIsLoading] = useState(false);

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
              <Text style={styles.title}>Registrarme</Text>

              <TextInput
                value={form.contrasenia}
                placeholder="Contraseña"
                onChangeText={(value) => handleChange("contrasenia", value)}
                style={styles.input}
                secureTextEntry
              />
              <TextInput
                value={form.contrasenia_repetida}
                placeholder="Repetí tu contraseña"
                onChangeText={(value) => handleChange("contrasenia_repetida", value)}
                style={styles.input}
                secureTextEntry
              />
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
                  <Text style={{ color: "red", alignSelf: "flex-start", marginLeft: 15, marginBottom: 10 }}>
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
        </View>
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: sizes.height * 0.6,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    width: sizes.width * 0.8,
    height: sizes.height * 0.55,
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
});
