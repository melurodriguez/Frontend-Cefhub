import { StyleSheet, View } from "react-native";
import LoginForm from "../components/LoginForm";

export default function LoginPage({navigation}) {
    return(
        <View style={styles.container}>
            <LoginForm navigation={navigation}/>
        </View>
        
    )
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:"#E5CFB8",
        flex:1,
        justifyContent:"center",
        alignItems:"center"
      
    }
})