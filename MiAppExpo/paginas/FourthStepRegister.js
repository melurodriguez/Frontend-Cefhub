import AvatarForm from "../components/AvatarForm";
import { StyleSheet, View } from "react-native";
export default function FourthStepRegister({route, navigation}) {

    const {email, password}=route.params

    return(
        <View style={styles.container}>
            <AvatarForm navigation={navigation} email={email} password={password}/>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E5CFB8",
    }
})