import { ImageBackground, StyleSheet, View, Text, Dimensions, Pressable, Image } from "react-native";
import CardSedes from "../components/CardSedes";


const {height}=Dimensions.get('window') //CAMBIAR

const cancel=require('../assets/cancel.png')
const pasteleria=require('../assets/pasteleriaCurso.png')

export default function InfoCurso() {



    const sedes=[
        {
            id:1,
            sede:"Sede Montserrat",
            direccion:{
                calle: "Lima",
                altura: "707"
            },
            telefono:"11111111",
            correo:"ejemplo@gmail.com"
        },
        {
            id:2,
            sede:"Sede Montserrat",
            direccion:{
                calle: "Lima",
                altura: "707"
            },
            telefono:"11111111",
            correo:"ejemplo@gmail.com"

        },
        {
            id:3,
            sede:"Sede Montserrat",
            direccion:{
                calle: "Lima",
                altura: "707"
            },
            telefono:"11111111",
            correo:"ejemplo@gmail.com"
        }
    ]
    



    return(
        <View style={styles.container}>
            <ImageBackground source={pasteleria} resizeMode="cover" style={styles.imgBg}>
                <View>
                    <Pressable><Image source={cancel}/></Pressable>                   
                </View>
            </ImageBackground>
            <View style={styles.infoContainer}>
                <Text style={styles.titulo}>Nombre del Curso</Text>
                <Text style={styles.desc}>Descripcion del curso Descripcion del curso Descripcion del curso Descripcion del curso Descripcion del curso</Text>
                <Text style={styles.objetivo}>Objetivo</Text>
                <Text style={styles.objDesc}>Brindar a los participantes los conocimientos y técnicas fundamentales de la pastelería clásica y moderna, para que puedan elaborar una variedad de tortas, tartas, masas y postres con precisión y creatividad. 
                El curso apunta a desarrollar habilidades prácticas que permitan tanto iniciarse en el mundo de la pastelería como perfeccionar lo aprendido, fomentando la confianza y el disfrute en cada preparación.</Text>


                {sedes.map((sede, index)=>(
                    <CardSedes key={sede.id} sede={sede} />
                ))}


            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex: 1,
    },
    imgBg:{
        width:"100%",
        height: height*0.3,

    },
    infoContainer:{
        flex:1,
        backgroundColor:"#fff",
        borderTopStartRadius:50,
        borderStartEndRadius:50,
        justifyContent:"space-around",
        paddingLeft:20,
        paddingTop:40,
        marginTop: -(height*0.07),
    },
    titulo:{
        fontWeight:"700",
        fontSize:24,
        padding:10
    },
    desc:{
        padding: 10
    },
    objetivo:{
        fontWeight:"700",
        fontSize:20,
        padding:10
    },
    objDesc:{
        padding:10
    }
})