import FormNotLogged from "../components/FormNotLogged";
import { StyleSheet, View } from "react-native";

export default function ProfileNotLogged({ navigation }) {
  return (
    <View style={styles.container}>
      <FormNotLogged navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
