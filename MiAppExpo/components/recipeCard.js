import { View, Image, StyleSheet, Text, Pressable } from "react-native";

const handleClick=()=>{
    console.log("clickeada")
}

export default function RecipeCard({data}) {
    return(
        <Pressable onPress={handleClick()} >
            <View style={styles.innerShadow}></View>
            <View style={styles.container}>
                <View style={styles.fila}>
                    <View style={styles.imgContainer}>
                        <Image source={data.img} style={styles.img}/>
                    </View>
                    <View style={styles.recipeContainer}>
                        <Text style={styles.title}>{data.titulo}</Text>
                        <Text style={styles.desc}>{data.descripcion}</Text>
                    </View>
                </View>
                <View>

                </View>
                <View style={styles.fila}>
                    <View style={styles.userInfo}>
                        <Image source={data.autor.profilepic} style={{width:20, height:20}}/>
                        <Text style={{paddingLeft:10, fontSize:12}}>{data.autor.usuario}</Text>
                    </View>
                    
                    <View style={styles.rating}>
                        <Text style={{paddingRight:10}}>{data.rating.puntos}</Text>
                        <Image source={data.rating.icono}/>
                    </View>
                
                </View>

            </View>
                
        </Pressable>
        
    )
};

const styles= StyleSheet.create({

    container:{
        backgroundColor:"#FFF2E5",
        padding:20,
        borderRadius:15,
        width:345,
        height:166,

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
        fontSize:16
    },
    desc:{
        fontWeight:"400",
        flex:1,
        fontSize:14
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