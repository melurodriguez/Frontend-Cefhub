import { Pressable, View, Image, Text, StyleSheet } from "react-native";

const welcomeIcon=require("../assets/thinking.svg");

export default function FormNotLogged() {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>No estás registrado</Text>
            <View style={styles.card}>
                <View style={styles.innerShadow}></View>
                <Image source={welcomeIcon} style={styles.catImage}></Image>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button}>
                        <Text style={styles.text}>Ingresar</Text>
                    </Pressable>
                    <Pressable style={styles.button}>
                        <Text style={styles.text}>Registrarme</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    card:{
        backgroundColor:"#f1f5f5",
        width:327,
        height:297,
        borderRadius:15,
        position: 'relative',

    },
    button:{
        backgroundColor:"#505c86",
        borderRadius:15,
        width:266,
        height:50,
        margin:15,
        justifyContent:"center",
        alignItems:"center",
    
    },
    buttonContainer:{
        position:"absolute",
        top:75,
        left:15,
    },
    title:{
        fontWeight:700,
        marginBottom:140,
        fontSize:24
    },
    text:{
        color:"#fff",
        fontWeight:500,
        fontSize:20,
    },
    catImage: {
        position: 'absolute',
        top: -90, // la mitad de la altura para que sobresalga
        alignSelf: 'center',
        zIndex: 1,
    },
    container:{
        alignItems:"center"
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
})