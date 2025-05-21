import {View, Text, Image, StyleSheet} from 'react-native'
import { ScrollView } from 'react-native'
import LoadForm from '../components/LoadForm'

const writingCat=require('../assets/writingCat.svg')

export default function RecipeLoad() {
    return(
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>
                <Text>Cargar Receta</Text>
                <Image source={writingCat}/>
            </View>
            <View>
                <LoadForm/>
            </View>

        </ScrollView>
    )
}

const styles=StyleSheet.create({
    container:{
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-evenly",
        padding:20,

    },
   
})