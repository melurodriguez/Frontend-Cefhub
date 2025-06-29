import { StyleSheet, View, Text, Image } from "react-native";
import { sizes } from "../utils/themes";


const avatars = [
  require("../assets/user.png"),     // 0
  require("../assets/user2.png"),    // 1
  require("../assets/user3.png"),    // 2
  require("../assets/user4.png"),    // 3
  require("../assets/user5.png"),    // 4
  require("../assets/user6.png"),    // 5
];

export default function CardCreator({ alias, avatar}) {
  return (
    <View style={styles.container}>
      <Text style={styles.creador}>Creador</Text>
      <View style={styles.userContainer}>
        <Image
          source={avatars[parseInt(avatar)] }
          style={styles.img}
        />
        <View style={styles.datosContainer}>
          <Text style={{fontFamily:'Sora_400Regular',}}>{alias}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF2E5",
    borderRadius: 15,
    marginTop: 20,
    padding: 20,
    width:sizes.width*0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  creador: {
    fontFamily:'Sora_700Bold',
    fontSize: 20,
  },
  img: {
    width: 40,
    height: 40,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
  },
  datosContainer: {
    paddingLeft: 10,
  },
});
