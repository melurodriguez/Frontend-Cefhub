import { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, Image, Pressable} from "react-native";
import axios from 'axios';

import RecipeCard from "../components/recipeCard";
import CardCurso from "../components/CardCurso";
import { ScrollView } from "react-native";
import API_BASE_URL from '../utils/config.js' ///ACA IMPORTA EL URL PARA PEGARLE AL ENDPOINT
import SideMenu from "../components/CustomDrawer.js";
import { colors } from "../utils/themes.js";

const menu=require("../assets/menu.png")
const searchIcon=require("../assets/search.png")
const filter=require("../assets/filter.png")
const backArrow=require('../assets/backArrow.png')




export default function SearchPage({navigation}) {
    const [search, setSearch] = useState('');
    const [recetas, setRecetas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [visible, setVisible]=useState(false);//prueba del sidemenu

          useEffect(() => {
              axios.get(`${API_BASE_URL}/recetas`)
                .then((res) => setRecetas(res.data))
                .catch((err) => {
                  console.error("Error al obtener recetas:", err);
                });
            }, []);

            useEffect(() => {
              axios.get(`${API_BASE_URL}/curso`)
                .then((res) => setCursos(res.data))
                .catch((err) => {
                  console.error("Error al obtener cursos:", err);
                });
            }, []);

    const searchRecipe= async ()=>{
      try{
        const res= await fetch(`${API_BASE_URL}/recetas?q=${search}`)
        const data= await res.json()
        setRecetas(data)
        console.log('receta traida')
      }catch(error){
        console.error("Error al buscar recetas: ", error )
      }
    }

    const handleMenu=()=>{
      setVisible(!visible)
    }
    
    const searchCurso = async(curso) =>{
      try{
        const res=await axios.get(`${API_BASE_URL}/curso/${curso.id}`)
        const data= await res.json()
        
      }catch(err){

      }
    }



    return(
        <ScrollView>
            <View style={styles.header}>
                <Pressable onPress={()=>navigation.goBack()}><Image source={backArrow} style={{tintColor:colors.black}}/></Pressable>
                <Text style={styles.pageTitle}>Búsqueda</Text>
                <Pressable onPress={handleMenu}><Image source={menu}></Image></Pressable>
                { visible && <SideMenu/>}
            </View>
            
            <View style={styles.resultTitle}>
               <TextInput value={search} placeholder="Search" onChangeText={setSearch} style={styles.input}></TextInput>
               <Pressable onPress={searchRecipe}><Image source={searchIcon} style={{tintColor:"#000"}}/></Pressable>
            </View>

            <View>
              <View style={styles.resultTitle}>
                <Text style={styles.rr}>Recetas Recientes</Text>
                <Pressable onPress={() => navigation.navigate('TodasRecetas')}>
                    <Text style={styles.verTodos}>Ver todos →</Text>
                 </Pressable>
             </View>
                
                {recetas.slice(0, 3).map((receta, index) => (
                  <View style={styles.card} key={index}>
                    <RecipeCard
                      data={receta}
                      onPress={() => navigation.navigate('InfoReceta', { id:receta.id })}
                    />
                  </View>
                ))}

            </View>
            <View>
              <View style={styles.resultTitle}>
                <Text style={styles.rr}>Cursos Populares</Text>
                <Pressable onPress={() => navigation.navigate('TodosCursos')}>
                    <Text style={styles.verTodos}>Ver todos →</Text>
                </Pressable>
              </View>

                {cursos.slice(0, 3).map((curso, index) => (
                  <View style={styles.card} key={index}>
                      <CardCurso
                        data={curso}
                        onPress={()=>navigation.navigate('InfoCurso', { curso })} 
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