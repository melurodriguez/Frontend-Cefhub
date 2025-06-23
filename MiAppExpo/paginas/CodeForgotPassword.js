import CodeFormForgotPassword from "../components/CodeFormForgotPassword";
import { View, StyleSheet } from "react-native";

export default function CodeForgotPassword({route, navigation}) {

    const {email}=route.params

    return(
        <View style={styles.container}>
            <CodeFormForgotPassword email={email} navigation={navigation}/>
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