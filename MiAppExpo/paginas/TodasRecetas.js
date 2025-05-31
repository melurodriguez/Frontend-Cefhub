import { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, Image, Pressable} from "react-native";
import axios from 'axios';
import { colors } from "../utils/themes.js";

import RecipeCard from "../components/recipeCard";
import { ScrollView } from "react-native";

const menu=require("../assets/menu.png")
const searchIcon=require("../assets/search.png")
const filter=require("../assets/filter.png")
const backArrow=require('../assets/backArrow.png')

import API_BASE_URL from '../utils/config.js' ///ACA IMPORTA EL URL PARA PEGARLE AL ENDPOINT


export default function TodasRecetas({navigation}) {



    const [search, setSearch] = useState('');
    const [recetas, setRecetas] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

              useEffect(() => {
                axios.get(`${API_BASE_URL}/recetas`)
                  .then((res) => setRecetas(res.data))
                  .catch((err) => {
                    console.error("Error al obtener recetas:", err);
                  });
              }, []);


        return(
            <ScrollView>
                <View style={styles.header}>
                    <Pressable onPress={()=>navigation.goBack()}><Image source={backArrow} style={{tintColor:colors.black}}/></Pressable>
                    <Text style={styles.pageTitle}>Búsqueda</Text>
                    <Pressable><Image source={menu}></Image></Pressable>

                </View>

                <View style={styles.resultTitle}>
                   <TextInput value={search} placeholder="Search" onChangeText={setSearch} style={styles.input}></TextInput>
                   <Pressable><Image source={searchIcon} style={{tintColor:"#000"}}/></Pressable>
                </View>

                <View>
                  <View style={styles.resultTitle}>
                    <Text style={styles.rr}>Recetas Disponibles</Text>
                    <Pressable onPress={() => setShowFilters(!showFilters)}>
                         <Image source={filter} style={styles.filterIcon} />
                    </Pressable>
                  </View>

                    {recetas.map((receta, index) => (
                                      <View style={styles.card} key={index}>
                                        <RecipeCard
                                          data={receta}
                                          onPress={() => navigation.navigate('InfoReceta', { receta })}
                                        />
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
            width:330,
            borderColor: '#d9d9d9',
            borderWidth: 1,
            paddingHorizontal: 15,
            borderRadius:15,
            backgroundColor:"#f1f5f5"
        },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        padding:10,
        marginBottom:10,
        marginTop:40
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
          justifyContent:"space-between",
          alignItems: "center",
          padding:20
    },

})