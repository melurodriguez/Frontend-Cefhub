import { useState } from "react"
import {View, Text, TextInput, StyleSheet, Image, Pressable} from "react-native";

import RecipeCard from "../components/recipeCard";
import { ScrollView } from "react-native-web";

const menu=require("../assets/menu.svg")
const userIcon=require("../assets/user.svg")
const star=require("../assets/star.svg")
const cheesecake=require("../assets/cheesecake.jpg")
const searchIcon=require("../assets/search.svg")

const recetas=[{
  titulo:"Cheesecake",
  descripcion:"Base crocante de vainilla y el relleno mas cremoso y suave.",
  img: cheesecake,
  autor:{
    usuario:"Melina",
    profilepic:userIcon
  },
  rating:{
    puntos:4.0,
    icono:star
  }
  
},
{
  titulo:"Burritos",
  descripcion:"Tortilla de harina rellena de variedad de ingredientes. Hacelo a tu gusto!",
  img: cheesecake,
  autor:{
    usuario:"Melina",
    profilepic:userIcon
  },
  rating:{
    puntos:3.7,
    icono:star
  }
  
},
{
  titulo:"Pizza estilo Napolitana",
  descripcion:"Masa fina y blanda, de lenta fermentación y alata temperatura de cocción.",
  img: cheesecake,
  autor:{
    usuario:"Melina",
    profilepic:userIcon
  },
  rating:{
    puntos:4.8,
    icono:star
  }
  
}]

const filter=require("../assets/filter.svg")
export default function SearchPage({navigation}) {

    const [search, setSearch]=useState("")
    return(
        <ScrollView>
            <View style={styles.header}>
                <Text style={styles.pageTitle}>Búsqueda</Text>
                <Pressable><Image source={menu}></Image></Pressable>
                
            </View>
            
            <View style={styles.resultTitle}>
               <TextInput value={search} placeholder="Search" onChangeText={setSearch} style={styles.input}></TextInput>
               <Pressable><Image source={searchIcon} style={{tintColor:"#000"}}/></Pressable>
            </View>

            <View>
              <View style={styles.resultTitle}>
                <Text style={styles.rr}>Recetas Recientes</Text>
                <Pressable>
                  <Image source={filter}/>
                </Pressable>
                
              </View>
                
                {recetas.map((receta, index)=>(
                                    <View style={styles.card} key={index}>
                                      <RecipeCard data={receta}/>
                                    </View>
                                ))}

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
    header:{
        flexDirection:"row",
        justifyContent:"space-evenly",
        padding:20
    },
    pageTitle:{
        fontSize:24,
        fontWeight:700
    },
    card:{
        padding:5,
        alignItems:"center"
    },
    rr:{
        fontSize:20,
        fontWeight:700,
        marginBottom:15
    },
    resultTitle:{
      flexDirection:"row",
      justifyContent:"space-evenly",
      padding:20,
      
    },
    
})