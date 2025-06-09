import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import { ScrollView } from "react-native";
import LoadForm from "../components/LoadForm";
import { fonts, sizes } from "../utils/themes";

const writingCat = require("../assets/writingCat.png");
const backArrow = require("../assets/backArrow.png");

export default function RecipeLoad({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            source={backArrow}
            style={{ tintColor: "#000", width: 24, height: 24 }}
          />
        </Pressable>
        <Text style={styles.title}>Cargar Receta</Text>
        <Image source={writingCat} style={styles.catImage} />
      </View>
      <LoadForm navigation={navigation} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40, // Espacio desde arriba para que no esté pegado
    paddingHorizontal: 20,
    alignItems: "stretch",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    width: "100%",
  },

  catImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontFamily:'Sora_700Bold',
    fontSize: fonts.large,
  },
});
