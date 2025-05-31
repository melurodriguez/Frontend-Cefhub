import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import InfoCurso from "../paginas/InfoCurso";
import API_BASE_URL from "../utils/config";


const onPress =()=>{
    console.log("clickeada")
}
export default function CardCurso({data, onPress }) {

    return(
         <Pressable onPress={onPress } >
                    <View style={styles.innerShadow}></View>
                    <View style={styles.container}>
                        <View style={styles.fila}>
                            <View style={styles.imgContainer}>
                                <Image
                                  source={{ uri: `${API_BASE_URL}/static/${data.imagen_curso_url}` }}
                                  style={styles.img}/>
                            </View>
                            <View style={styles.cursoContainer}>
                                <Text style={styles.title}>{data.nombre}</Text>
                                <Text style={styles.desc}>{data.descripcion_breve}</Text>
                            </View>
                        </View>
                        <View>
        
                        </View>
        
                    </View>
                        
                </Pressable>
    )

}

const styles=StyleSheet.create({
     container:{
             backgroundColor:"#FFF2E5",
             padding:20,
             borderRadius:15,
             width:345,
             height:166,
             elevation: 6

         },
         imgContainer:{

         },
         img:{
             width:130,
             height:120,
             borderRadius:15
         },
         cursoContainer:{
             paddingLeft:20,
             width:200,
             height:85
         },
         title:{
             fontWeight:"700",
             flex:1,
             fontSize:14
         },
         desc:{
             fontWeight: 400,
             flex:1,
             fontSize:12
         },

         fila:{
             flexDirection:"row"
         },
         innerShadow: {
             position: 'absolute',
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             borderRadius: 15,
             backgroundColor: 'transparent',
             zIndex: 0,
             shadowColor: "#000",
             shadowOffset: { width: 0, height: 4 },
             shadowOpacity: 0.15,
             shadowRadius: 10,
             width:345,
             height:166
         },
})