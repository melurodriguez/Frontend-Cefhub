import { useEffect, useContext } from "react";
import { View, Image, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as Network from "expo-network";
import { AuthContext } from "../auth/AuthContext";
const icon = require("../assets/notebookCat.png");
import { sizes, fonts, colors } from "../utils/themes";
export default function Splash({ navigation }) {
  const { token, loading } = useContext(AuthContext);

  useEffect(() => {
    const checkEverything = async () => {
      if (loading) return;

      try {
        const networkState = await Network.getNetworkStateAsync();
        //const networkState = { isConnected: false, isInternetReachable: false }; //para pruebas
        setTimeout(() => {
          if (!networkState.isConnected || !networkState.isInternetReachable) {
            navigation.replace("NoConexion");
            return;
          }

          if (token) {
            navigation.replace("Menú");
          } else {
            navigation.replace("MainVisitor");
          }
        }, 2000);
      } catch {
        setTimeout(() => {
          navigation.replace("NoConexion");
        }, 2000);
      }
    };

    checkEverything();
  }, [loading, token]);

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.text}>Sabor y aprendizaje en cada click...</Text>
      <ActivityIndicator size="small" color={colors.orange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center",backgroundColor: colors.backgroundColorDark,
  },
  icon: {
    width: 135, height: 135,
  },
  text: {
    color: colors.orange,
    fontWeight: "700",
    marginVertical: 20,
  },
});
