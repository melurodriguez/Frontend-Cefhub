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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardInstruccion from "../components/CardInstruccion";
import { useFocusEffect } from "@react-navigation/native";

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
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const recetaRes = await api.get(`/recetas/${id}`);
          setReceta(recetaRes.data);

          const comentariosRes = await api.get(`/recetas/${id}/calificaciones`);
          setComentarios(comentariosRes.data);

          if (token) {
            await verificarLike();
          }

          console.log("Receta obtenida:\n", JSON.stringify(recetaRes.data, null, 2));
        } catch (err) {
          console.error("Error al obtener datos de la receta:", err);
        }
      };

      fetchData();
    }, [id, token])
  );


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

         <Text style={styles.seleccionado}>
           {isPressed === 0 ? "Ingredientes" : "Instrucciones"}
         </Text>

         {isPressed === 0 &&
           receta.ingredientes?.map((i, index) => (
             <CardIngredient
               key={index}
               name={i.ingrediente}
               quantity={`${i.cantidad} ${i.unidad}`}
               observations={i.observaciones}
             />
           ))}

         {isPressed === 1 && (
           <FlatList
             data={receta.pasos}
             keyExtractor={(item) =>
               item.idPaso?.toString() ?? item.nroPaso?.toString()
             }
             renderItem={({ item }) => <CardInstruccion paso={item} />}
             contentContainerStyle={styles.flatListPadding}
           />
         )}

         <CardCreator alias={receta.nickname} />

         {token && <CalificarReceta idReceta={id} token={token} />}

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
    width: 165,
    height: 41,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
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
    marginHorizontal: 20,
  },
  comentariosLista: {
    marginHorizontal: 20,
  },
  comentariosVacio: {
    fontFamily: "Sora_400Regular",
    fontStyle: "italic",
    color: "#666",
  },
});

