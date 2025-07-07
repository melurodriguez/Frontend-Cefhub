import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ImageBackground,
  Dimensions,
  ScrollView
} from "react-native";
import CardIngredient from "../components/CardIngredient";
import CardCalificacion from "../components/CardCalificacion";
import CalificarReceta from "../components/CalificarReceta";
import PopUp from "../components/PopUp";
import CardCreator from "../components/CardCreator";
import { useRoute } from "@react-navigation/native";
import api from "../api/axiosInstance";
import API_BASE_URL from "../utils/config";
import { useContext, useCallback  } from "react";
import { AuthContext } from "../auth/AuthContext";
import { colors, fonts, sizes } from "../utils/themes";
import CardInstruccion from "../components/CardInstruccion";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native";


const cancel = require("../assets/cancel.png");
const fav = require("../assets/fav.png");
const favClicked = require("../assets/favClicked.png");
const check=require('../assets/check.png')
const likeImg=require('../assets/like.png')
const dislikeImg=require('../assets/dislike.png')
const errorImg=require('../assets/error.png')
const limit=require('../assets/limit.png')

import * as SecureStore from 'expo-secure-store';
import PopUpReemplazarReceta from "../components/PopUpReemplazarReceta";

const { width, height } = Dimensions.get("window"); //CAMBIAR
const download=require("../assets/cloud-download-outline.png")

export default function InfoReceta({ navigation }) {
  const route = useRoute();
  const { id, avatar } = route.params;
  const [isPressed, setPressed] = useState(0);
  const [like, setLike] = useState(false);
  const [visible, setPopUpVisible] = useState(false);
  const [receta, setReceta] = useState(null);
  const { token, user } = useContext(AuthContext);
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [ingredientes, setIngredientes]=useState([])
  const [conversiones, setConversiones] = useState([]);
  const [porciones, setPorciones] = useState(1);
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [ingredientesCalc, setIngredientesCalc] = useState([]);
  const [popUpExitoReemplazo, setPopUpExitoReemplazo]=useState(false)
  const [showReemplazar, setShowReemplazar]=useState(false)
  const [replaceButtons, setReplaceButtons]=useState([])
  const [popUpLimit, setPopUpLimit]=useState(false)
  const [popUpError, setPopUpError]=useState(false)
  const [popUpExito, setPopUpExito]= useState(false)

   useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          try {
            const recetaRes = await api.get(`/recetas/${id}`);
            const recetaData = recetaRes.data;
            setReceta(recetaData);
            setPorciones(recetaData.porciones || 1);
            setCantidadPersonas(recetaData.cantidadPersonas || 1);
            setIngredientesCalc(recetaData.ingredientes || []);
            const conversionesRes = await api.get("/recetas/conversiones");
            setConversiones(conversionesRes.data);
            cargarComentarios();
            if (token) {
              await verificarLike();
            }

          } catch (err) {
            console.error("Error al obtener datos de la receta:", err);
          }
        };

        fetchData();
      }, [id, token])
    );

  const cargarComentarios = async () => {
    try {
      const res = await api.get(`/recetas/${id}/calificaciones`);
      setComentarios(res.data);
    } catch (err) {
      console.error("Error al cargar comentarios", err);
    }
  };


  // Recalcular ingredientes según cantidad de porciones
  function recalcularIngredientes(nuevaPorcion) {
    if (!receta || !receta.porciones || nuevaPorcion < 1) return;

    const factor = nuevaPorcion / receta.porciones;

    const nuevosIngredientes = receta.ingredientes.map((ing) => ({
      ...ing,
      cantidad: parseFloat((ing.cantidad * factor).toFixed(2)),
    }));

    const nuevaCantidadPersonas = Math.max(1, Math.round(receta.cantidadPersonas * factor));

    setPorciones(nuevaPorcion);
    setIngredientesCalc(nuevosIngredientes);
    setCantidadPersonas(nuevaCantidadPersonas);
  }

  //RECALCULAR INGREDIENTES POR INGREDIENTE
  function actualizarPorcionesPorIngrediente(nombreIngrediente, nuevaCantidad) {
    if (!receta || !receta.ingredientes || nuevaCantidad <= 0) return;

    const original = receta.ingredientes.find(i => i.ingrediente === nombreIngrediente);
    if (!original) return;

    const factor = nuevaCantidad / original.cantidad;

    const nuevosIngredientes = receta.ingredientes.map((ing) => ({
      ...ing,
      cantidad: parseFloat((ing.cantidad * factor).toFixed(2)),
    }));

    const nuevasPorciones = Math.max(1, Math.round(receta.porciones * factor));
    const nuevaCantidadPersonas = Math.max(1, Math.round(receta.cantidadPersonas * factor));

    setIngredientesCalc(nuevosIngredientes);
    setPorciones(nuevasPorciones);
    setCantidadPersonas(nuevaCantidadPersonas);
  }

    // Guarda la receta modificada en SecureStore, máximo 10 recetas guardadas
    const guardarRecetaLocal = async () => {
      try {
        const recetasGuardadasJson = await SecureStore.getItemAsync('recetas_guardadas');
        let recetasGuardadas = recetasGuardadasJson ? JSON.parse(recetasGuardadasJson) : [];

        const indexExistente = recetasGuardadas.findIndex(r => r.id === receta.idReceta);

        const recetaParaGuardar = {
          id: receta.idReceta,
          nombreReceta: receta.nombreReceta,
          ingredientes: ingredientesCalc,
          porciones,
          cantidadPersonas,
          pasos: receta.pasos,
          descripcionReceta: receta.descripcionReceta,
          fotoPrincipal: receta.fotoPrincipal,
          nickname: receta.nickname,
          avatar:avatar,
          promedioCalificacion: receta.calificaciones.promedio
        };

        // Si ya existe
        if (indexExistente !== -1) {
            setReplaceButtons([
              {
                text: "Cancelar",
                style: "cancel"
              },
              {
                text: "Reemplazar",
                onPress: async () => {
                  recetasGuardadas[indexExistente] = recetaParaGuardar;
                  await SecureStore.setItemAsync('recetas_guardadas', JSON.stringify(recetasGuardadas));
                  setPopUpExitoReemplazo(true)
                }
              }
            ])
            setShowReemplazar(true)
          return;
        }

        // Si no existe y hay espacio
        if (recetasGuardadas.length >= 10) {
          setPopUpLimit(true)
          return;
        }

        recetasGuardadas.push(recetaParaGuardar);
        await SecureStore.setItemAsync('recetas_guardadas', JSON.stringify(recetasGuardadas));
        setPopUpExito(true)
      } catch (error) {
        console.error("Error al guardar receta localmente:", error);
        setPopUpError(true)
      }
    };



  //favoritos
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
      setPopUpVisible(true)
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

  const verificarLike = async () => {
    try {
      const response = await api.get(`user/me/recetas_favoritas/${id}`);
      setLike(response.data.is_favorite);
    } catch (err) {
      console.error("Error al verificar favoritos", err);
    }
  };




  //botones
  function handleClick(index) {
      setPressed(index);
    }

  if (!receta) {
    return (
      <Text>
        Cargando receta...
      </Text>
    );
  }

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
           {token && (
             <Pressable onPress={handleLike}>
               <Image source={like ? favClicked : fav} />
             </Pressable>
           )}
         </View>
       </ImageBackground>

       <View style={styles.infoContainer}>
         <Text style={styles.titulo}>{receta.nombreReceta}</Text>
         <Text style={styles.descripcion}>{receta.descripcionReceta}</Text>
         <View style={styles.botones}>
           {["Ingredientes", "Instrucciones"].map((title, index) => (
             <Pressable
               key={index}
               onPress={() => handleClick(index)}
               style={[styles.btn, isPressed === index && styles.pressed]}
             >
               <Text
                 style={[
                   styles.btnText,
                   isPressed === index && styles.btnTextPressed,
                 ]}
               >
                 {title}
               </Text>
             </Pressable>
           ))}
         </View>

           {token && (
             <View style={{ marginVertical: 10 }}>
               <Pressable onPress={guardarRecetaLocal} style={styles.btnDescarga}>
                <Image source={download} style={{width:30, height:30, tintColor:"#fff"}}/>
                  <Text style={styles.textDescarga}>Descargar Receta</Text>
               </Pressable>
             </View>
           )}

         {isPressed === 0 && (
           <>
           
           <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"

            
           }}>
            <Text style={styles.seleccionado}>Ingredientes</Text>
             {/* PORCIONES Y PERSONAS */}
             <View style={{ alignItems: 'center', marginBottom: 10 }}>
              {token &&
               <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginRight:5}}>
                 <Pressable
                   onPress={() => recalcularIngredientes(porciones - 1)}
                   style={[styles.btn, { paddingHorizontal: 12 }]}
                 >
                   <Text style={styles.btnText}>-</Text>
                 </Pressable>

                 <Text style={{  fontSize: 15, fontFamily:"Sora_700Bold" }}>
                   Porciones: {porciones}
                 </Text>

                 <Pressable
                   onPress={() => recalcularIngredientes(porciones + 1)}
                   style={[styles.btn, { paddingHorizontal: 12}]}
                 >
                   <Text style={styles.btnText}>+</Text>
                 </Pressable>
               </View>}
             </View>
           </View>
            
             <Text style={[styles.infoExtra, { marginTop: 5 }]}>
              Personas: {cantidadPersonas}
            </Text>
             {/* INGREDIENTES */}
             {ingredientesCalc?.map((i, index) => (
                   <CardIngredient
                     key={index}
                     name={i.ingrediente}
                     quantity={i.cantidad}
                     unidad={i.unidad}
                     onCantidadChange={
                       token
                         ? (nuevaCantidad) => actualizarPorcionesPorIngrediente(i.ingrediente, nuevaCantidad)
                         : undefined
                     }
                     editable={!!token}
                   />

             ))}

           </>
         )}


         {isPressed === 1 && (
           <>
             <Text style={styles.seleccionado}>Instrucciones</Text>
             <View style={styles.flatListPadding}>
               {receta.pasos.map((paso, index) => (
                 <CardInstruccion key={paso.idPaso ?? paso.nroPaso ?? index} paso={paso} />
               ))}
             </View>
           </>
         )}


         <CardCreator alias={receta.nickname}  avatar={avatar}/>

         {token && (
           <CalificarReceta
             idReceta={id}
             token={token}
             onCalificacionExitosa={cargarComentarios}
           />
         )}



         <View style={styles.comentariosContainer}>
           <Text style={styles.comentariosTitulo}>Comentarios</Text>
           <View style={styles.comentariosLista}>
             {comentarios.length === 0 ? (
               <Text style={styles.comentariosVacio}>
                 Aún no hay comentarios.
               </Text>
             ) : (
               comentarios.map((c, index) => (
                 <CardCalificacion
                   key={index}
                   data={c}
                 />
               ))
             )}
           </View>
         </View>
       </View>
       { like ?<PopUp action={"La receta ha sido añadida a favoritos"} visible={visible} onClose={() => setPopUpVisible(false)} duration={1500} image={likeImg}/> :
        <PopUp action={"La receta ha sido eliminada de favoritos"} visible={visible} onClose={() => setPopUpVisible(false)} duration={1500} image={dislikeImg}/>}
     </View>
     {showReemplazar && <PopUpReemplazarReceta visibile={showReemplazar} botones={replaceButtons} onClose={()=>setShowReemplazar(false)}/>}
     {popUpExitoReemplazo && <PopUp action={"Éxito. \n\nLa receta fue reemplazada correctamente."} visible={popUpExitoReemplazo} onClose={()=>setPopUpExitoReemplazo(false)} duration={2500} image={check}/>}
      {popUpLimit && <PopUp action={"Límite alcanzado. \n\nSolo podes guardar hasta 10 recetas localmente."} visible={popUpLimit} onClose={()=>setPopUpLimit(false)} duration={3000} image={limit}/>}
      {popUpError && <PopUp action={"Error. \n\nNo se pudo guardar la receta localmente"} visible={popUpError} onClose={()=>setPopUpError(false)} duration={3000} image={errorImg}/>}
      {popUpExito && <PopUp action={"Éxito. \n\nLa receta fue guardada localmente."} visible={popUpExito} onClose={()=>setPopUpExito(false)} duration={2500} image={check}/>}
    </ScrollView>
   </SafeAreaView>
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
    margin: 20,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    justifyContent: "space-around",
    paddingLeft: 20,
    paddingTop: 40,
    marginTop: -(height * 0.07),
  },
  titulo: {
    fontFamily: "Sora_700Bold",
    fontSize: 24,
    paddingBottom: 15,
  },
  descripcion: {
    fontFamily: "Sora_400Regular",
    marginRight:10
  },
  botones: {
    flexDirection: "row",
    justifyContent: "center",
    marginRight:10,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.03,
    alignSelf:"center"
  },
  btn: {
    backgroundColor: "#f1f5f5",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    paddingHorizontal:20,
    paddingVertical:10,
  },
  btnText: {
    fontFamily: "Sora_700Bold",
    fontSize: 16,
    color: "#000",
  },
  btnTextPressed: {
    color: "#fff",
  },
  pressed: {
    backgroundColor: "#505c86",
  },
  infoExtra: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
  seleccionado: {
    fontFamily: "Sora_700Bold",
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  flatListPadding: {
    paddingBottom: 20,

  },
  comentariosContainer: {
    marginTop: 20,
  },
  comentariosTitulo: {
    fontFamily: "Sora_700Bold",
    fontSize: fonts.medium,
    //marginHorizontal: 20,
  },
  comentariosLista: {
    //marginHorizontal: 20,
  },
  comentariosVacio: {
    fontFamily: "Sora_400Regular",
    fontStyle: "italic",
    color: "#666",
  },
  porcionContainer: {
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
  porcionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  porcionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  porcionBtn: {
    backgroundColor: "#505c86",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
  },
  porcionBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  porcionNumero: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  porcionSubText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  btnDescarga:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:colors.primary,
    borderRadius:15,
    padding:10,
    width:sizes.width*0.6,
  },
  textDescarga:{
    fontFamily:"Sora_700Bold",
    color:"#fff",
    fontSize:12,
    paddingHorizontal:10,
  }

});

