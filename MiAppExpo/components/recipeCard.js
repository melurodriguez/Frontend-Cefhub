import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import API_BASE_URL from "../utils/config";
const star=require("../assets/star.png")
const userIcon=require("../assets/user.png")



export default function RecipeCard({data, onPress, navigation }) {
    return (
        <Pressable onPress={onPress} >
          <View style={styles.innerShadow}></View>
          <View style={styles.container}>
            <View style={styles.fila}>
              <View style={styles.imgContainer}>
                <Image
                  source={{ uri: `${API_BASE_URL}/static/${data.imagen_receta_url}` }}
                  style={styles.img}
                />
              </View>
              <View style={styles.recipeContainer}>
                <Text style={styles.title}>{data.nombre}</Text>
                <Text style={styles.desc}>{data.descripcion}</Text>
              </View>
            </View>

            <View style={styles.fila}>
              <View style={styles.userInfo}>
              <Image source={userIcon} style={{width:20, height:20}}/>
                <Text style={{ paddingLeft: 10, fontSize: 12 }}>
                  {data.usuarioCreador}
                </Text>
              </View>

              <View style={styles.rating}>
                <Text style={{ paddingRight: 10 }}>
                  {data.valoracion !== null ? data.valoracion.toFixed(1) : "—"}
                </Text>
                <Image source={star}/>
              </View>
            </View>
          </View>
        </Pressable>
      );
};

const styles= StyleSheet.create({

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
        width:116,
        height:83,
        borderRadius:15
    },
    recipeContainer:{
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
    rating:{
        paddingTop:20,
        alignContent:"flex-end",
        flexDirection:"row"
    },
    userInfo:{
        paddingTop:20,
        flex:2,
        alignContent:"flex-start",
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
});