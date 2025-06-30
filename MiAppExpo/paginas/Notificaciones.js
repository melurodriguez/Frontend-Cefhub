import { StyleSheet, View, Text, Image } from "react-native";
import CardNotification from "../components/CardNotification";
import { fonts } from "../utils/themes";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import api from "../api/axiosInstance";
const notifCat = require("../assets/notifCat.png");

export default function Notificaciones({ navigation }) {
  const [notifications, setNotifications] = useState([]);

  useFocusEffect(
        useCallback(() => {
          api
            .get("/user/me/notificaciones")
            .then((res) => setNotifications(res.data.notificaciones))
            .catch((err) => {
              console.error("Error al obtener recetas:", err);
            });

        }, [])
      );
  return (
      <View style={styles.container}>
            <View style={styles.header}>
              <Image source={notifCat} style={styles.catImage} />
              <Text style={styles.title}>Notificaciones</Text>
            </View>
        <ScrollView>
            {notifications.map((notification, index) => (
              <View key={index}>
                <CardNotification data={notification} />
              </View>
            ))}
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 20,
  },
  title: {
    fontFamily:"Sora_700Bold",
    fontSize: fonts.large,
  },
  catImage: {
    width: 80,
    height: 80,
  },
});
