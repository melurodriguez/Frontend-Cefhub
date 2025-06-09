import { StyleSheet, View, Text, Image } from "react-native";
import CardNotification from "../components/CardNotification";
import { fonts } from "../utils/themes";
import { FlatList } from "react-native";
import { useState, useEffect } from "react";
import api from "../api/axiosInstance";


const notifCat = require("../assets/notifCat.png");
//const { notifications } = useContext(AuthContext);

export default function Notificaciones({ navigation }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

  }, []);
  return (

        <View style={styles.header}>
          <Image source={notifCat} style={styles.catImage} />
          <Text style={styles.title}>Notificaciones</Text>
        </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 20,
  },
  title: {
    fontWeight: fonts.bold,
    fontSize: fonts.large,
  },
  catImage: {
    width: 80,
    height: 80,
  },
});
