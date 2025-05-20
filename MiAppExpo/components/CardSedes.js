import Checkbox from "expo-checkbox"
import { StyleSheet, View, Text } from "react-native"
import { useState } from "react";
import {RadioButton} from 'react-native-paper'

export default function CardSedes({sede}) {


    const [pressed, setPressed]=useState(false)
    const [selectedId, setSelectedId] = useState(null);

    function handlePress(id){
        setPressed(!pressed)
        setSelectedId(id)
    }

    return(
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text >{sede.sede}</Text>
                <Text>Direccion: {sede.calle}  {sede.altura}</Text>
                <Text>Telefono: {sede.telefono}</Text>
                <Text>Correo: {sede.email}</Text>

            </View>
            <View >
                <RadioButton value={sede.id} onPress={()=>handlePress(sede.id)} status={(selectedId === sede.id) & (pressed) ? 'checked':'unchecked'}/>
            </View>
           
        </View>
    )
}

const styles=StyleSheet.create({
    container:{

        backgroundColor:"#FFF2E5",
        borderRadius:15,
        padding:20,
        margin:20,
        flexDirection:"row",
        alignItems:"center",
   
        
 
        
    },
    textContainer: {
    flexShrink: 1, // permite que el texto se ajuste sin forzar tamaño
    marginRight: 10, // separa del radio button
    },
    btnCheck:{
        padding:20,
    }
})