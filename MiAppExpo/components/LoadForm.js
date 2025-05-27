import axios from 'axios'
import { useState } from 'react'
import {View, Text, Image, TextInput, Pressable, StyleSheet} from 'react-native'
import API_BASE_URL from '../utils/config'

export default function LoadForm({navigation}) {

    const [recipe, setRecipe]=useState({
        name:"",
        description:"",
        ingredients:[""],
        instructions:[{
            step:"",
            media:"",
        }],
        tag:""
    })

    const handleChange=(name, value)=>{
        setRecipe((prev) => ({ ...prev, [name]: value }))
    }

    const uploadRecipe= async()=>{
        try{
            const res= await axios.post(`${API_BASE_URL}/recetas`, {
                                                                        name: recipe.name,
                                                                        description: recipe.description,
                                                                        ingredients: recipe.ingredients,
                                                                        instructions: recipe.instructions,
                                                                        tag: recipe.tag
                                                                    })
            const data= await res.data()

            navigation.navigate('LoadedRecipe.js', {navigation})

        }catch(err){
            console.error("Error al crear receta: ", err)
        }
    }



    return(
        <View style={styles.container}>
            <View>
                <View>
                    <Text>Nombre del plato</Text>
                    <TextInput style={styles.input} value={recipe.name} onChangeText={(value)=>{handleChange('name', value)}} />
                </View>
                <View>
                    <Text>Descripción del plato</Text>
                    <TextInput style={styles.input} value={recipe.description} onChangeText={(value)=>{handleChange('description', value)}}/>
                </View>
                <View>
                    <Text>Ingredientes</Text>
                    <TextInput style={styles.input} value={recipe.ingredients[recipe.ingredients.length-1]} onChangeText={(value)=>{handleChange('ingredients', value)}}/>
                </View>
                <View>
                    <Text>Pasos</Text>
                    <TextInput style={styles.input} value={recipe.instructions[recipe.instructions.length-1].step} onChangeText={(value)=>{handleChange('instructions', value)}}/>
                </View>
                <View>
                    <Text>Tags</Text>
                    <TextInput style={styles.input} value={recipe.tag} onChangeText={(value)=>{handleChange('tag', value)}}/>
                </View>
                
            </View>
            <View style={styles.btnContainer}>
                <Pressable style={styles.button}onPress={uploadRecipe}><Text style={styles.btnText} >Cargar Receta</Text></Pressable>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    },
    input:{
        width:344,
        height: 50,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius:15,
        backgroundColor:"#f1f5f5"
    },
    btnContainer:{
        justifyContent:"center",
        alignItems:"flex-end"
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
})