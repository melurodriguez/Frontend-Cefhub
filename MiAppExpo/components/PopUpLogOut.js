import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, sizes, fonts, colors } from "../utils/themes";
import { Modal } from "react-native-paper";

export default function PopUpLogOut() {
  return (
    <Modal visible={visible} transparent animationType="slide" style={styles.container}>
      <Text style={styles.title}>
        Estas seguro de que deseas cerrar sesión?
      </Text>
      <Pressable style={styles.btnContinue}>
        <Text style={{ fontSize: fonts.small, fontFamily:'Sora_400Regular', }}>No, continuar en la app</Text>
      </Pressable>
      <Pressable style={styles.btnLogout}>
        <Text style={{ fontSize: fonts.small, color: colors.white, fontFamily:'Sora_400Regular', }}>
          Cerrar sesión
        </Text>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fonts.medium,
    fontFamily:'Sora_700Bold',
  },
  btnContinue: {
    backgroundColor: colors.backgroundColorLight,
  },
  btnLogout: {
    backgroundColor: colors.red,
  },
});
