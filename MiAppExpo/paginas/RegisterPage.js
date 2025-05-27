import { StyleSheet, View } from "react-native"
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage({navigation}) {
    return(
        <View style={styles.container}>
            <RegisterForm navigation={navigation}/>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#E5CFB8"
    }
})