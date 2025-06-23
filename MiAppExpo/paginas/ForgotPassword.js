import { View, StyleSheet } from "react-native";
import { colors } from "../utils/themes";
import ForgotPasswordForm from '../components/ForgotPasswordForm'

export default function ForgotPassword({navigation}) {
  return (
    <View style={styles.container}>
      <ForgotPasswordForm navigation={navigation}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5CFB8",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
