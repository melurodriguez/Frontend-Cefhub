import CodeForm from "../components/CodeForm";
import { View, StyleSheet } from "react-native";

export default function SecondStepRegister({ navigation }) {
  return (
    <View>
      <CodeForm navigation={navigation} />
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
