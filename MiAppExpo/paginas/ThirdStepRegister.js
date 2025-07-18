import CardCreatePassword from "../components/CardCreatePassword";
import { View, StyleSheet } from "react-native";

export default function ThirdStepRegister({ route, navigation }) {

  const {email}=route.params

  return (
    <View style={styles.container}>
      <CardCreatePassword email={email} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5CFB8",
  },
});
