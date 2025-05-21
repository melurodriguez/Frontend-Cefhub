import { useState } from "react";
import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import RecipeCard from "../components/recipeCard";
import CardCurso from "../components/CardCurso";

const location=require("../assets/location.png")
const menu=require("../assets/menu.png")
const user=require("../assets/user.png")
const cheesecake=require("../assets/cheesecake.png")
const star=require("../assets/star.png")
const pasteleria=require("../assets/pasteleriaCurso.png")

const recetas=[{
  titulo:"Cheesecake",
  descripcion:"Base crocante de vainilla y el relleno mas cremoso y suave.",
  img: cheesecake,
  autor:{
    usuario:"Melina",
    profilepic:user
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
    profilepic:user
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
    profilepic:user
  },
  rating:{
    puntos:4.8,
    icono:star
  }
  
}]

const cursos=[
    {
        titulo:"Titulo del Curso",
        descripcion:"Descripcion del Curso Descripcion del Curso Descripcion del Curso Descripcion del Curso",
        img:pasteleria,
        completion:"70% Completado",
        sede:{
            icono:location,
            nombre:"Sede Montserrat"
        }
    },
    {
        titulo:"Titulo del Curso",
        descripcion:"Descripcion del Curso Descripcion del Curso Descripcion del Curso Descripcion del Curso",
        img:pasteleria,
        completion:"70% Completado",
        sede:{
            icono:location,
            nombre:"Sede Montserrat"
        }
    },
    {
        titulo:"Titulo del Curso",
        descripcion:"Descripcion del Curso Descripcion del Curso Descripcion del Curso Descripcion del Curso",
        img:pasteleria,
        completion:"70% Completado",
        sede:{
            icono:location,
            nombre:"Sede Montserrat"
        }
    },
    {
        titulo:"Titulo del Curso",
        descripcion:"Descripcion del Curso Descripcion del Curso Descripcion del Curso Descripcion del Curso",
        img:pasteleria,
        completion:"70% Completado",
        sede:{
            icono:location,
            nombre:"Sede Montserrat"
        }
    }
]

export default function Profile() {

    const [pressed, setPressed]=useState(0)

    const buttons=["Mis Favoritos", "Mis Cursos"]

    function handleClick(index){
        setPressed(index)
    }


    return(
        <View>
            <View style={styles.header}>
                <Text style={styles.page}>Mi Cuenta</Text>
                <Pressable><Image source={menu}/></Pressable>
            </View>

            <View style={styles.userContainer}>
                <Image source={user}/>
                <View>
                    <Text>Mi Usuario</Text>
                    <Text>Tipo Usuario</Text>
                </View>
                
            </View>
            <View style={styles.btnContainer}>
                {buttons.map((title, index)=>(
                    <Pressable key={index} onPress={()=>handleClick(index)}>
                        <Text style={[styles.btn , pressed === index && styles.btnPressed]}>{title}</Text>
                    </Pressable>
                ))}
            </View>
            <Text style={{fontWeight:"700", fontSize:20}}>{pressed === 1 ? buttons[1] : buttons[0]}</Text>
            <View>
                {pressed === 0 && recetas.map((receta, index)=>(
                    <View key={index} style={styles.receta}>
                        <RecipeCard  data={receta}/>
                    </View>
                    
                ))}

                {pressed===1 && cursos.map((curso, index)=>(
                    <View key={index} style={styles.receta}>
                        <CardCurso data={curso}/>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        padding:20

    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:20

    },
    page:{
        fontWeight:"700",
        fontSize:24
    },
    userContainer:{
        flexDirection:"row",
        backgroundColor:"#c0c0c0",
        borderRadius:15,
        padding:10
        
    },
    btnContainer:{
        flexDirection:"row",
        justifyContent:"space-around",
        padding:20
    },
    btnPressed:{
        color:"#505c86",
        fontWeight:"700"
    },
    receta:{
        padding:10,
    },


})