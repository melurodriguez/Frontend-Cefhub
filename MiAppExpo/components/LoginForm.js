
import { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, Pressable} from "react-native";

import login from "../backend/userController";
import Checkbox from "expo-checkbox";

const welcomeIcon= require("../assets/welcomeIcon.svg");

export default function LoginForm(value, placeholder, onChangeText) {

   const [form, setForm] = useState({
        username: '',
        password: '',
    });

    const [clicked, setClick]=useState(false)

    function handleClick(){
        setClick(!clicked)
    }

    const handleChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    function sendData(username, password){
        if(login(username, password)){
            console.log("acceso admitido")
        }else{
            console.log("acceso denegado")
        }
    } 

    return(
  
        <View style={styles.view}>
            <View style={styles.innerShadow}></View>
            <Image source={welcomeIcon} style={styles.catImage}></Image>
            <View style={styles.content}>
                <Text style={styles.text}>Iniciar Sesión</Text>
                <TextInput style={styles.input} value={form.username} placeholder="Username" onChangeText={(value)=>{handleChange("username", value)}}></TextInput>
                <TextInput style={styles.input} value={form.password} secureTextEntry placeholder="Password" onChangeText={(value)=>{handleChange("password", value)}}></TextInput>
                <View style={styles.check}>
                    <Checkbox value={clicked} onValueChange={handleClick}></Checkbox>
                    <Text>Recordarme</Text>
                </View>
                <Pressable style={styles.button} onPress={()=>{sendData(form.username, form.password)}}>
                    <Text style={styles.btnText}>Ingresar</Text>
                </Pressable>
                <Pressable style={styles.btn}><Text>No tenés cuenta? Registrate</Text></Pressable>
                <Pressable ><Text>Olvidaste tu contraseña? Recuperala</Text></Pressable>
            </View>
           
        </View>
       
    )
}

const styles=StyleSheet.create({

    view:{
        backgroundColor:"#fff",
        width:344,
        height:442,
        justifyContent:"center",
        alignItems:"center",
        borderColor:"#000"
    },
    input:{
        width:277,
        height: 50,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius:15,
        backgroundColor:"#f1f5f5"
    },
    catImage: {
        width:132,
        height:133,
        position: 'absolute',
        top: -90, // la mitad de la altura para que sobresalga
        alignSelf: 'center',
        zIndex: 1,
    },
    innerShadow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 15,
        backgroundColor: 'transparent',
        zIndex: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: -2,
          height: -2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 2, // para Android
    },
    content:{
        justifyContent:"space-around",
        alignItems:"center",
        marginTop:45,
        borderColor:"#000"
    },
    text:{
        fontSize:24,
        fontWeight:700,
        padding:20
    },
    button:{
        backgroundColor:"#505c86",
        borderRadius:15,
        justifyContent:"center",
        alignItems:"center",
        width:277,
        height:50,
        margin: 20,
    },
    btnText:{
        color:"#fff",
        fontWeight:700,
        fontSize:20
    },
    check:{
        flexDirection:"row",
        justifyContent:"flex-start"
    },
    btn:{
        paddingBottom:10
    }
})