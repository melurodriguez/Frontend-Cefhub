import { View, Image, Text, StyleSheet } from "react-native";
import { sizes, fonts, colors } from "../utils/themes";
import { useEffect, useContext } from "react";
import { ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../auth/AuthContext";

const icon = require("../assets/notebookCat.png");

export default function Splash({ navigation }) {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigation.replace("Main");
      } else {
        navigation.replace("MainVisitor");
      }
    }, 1500); // Tiempo opcional para mostrar el splash

    return () => clearTimeout(timer);
  }, [token]);

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
    backgroundColor: colors.backgroundColorDark,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: 135,
    width: 135,
  },
  text: {
    color: colors.orange,
    fontWeight: fonts.bold,
    paddingVertical: sizes.padding * 2,
  },
});
