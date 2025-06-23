import ResetPasswordForm from "../components/ResetPasswordForm";
import { View, StyleSheet } from "react-native";

export default function ResetPassword({route, navigation}) {
    const {email}=route.params

    return(
        <View style={styles.container}>
            <ResetPasswordForm email={email} navigation={navigation}/>
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