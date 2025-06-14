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
  FlatList,
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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const { token, user } = useContext(AuthContext);
  const [porcion, setPorcion] = useState(1);
  const [ingredientesCalc, setIngredientesCalc] = useState([]);
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);


  //obtiene receta
  useEffect(() => {
    api
      .get(`/recetas/${id}`)
      .then((res) => setReceta(res.data))
      .catch((err) => console.error(err));
    api
       .get(`/recetas/${id}/comentarios`)
       .then((res) => setComentarios(res.data))
       .catch((err) => console.error("Error al obtener comentarios:", err));
  }, []);

  /*
  useEffect(() => {
    if (receta?.porciones && receta?.ingredientes) {
      setPorcion(receta.porciones); 
      setIngredientesCalc(receta.ingredientes); 
    }
  }, [receta]);

  useEffect(() => {
    verificarLike()
  }, []);




  const agregarFavorito = async () => {
    try {
      await api.post(`user/me/recetas_favoritas/${id}`);
      const newValue=!like
      setLike(newValue);
      setPopUpVisible(true);
      console.log("agregada a favs", receta.ingredientes[0].cantidad)
    } catch (err) {
      console.error("Error al marcar como favorito:", err);
    }
  };

  const eliminarFavorito = async () => {
    try {
      await api.delete(`user/me/recetas_favoritas/${id}`);
      const newValue = !like;
      setLike(newValue);

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
  
  const sumarPorcion = () => setPorcion(prev => prev + 1);
  const restarPorcion = () => setPorcion(prev => (prev > 1 ? prev - 1 : 1));

  const verificarLike = async () => {
  try {
    console.log("Verificando favoritos...");
    const response = await api.get("user/me/recetas_favoritas");
    const ids = response.data.map(r => r.id);
    console.log("Favoritos obtenidos:", ids);
    if (favoritos.includes(String(id))) {
      setLike(true);
    }
    else {
      console.log("Receta NO está en favoritos");
      setLike(false);
    }
  } catch (err) {
    console.error("Error al verificar favoritos", err);
  }
};
*/

  function handleClick(index) {
      setPressed(index);
    }
  const ingredientes="Ingredientes"
  const instrucciones = "Instrucciones"
  const buttons = [ingredientes, instrucciones];

  //Parte comentaios funcion

  const enviarComentario = async () => {
      if (!comentario.trim()) return;

      try {
        const response = await api.post(
          `/recetas/${id}/comentarios`,
          { texto: comentario },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setComentarios((prev) => [...prev, response.data]);
        setComentario("");
      } catch (error) {
        console.error("Error al enviar comentario:", error);
      }
    };


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
          source={{ uri: `${API_BASE_URL}/static/${receta.fotoPrincipal}` }}
          style={styles.img}
          resizeMode="cover"
        >
          <View style={styles.btnContainer}>
            <Pressable onPress={() => navigation.goBack()}>
              <Image source={cancel} />
            </Pressable>

            
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
          <Text style={styles.titulo}>{receta.nombreReceta}</Text>
          <Text style={{fontFamily:'Sora_400Regular',}}>{receta.descripcionReceta}</Text>
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
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.seleccionado}>
                {isPressed === 1 ? instrucciones : ingredientes}
              </Text>
            </View>

          </View>

          
          <View>
            {isPressed === 0 &&
              receta.ingredientes?.map((i, index) => (
                <CardIngredient
                  key={index}
                  name={i.nombre_ingrediente}
                  quantity={`${i.cantidad} ${i.descripcion}`}
                  observations={i.observaciones}
                />
              ))}

            {isPressed === 1 && (
              <FlatList
                data={receta.pasos}
                horizontal
                keyExtractor={(item) => item.idPaso?.toString() ?? item.nroPaso?.toString()}
                renderItem={({ item }) => (
                  <View style={styles.instruccionesCard}>
                    <Text style={styles.instruccionesText}>Paso {item.nroPaso}</Text>
                    <Text style={{ fontFamily: 'Sora_400Regular' }}>{item.texto}</Text>

                    {item.multimedia?.length > 0 && (
                      <Image
                        source={{ uri: `${API_BASE_URL}/${item.multimedia[0].urlContenido}` }}
                        style={styles.pasoImage}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                )}
              />
            )}
          </View>


          <CardCreator alias={receta.usuarioCreador} />

          {token ? 
          <View style={{flexDirection:"row", justifyContent:"space-between", marginVertical:30, alignItems:"center", marginHorizontal:20}}>
            <View>
              <Text style={{fontWeight:fonts.bold, fontSize:fonts.medium, marginVertical:10, fontFamily:'Sora_700Bold',}}>Califica la receta!</Text>
              <View style={{flexDirection:"row", paddingVertical:10}}>

                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>
                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>
                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>
                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>
                <Pressable style={{paddingHorizontal:5}}><Image source={require('../assets/emptyStar.png')}/></Pressable>

              </View>
              
            </View>
            <View style={{flexDirection:"row"}}>
              <Text style={{paddingHorizontal:10, fontFamily:'Sora_700Bold',}}>{receta.valoracion}</Text>
              <Image source={require('../assets/star.png')}/>
            </View>
          </View>:

          <View style={{flexDirection:"row", alignItems:"flex-end"}}>
              <Text style={{paddingHorizontal:10}}>{receta.valoracion}</Text>
              <Image source={require('../assets/star.png')}/>
          </View>
          }


         {token && (
           <View style={{flexDirection:"row", paddingVertical:10}}>
             <TextInput
               placeholder="Dejá tu comentario..."
               value={comentario}
               onChangeText={setComentario}
               multiline
               style={styles.comentario}
             />
             <Pressable
               onPress={enviarComentario}
               style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 10, alignItems: "center", marginTop: 10 }}
             >
               <Text style={{ color: "white", fontFamily: 'Sora_700Bold' }}>Enviar</Text>
             </Pressable>
           </View>
         )}

          <View>
            <Text style={{fontWeight:fonts.bold, fontSize:fonts.medium, marginHorizontal:20, fontFamily:'Sora_700Bold',}}>Comentarios</Text>
            <View style={{ marginHorizontal: 20 }}>
              {comentarios.length === 0 ? (
                <Text style={{ fontFamily: 'Sora_400Regular' }}>Aún no hay comentarios.</Text>
              ) : (
                comentarios.map((c, index) => (
                  <View key={index} style={{ marginVertical: 10, backgroundColor: "#f2f2f2", padding: 10, borderRadius: 10 }}>
                    <Text style={{ fontFamily: 'Sora_700Bold' }}>{c.usuario?.alias || "Anónimo"}</Text>
                    <Text style={{ fontFamily: 'Sora_400Regular' }}>{c.texto}</Text>
                  </View>
                ))
              )}
            </View>
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
    fontFamily:'Sora_700Bold',
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
    fontFamily:'Sora_700Bold',
    fontSize: 16,
  },

  pressed: {
    backgroundColor: "#505c86",
    color: "#ffffff",
  },

  seleccionado: {
    fontFamily:'Sora_700Bold',
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

  },

  instruccionesCard:{
    backgroundColor:colors.backgroundColorLight,
    borderRadius:sizes.radius,
    padding:sizes.padding,
    marginRight:sizes.margin,
    marginVertical:sizes.margin,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instruccionesText:{
    fontFamily:'Sora_700Bold',
    fontSize:16,
    paddingVertical:sizes.padding
  }
});
