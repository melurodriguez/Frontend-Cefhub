import { ScrollView } from 'react-native-web';
import RecipeCard from '../components/recipeCard';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
const welcomeIcon=require("../assets/welcomeIcon.svg");
const userIcon=require("../assets/user.svg")
const star=require("../assets/star.svg")
const cheesecake=require("../assets/cheesecake.jpg")

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





export default function HomePage({navigation}) {



  return(
      <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
              <Text style={styles.p}>¡Bienvenido a ChefHub!</Text>
              <Image source={welcomeIcon} style={{width:100, height:100}}/>
          </View>
          <View style={styles.line}></View>
          <Text style={styles.rr}>Recetas Recientes</Text>
      
            {recetas.map((receta, index)=>(
                  <Pressable style={styles.card} key={index} onPress={()=>navigation.navigate('InfoReceta')}>
                    <RecipeCard data={receta}/>
                  </Pressable>
              ))}

      </ScrollView>
        
              
  )
}

const styles= StyleSheet.create({
    rr:{
        fontSize:20,
        fontWeight:700,
        marginBottom:15
    },
    line:{
        backgroundColor:"#d9d9d9",
        width:357,
        height:1,
        marginBottom:20
    },
    header:{
        justifyContent:"center",
        alignItems:"center",
        marginBottom:40
    },
    p:{
        color:"#000",
        fontWeight: "700",
        padding:20,
        fontSize:24,
    },
    card:{
        padding:5
    },
    container:{
      justifyContent:"center",
      alignItems:"center"
    }

})