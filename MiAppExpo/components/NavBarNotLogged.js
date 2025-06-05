import { useState } from "react";
import { Pressable, View, StyleSheet, Image } from "react-native";
import HomePage from "../paginas/HomePage";
import SearchPage from "../paginas/SearchPage";

const home = require("../assets/home.png");
const search = require("../assets/search.png");
const notif = require("../assets/notif.png");
const profile = require("../assets/profile.png");

export default function NavBarNotLogged() {
  const [indexPressed, setIndexPressed] = useState(null);

  function handleClick(index) {
    setIndexPressed(index);
  }

  const icons = [home, search, profile];

  return (
    <View style={styles.view}>
      {icons.map((icon, index) => [
        <Pressable
          key={index}
          onPress={() => handleClick(index)}
          style={[styles.pressable, indexPressed === index && styles.pressed]}
        >
          <Image
            source={icon}
            style={[styles.image, indexPressed === index && styles.pressedImg]}
          />
        </Pressable>,
      ])}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    height: 93,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
    tintColor: "#000",
  },
  pressable: {
    padding: 10,
    borderRadius: 10,
  },
  pressed: {
    backgroundColor: "#505C86",
  },
  pressedImg: {
    tintColor: "#fff",
  },
});
