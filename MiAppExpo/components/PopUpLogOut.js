import { useEffect, useContext } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../auth/AuthContext";

export default function PopUpLogOut({ navigation }) {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          onPress: () => navigation.goBack(),
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: logout,
          style: "destructive",
        },
      ]
    );
  }, []);

  return null;
}
