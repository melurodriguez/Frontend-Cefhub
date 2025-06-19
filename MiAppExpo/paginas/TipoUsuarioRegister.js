import TipoUsuarioForm from "../components/TipoUsuarioForm";
import { View } from "react-native";
import { StyleSheet } from "react-native";
export default function TipoUsuarioRegister({navigation, route}) {

  const {email, password}=route.params

    return(
        <View style={styles.container}>
            <TipoUsuarioForm navigation={navigation} email={email} password={password}/>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5CFB8",
  },
});
