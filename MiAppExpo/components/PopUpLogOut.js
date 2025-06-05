import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, sizes, fonts, colors } from "../utils/themes";

export default function PopUpLogOut() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Estas seguro de que deseas cerrar sesión?
      </Text>
      <Pressable style={styles.btnContinue}>
        <Text style={{ fontSize: fonts.small }}>No, continuar en la app</Text>
      </Pressable>
      <Pressable style={styles.btnLogout}>
        <Text style={{ fontSize: fonts.small, color: colors.white }}>
          Cerrar sesión
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fonts.medium,
    fontWeight: fonts.bold,
  },
  btnContinue: {
    backgroundColor: colors.backgroundColorLight,
  },
  btnLogout: {
    backgroundColor: colors.red,
  },
});
