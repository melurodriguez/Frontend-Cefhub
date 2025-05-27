import {View, Image, Pressable, Text, StyleSheet} from 'react-native'
import {sizes, fonts, colors} from '../utils/themes'

const backArrow=require('../assets/backArrow.png')
const data=require('../assets/data.png')
const password=require('../assets/password.png')
const attendance=require('../assets/attendance.png')
const logout=require('../assets/logout.png')

export default function SideMenu() {
    return(
        <View style={styles.container}>
            <View style={styles.row}>
                <Pressable><Image source={backArrow}/></Pressable>
                <Text style={styles.title}>Menú</Text>
            </View>
            <Pressable style={styles.row}>
                <Image source={data}/>
                <Text style={styles.text}>Mis Datos</Text>
            </Pressable >
            <Pressable style={styles.row}>
                <Image source={password}/>
                <Text style={styles.text}>Cambiar Contraseña</Text>
            </Pressable>
            <Pressable style={styles.row}>
                <Image source={attendance}/>
                <Text style={styles.text}>Asistencia</Text>
            </Pressable>
            <Pressable style={styles.row}>
                <Image source={logout}/>
                <Text style={styles.text}>Cerrar Sesion</Text>
            </Pressable>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:colors.primary,
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        width:sizes.width*0.6,
        borderBottomLeftRadius:sizes.radius,
        borderTopLeftRadius:sizes.radius

    },
    row:{
        flexDirection:"row",

    },
    title:{
        fontWeight:fonts.bold,
        color:colors.white,
        fontSize:fonts.large
    },
    text:{
        color:colors.white,
        fontSize:fonts.small
    }
})