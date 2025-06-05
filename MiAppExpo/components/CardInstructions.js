import { View, Text, Image, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { useState } from "react";

export default function CardInstructions({ desc, media, index }) {
  const [isChecked, setChecked] = useState(false);

  function handleClick() {
    setChecked(!isChecked);
  }

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>Paso {index + 1}</Text>
        <Text style={styles.desc}>{desc}</Text>
        {media && <Image source={media} style={styles.img} />}
      </View>
      <View style={styles.checkContainer}>
        <Checkbox
          value={isChecked}
          onValueChange={handleClick}
          style={styles.checkbox}
        ></Checkbox>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f1f5f5",
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },

  desc: {
    fontSize: 14,
    paddingLeft: 10,
  },
  img: {
    width: 110,
    height: 73,
    borderRadius: 15,
    margin: 20,
  },
  checkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 20,
  },
});
