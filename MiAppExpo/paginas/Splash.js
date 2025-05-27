import {View, Image, Text, StyleSheet} from 'react-native'
import {sizes, fonts, colors} from '../utils/themes'
import { useEffect } from 'react'
import { ActivityIndicator } from 'react-native-paper'

const icon=require('../assets/notebookCat.png')

export default function Splash({navigation}){

    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate('Main')
        }, 2000)
    }, [])


    return(
        <View style={styles.container}>

            <Image source={icon} style={styles.icon}/>
            <Text style={styles.text}>Sabor y aprendizaje en cada click...</Text>
            <ActivityIndicator size="small" color={colors.orange}/>

        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:colors.backgroundColorDark,
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    icon:{
        height:sizes.height*0.3,
        width:sizes.width*0.2
    },
    text:{
        color: colors.orange,
        fontWeight:fonts.bold,
        paddingVertical:sizes.padding*2
    }
})