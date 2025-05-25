import {View, Text, Image, StyleSheet} from 'react-native'
import { ScrollView } from 'react-native'
import LoadForm from '../components/LoadForm'
import {sizes} from '../utils/themes'

const writingCat=require('../assets/writingCat.png')

export default function RecipeLoad({navigation}) {
    return(
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>
                <Text>Cargar Receta</Text>
                <Image source={writingCat}/>
            </View>
            <View>
                <LoadForm navigation={navigation}/>
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
    catImage:{
        width:sizes.width*0.05,
        height:sizes.height*0.05
    }
   
})