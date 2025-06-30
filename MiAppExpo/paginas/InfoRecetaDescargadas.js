const favClicked = require("../assets/favClicked.png");
import * as SecureStore from 'expo-secure-store';
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
  Button ,
  Alert
} from "react-native";
import CardIngredient from "../components/CardIngredient";
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
const { width, height } = Dimensions.get("window");

export default function InfoRecetaDescargadas({ navigation }) {
  const route = useRoute();
    const { receta: recetaParam} = route.params;
    const [receta, setReceta] = useState(null);
    const [isPressed, setPressed] = useState(0);
    const [like, setLike] = useState(false);
    const [visible, setPopUpVisible] = useState(false);
    const { token, user } = useContext(AuthContext);
    const [ingredientesCalc, setIngredientesCalc] = useState([]);
    const [porciones, setPorciones] = useState(1);
    const [cantidadPersonas, setCantidadPersonas] = useState(1);

  useEffect(() => {
      if (recetaParam) {
        setReceta(recetaParam);
        setPorciones(recetaParam.porciones || 1);
        setCantidadPersonas(recetaParam.cantidadPersonas || 1);
        setIngredientesCalc(recetaParam.ingredientes || []);
      }
    }, [recetaParam]);


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

         {isPressed === 0 && (
           <>
           <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <Text style={styles.seleccionado}>Ingredientes</Text>
             {/* PORCIONES Y PERSONAS */}
             <View style={{ alignItems: 'center', marginBottom: 10 }}>
              {token &&
               <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 ,}}>
                 <Pressable
                   onPress={() => recalcularIngredientes(porciones - 1)}
                   style={[styles.btn, { paddingHorizontal: 12 }]}
                 >
                   <Text style={styles.btnText}>-</Text>
                 </Pressable>

                 <Text style={{ marginHorizontal: 15, fontSize: 18, fontFamily:"Sora_700Bold" }}>
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

         <CardCreator alias={receta.nickname}  avatar={receta.avatar}/>



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
  }

});

