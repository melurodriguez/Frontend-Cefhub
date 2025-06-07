import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ImageBackground,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import CardIngredient from "../components/CardIngredient";
import CardInstructions from "../components/CardInstructions";
import PopUp from "../components/PopUp";
import CardCreator from "../components/CardCreator";
import { useRoute } from "@react-navigation/native";
import api from "../api/axiosInstance";
import API_BASE_URL from "../utils/config";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { colors, fonts, sizes } from "../utils/themes";

const cancel = require("../assets/cancel.png");
const fav = require("../assets/fav.png");
const favClicked = require("../assets/favClicked.png");

const { width, height } = Dimensions.get("window"); //CAMBIAR

export default function InfoReceta({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  const [isPressed, setPressed] = useState(0);
  const [like, setLike] = useState(false);
  const [visible, setPopUpVisible] = useState(false);
  const [receta, setReceta] = useState(null);
  const { token } = useContext(AuthContext);
  const [porcion, setPorcion]=useState(1)
  const [ingredientesCalc, setIngredientesCalc] = useState([]);


  //obtiene receta
  useEffect(() => {
    api
      .get(`/recetas/${id}`)
      .then((res) => setReceta(res.data))
      .catch((err) => console.error(err));
  }, []);

  //carga valores iniciales receta
  useEffect(() => {
    if (receta?.porciones && receta?.ingredientes) {
      setPorcion(receta.porciones); 
      setIngredientesCalc(receta.ingredientes); 
    }
  }, [receta]);

  function parseCantidad(cantidadStr) {
    console.log(typeof cantidadStr)
    if (typeof cantidadStr !== 'string') {
    console.warn('cantidadStr no es string:', typeof cantidadStr);
    return null; // o un valor por defecto
  }

    const match = cantidadStr.match(/^([\d.,]+)\s*(.*)$/);
    if (!match) return { valor: null, unidad: cantidadStr };

    return {
      valor: parseFloat(match[1]),
      unidad: match[2] ?? "",
    };
  }

  function ajustarCantidad(cantidadStr, factor) {
    if (typeof cantidadStr !== 'string'){
      return (cantidadStr * factor).toFixed(2)
    }
    const { valor, unidad } = parseCantidad(cantidadStr);

    if (valor === null) return cantidadStr; // No se puede parsear
    const nuevoValor = (valor * factor).toFixed(2);
    return `${nuevoValor} ${unidad}`.trim();//elimina espacios en blanco al principio y al final
    
  }


 
  //ajuste de ingredientes segun porciones modificadas
  useEffect(() => {
    if (!receta) return;

    const factor = porcion / receta.porciones;

    const ingredientesAjustados = receta.ingredientes.map(i => ({
      ...i,
      cantidad: ajustarCantidad(i.cantidad, factor),
    }));

    setIngredientesCalc(ingredientesAjustados);
  }, [porcion]);




  function handleClick(index) {
    setPressed(index);
  }

  const agregarFavorito = async () => {
    try {
      await api.post(`user/me/recetas_favoritas/${id}`);
      setLike(true);
      setPopUpVisible(true);
      console.log("agregada a favs", receta.ingredientes[0].cantidad)
    } catch (err) {
      console.error("Error al marcar como favorito:", err);
    }
  };

  const eliminarFavorito = async () => {
    try {
      await api.delete(`user/me/recetas_favoritas/${id}`);
      setLike(false);
      console.log("eliminada de favs")
    } catch (err) {
      console.error("Error al eliminar de favoritos: ", err);
    }
  };

  const handleLike = async () => {
      const nuevoLike=!like
      setLike(nuevoLike);

      if (nuevoLike){
        agregarFavorito();
      }else{
        eliminarFavorito();
      }
      
  };
  
  const sumarPorcion= () =>{
    setPorcion(prev => prev + 1)
  }

  const restarPorcion =  ()=>{
    setPorcion(prev => (prev > 1 ? prev - 1 : 1))
  }


  const ingredientes = "Ingredientes";
  const instrucciones = "Instrucciones";
  const buttons = [ingredientes, instrucciones];

  if (!receta) {
    return (
      <Text
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "700",
        }}
      >
        Cargando receta...
      </Text>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: `${API_BASE_URL}/static/${receta.imagen_receta_url}` }}
          style={styles.img}
          resizeMode="cover"
        >
          <View style={styles.btnContainer}>
            <Pressable onPress={() => navigation.goBack()}>
              <Image source={cancel} />
            </Pressable>
            {token && <Pressable onPress={handleLike}>
              <Image source={like ? favClicked : fav} />
            </Pressable>}
            
          </View>

          <PopUp
            action={
              like
                ? "Se ha añadido tu receta a favoritos"
                : "Se ha eliminado tu receta de favoritos"
            }
            visible={visible}
            onClose={() => setPopUpVisible(false)}
            duration={2000}
          />
        </ImageBackground>
        <View style={styles.infoContainer}>
          <Text style={styles.titulo}>{receta.nombre}</Text>
          <Text>{receta.descripcion}</Text>
          <View style={styles.botones}>
            {buttons.map((title, index) => (
              <Pressable
                key={index}
                onPress={() => handleClick(index)}
                style={[styles.btn, isPressed === index && styles.pressed]}
              >
                <Text
                  style={[
                    styles.btnText,
                    isPressed === index && styles.pressed,
                  ]}
                >
                  {title}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <Text style={styles.seleccionado}>
            {isPressed === 1 ? instrucciones : ingredientes}
            </Text>
            <View style={{alignItems:"center", marginHorizontal:20}}>
              <Text style={styles.seleccionado}>Porciones</Text>
              <View style={{flexDirection:"row"}}> 
                <Pressable onPress={restarPorcion}><Text style={{fontWeight:"700", fontSize:24}}>-</Text></Pressable>            
                
                <Text style={{fontWeight:"700", fontSize:24, paddingRight:10, paddingLeft:10}}> {porcion}</Text>

                <Pressable onPress={sumarPorcion} ><Text style={{fontWeight:"700", fontSize:24}}>+</Text></Pressable>
                
              </View>
            </View>
            
            
          </View>
          
          <View>
            {isPressed === 0 &&
              ingredientesCalc?.map((i, index) => (
                <CardIngredient
                  key={index}
                  name={i.nombre}
                  quantity={i.cantidad}
                />
              ))}

            {isPressed === 1 &&
              receta.pasos?.map((inst, index) => (
                <CardInstructions
                  key={index}
                  desc={inst.descripcion}
                  media={inst.video_url}
                  index={index}
                />
              ))}
          </View>

          <CardCreator alias={receta.usuarioCreador} />

          <View style={{flexDirection:"row", justifyContent:"space-between", marginVertical:30, alignItems:"center", marginHorizontal:20}}>
            <View>
              <Text style={{fontWeight:fonts.bold, fontSize:fonts.medium, marginVertical:10}}>Califica la receta!</Text>
              <View style={{flexDirection:"row", paddingVertical:10}}>

                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>
                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>
                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>
                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>
                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>

              </View>
              
            </View>
            <View style={{flexDirection:"row"}}>
              <Text style={{paddingHorizontal:10}}>{receta.valoracion}</Text>
              <Image source={require('../assets/star.png')}/>
            </View>
          </View>


          <TextInput placeholder="Dejá tu comentario..." style={styles.comentario}/>

          <View>
            <Text style={{fontWeight:fonts.bold, fontSize:fonts.medium, marginHorizontal:20}}>Comentarios</Text>
          </View>
        </View>

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    width: "100%",
    height: height * 0.3,
    justifyContent: "space-between",
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopStartRadius: 50,
    borderStartEndRadius: 50,
    justifyContent: "space-around",
    paddingLeft: 20,
    paddingTop: 40,
    marginTop: -(height * 0.07),
  },

  titulo: {
    fontWeight: 700,
    fontSize: 24,
    paddingBottom: 15,
  },

  botones: {
    flexDirection: "row",
    justifyContent: "center",
    left: -20,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.03,
  },

  btn: {
    backgroundColor: "#f1f5f5",
    width: 165, //en mobile la medida puede cambiar
    height: 41,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#000",
    fontWeight: 700,
    fontSize: 16,
  },

  pressed: {
    backgroundColor: "#505c86",
    color: "#ffffff",
  },

  seleccionado: {
    fontWeight: 700,
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  comentario:{
    width:sizes.width*0.9,
    backgroundColor:colors.backgroundColorLight,
    height:200,
    borderRadius:sizes.radius,
    marginVertical:20,
  }
});
