import {View, Text, Image, StyleSheet, Pressable, SafeAreaView} from 'react-native'
import { ScrollView } from 'react-native'
import LoadForm from '../components/LoadForm'
import {fonts, sizes} from '../utils/themes'

const writingCat=require('../assets/writingCat.png')
const backArrow=require('../assets/backArrow.png')

export default function RecipeLoad({navigation}) {
    return(
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>
                <Pressable><Image source={backArrow} style={{tintColor:"#000"}}/></Pressable>
                <Text style={styles.title}>Cargar Receta</Text>
                <Image source={writingCat} style={styles.catImage}/>
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
        justifyContent:"space-between",
        padding:20,
        width:"100%"

    },
    catImage:{
        width:80,
        height:80
    },
    title:{
        fontWeight:fonts.bold,
        fontSize:fonts.large
    }
   
})