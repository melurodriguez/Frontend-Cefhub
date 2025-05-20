import {View, Text, Image, StyleSheet } from 'react-native'
import Checkbox from 'expo-checkbox'
import { useState } from 'react'



export default function CardInstructions({desc, media, index}) {

    const [isChecked, setChecked]=useState(false)

    function handleClick(){
        setChecked(!isChecked)
    }

    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Paso {index+1}</Text>
                <Text style={styles.desc}>{desc}</Text>
                {media && <Image source={media} style={styles.img}/>}
            </View>
            <View style={styles.checkContainer}>
                <Checkbox value={isChecked} onValueChange={handleClick} style={styles.checkbox}></Checkbox>
            </View>
            
            
        </View>
    )
}

const styles= StyleSheet.create({
    container:{
        backgroundColor:"#f1f5f5",
        marginBottom:20,
        borderRadius:15,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    title:{
        fontWeight:700,
        fontSize:16,
        padding:10
    },
    desc:{
        fontSize:14,
        paddingLeft:10,
    },
    img:{
        width:110,
        height:73,
        borderRadius:15,
        margin:20
    },
    checkContainer:{
        justifyContent:"center",
        alignItems:"center",
    },
    checkbox:{
        marginRight:20
    }
})