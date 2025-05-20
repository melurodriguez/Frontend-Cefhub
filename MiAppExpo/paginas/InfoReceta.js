import { useState } from "react"
import { StyleSheet, View, Text, Image, Pressable, ImageBackground,Dimensions  } from "react-native"
import CardIngredient from "../components/CarIngredient"
import CardInstructions from "../components/CardInstructions"
import PopUp from "../components/PopUp"
import CardCreator from "../components/CardCreator"

const medialunas=require("../assets/medialunas.avif")
const cancel=require("../assets/cancel.svg")
const fav=require("../assets/fav.svg")
const favClicked=require("../assets/favClicked.svg")
const paso1=require('../assets/paso1.avif')

const {width, height}=Dimensions.get('window')

export default function InfoReceta() {


    const [isPressed,setPressed]=useState(0);
    const[like, setLike]=useState(false);
    const[visible, setPopUpVisible]=useState(false);

    function handleClick(index){
        setPressed(index)
    }

    function handleLike(){
        setLike(!like)
        setPopUpVisible(!visible)
    }


    const ingredientes="Ingredientes"
    const instrucciones="Instrucciones"
    const buttons=[ingredientes, instrucciones]
    const ingredients=[
        {
            id:1,
            name:"Harina",
            quantity:"250 gr"
        },
        {
            id:2,
            name:"Azucar",
            quantity:"100 gr"
        },
        {
            id:3,
            name:"Manteca",
            quantity:"50 gr"
        },
        {
            id:4,
            name:"Huevos",
            quantity:"3 unidades"
        }
    ]
    const instructions=[
        {
            id:1,
            instruccion:"paso 1 paso 1 paso 1 paso 1 paso 1 paso 1 paso 1 paso 1",
            media:paso1,
        },
        {
            id:2,
            instruccion:"paso 1 paso 1 paso 1 paso 1 paso 1 paso 1 paso 1 paso 1",
            media:paso1,
        },
        {
            id:3,
            instruccion:"paso 1 paso 1 paso 1 paso 1 paso 1 paso 1 paso 1 paso 1",
            media:paso1,
        },
        {
            id:4,
            instruccion:"paso 1 paso 1 paso 1 paso 1 paso 1 paso 1 paso 1 paso 1",
            media:paso1,
        }
    ]

    return(
        <View style={styles.container}>
            
            
            <ImageBackground source={medialunas} style={styles.img} resizeMode="cover">
                <View style={styles.btnContainer}>
                    <Pressable><Image source={cancel}/></Pressable>
                    <Pressable onPress={handleLike} ><Image source={like ? favClicked : fav}/></Pressable>
                </View>
                
                {like && <PopUp action={"Se ha añadido tu receta a favoritos"} visible={visible} onClose={()=>setPopUpVisible(false)}  duration={2000} />}
                { !like && <PopUp action={"Se ha eliminado tu receta de favoritos"} visible={visible} onClose={()=>setPopUpVisible(false)}  duration={2000}/>}
                
            </ImageBackground>
            <View style={styles.infoContainer}>

                <Text style={styles.titulo}>Titulo de la Receta</Text>
                <Text>Descripcion de la receta Descripcion de la receta Descripcion de la receta Descripcion de la receta</Text>
                <View style={styles.botones}>
                    {buttons.map((title, index)=>[
                        <Pressable key={index} onPress={()=>handleClick(index)} style={[styles.btn, isPressed === index && styles.pressed]}>
                            <Text style={[styles.btnText, isPressed === index && styles.pressed]}>{title}</Text>
                        </Pressable>

                    ])}
                    
                </View>
                <Text style={styles.seleccionado}>{isPressed === 1 ? instrucciones : ingredientes}</Text>
                <View>
                    {isPressed === 0 && ingredients.map((i, index)=>(
                        <CardIngredient key={i.id} name={i.name} quantity={i.quantity}/>
                    )) }

                    {isPressed === 1 && instructions.map((inst, index)=>(
                        <CardInstructions key={inst.id} desc={inst.instruccion} media={inst.media} index={index}/>
                    ))}

                </View>

                <CardCreator/>
            </View>
           

        </View>
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
        width:width*0.1,    //en mobile la medida puede cambiar
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