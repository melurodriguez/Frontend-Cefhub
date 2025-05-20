import { StyleSheet, View } from "react-native";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return(
        <View style={styles.container}>
            <LoginForm/>
        </View>
        
    )
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:"#E5CFB8",
      
    }
})