import { useState, useEffect } from "react"
import { StyleSheet, View, Text, Image, Pressable, ImageBackground,Dimensions, ScrollView  } from "react-native"
import CardIngredient from "../components/CardIngredient"
import CardInstructions from "../components/CardInstructions"
import PopUp from "../components/PopUp"
import CardCreator from "../components/CardCreator"
import { useRoute } from '@react-navigation/native';
import axios from "axios"
import API_BASE_URL from "../utils/config"

const cancel=require("../assets/cancel.png")
const fav=require("../assets/fav.png")
const favClicked=require("../assets/favClicked.png")


const {width, height}=Dimensions.get('window') //CAMBIAR

export default function InfoReceta({ navigation}) {
    const route = useRoute();
    const { id } = route.params;

    const[receta, setReceta]=useState(null)

    useEffect(() => {
        axios.get(`${API_BASE_URL}/recetas/${id}`)
            .then(res => setReceta(res.data))
            .catch(err => console.error(err));
    }, []);

    const [isPressed,setPressed]=useState(0);
    const[like, setLike]=useState(false);
    const[visible, setPopUpVisible]=useState(false);

    function handleClick(index){
        setPressed(index)
    }

    const handleLike = async ()=>{
        try{
            const res= await fetch(`${API_BASE_URL}/me/recetas_favoritas/${receta.id}`)
            setLike(!like)
            setPopUpVisible(!visible)

        } catch (err) {
            console.error('Error al marcar como favorito:', err);
        }

        
    }


    const ingredientes="Ingredientes"
    const instrucciones="Instrucciones"
    const buttons=[ingredientes, instrucciones]
   
    if (!receta) {
    return <Text style={{justifyContent:"center", alignItems:"center", fontWeight:"700"}}>Cargando receta...</Text>; 
    }


    return(
        <ScrollView>
             <View style={styles.container}>
            
            
            
            <ImageBackground source={receta.imagen_receta_url} style={styles.img} resizeMode="cover">
                <View style={styles.btnContainer}>
                    <Pressable onPress={()=>navigation.goBack()}><Image source={cancel}/></Pressable>
                    <Pressable onPress={handleLike} ><Image source={like ? favClicked : fav}/></Pressable>
                </View>
                
                <PopUp 
                    action={like ? "Se ha añadido tu receta a favoritos" : "Se ha eliminado tu receta de favoritos"} 
                    visible={visible} 
                    onClose={() => setPopUpVisible(false)} 
                    duration={2000}
                />
                
            </ImageBackground>
            <View style={styles.infoContainer}>

                <Text style={styles.titulo}>{receta.nombre}</Text>
                <Text>{receta.descripcion}</Text>
                <View style={styles.botones}>
                    {buttons.map((title, index)=>(
                        <Pressable key={index} onPress={()=>handleClick(index)} style={[styles.btn, isPressed === index && styles.pressed]}>
                            <Text style={[styles.btnText, isPressed === index && styles.pressed]}>{title}</Text>
                        </Pressable>

                    ))}
                    
                </View>
                <Text style={styles.seleccionado}>{isPressed === 1 ? instrucciones : ingredientes}</Text>
                <View>
                    {isPressed === 0 && receta.ingredientes?.map((i, index)=>(
                        <CardIngredient key={index} name={i.nombre} quantity={i.cantidad}/>
                    )) }

                    {isPressed === 1 && receta.pasos?.map((inst, index)=>(
                        <CardInstructions key={index} desc={inst.descripcion} media={inst.video_url} index={index}/>
                    ))}

                </View>

                <CardCreator alias={receta.usuarioCreador}/>
            </View>
           

        </View>
        </ScrollView>
       
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    img:{
        width:"100%",
        height: height*0.3,
        justifyContent:"space-between"
    },
        
    btnContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
    },
    infoContainer:{
        flex:1,
        backgroundColor:"#ffffff",
        borderTopStartRadius:50,
        borderStartEndRadius:50,
        justifyContent:"space-around",
        paddingLeft:20,
        paddingTop:40,
        marginTop: -(height*0.07),
    },

    titulo:{
    fontWeight:700,
    fontSize:24,
    paddingBottom:15,
    },

    botones:{
        flexDirection:"row",
        justifyContent:"center",
        left:-20,
        paddingTop:height*0.03,
        paddingBottom:height*0.03
    },
    
    btn:{
        backgroundColor:"#f1f5f5",
        width:165,    //en mobile la medida puede cambiar
        height:41,
        borderRadius:15,
        alignItems:"center",
        justifyContent:"center",
    },
    btnText:{
        color:"#000",
        fontWeight:700,
        fontSize:16
    },

    pressed:{
        backgroundColor:"#505c86",
        color:"#ffffff"
    },

    seleccionado:{
        fontWeight:700,
        fontSize:20,
        paddingTop:20,
        paddingBottom:20
    }

})