import { StyleSheet, View, Text, Image } from "react-native"

const user=require("../assets/user.png")

export default function CardCreator() {
    return(
        <View style={styles.container}>
            <Text style={styles.creador}>Creador</Text>
            <View style={styles.userContainer}>
                <View>
                    <Image source={user} style={styles.img}/>
                </View>
                <View style={styles.datosContainer}>
                    <Text>Nombre creador</Text>
                    <Text>lalalalallallalalalallalal</Text>
                </View>

            </View>
            
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:"#f1f5f5",
        borderRadius:15,
        marginTop:20,
        padding:20

    },
    creador:{
        fontWeight:"700",
        fontSize:20,
    },
    img:{
        width:40,
        height:40
    },
    userContainer:{
        flexDirection:"row",
        alignItems:"center",
        paddingTop:20,

    },
    datosContainer:{
        paddingLeft:10,
    }
})