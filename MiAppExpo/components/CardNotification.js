import { View, Text, Image, StyleSheet } from "react-native";
import { sizes, fonts, colors } from "../utils/themes";

export default function CardNotification({ media, subject }) {
  return (
    <View style={styles.container}>
      <View style={styles.innerShadow}></View>

      <View style={styles.card}>
        <Image source={media} style={{ width: "30%", height: "70%" }} />

        <Text style={styles.text}>{subject}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    borderRadius: 15,
    padding: sizes.height * 0.03,
    justifyContent: "space-between",
  },
  text: {
    fontWeight: fonts.bold,
    fontSize: fonts.small,
  },
  innerShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    backgroundColor: "transparent",
    zIndex: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});
