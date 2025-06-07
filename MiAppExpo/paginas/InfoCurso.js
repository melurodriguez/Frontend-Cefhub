import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import CardSedes from "../components/CardSedes";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import API_BASE_URL from "../utils/config";
import api from "../api/axiosInstance";
import { Alert } from "react-native"; // agregalo arriba con los imports
import { colors, fonts, sizes } from "../utils/themes";
const { height } = Dimensions.get("window"); //CAMBIAR

const cancel = require("../assets/cancel.png");
const pasteleria = require("../assets/pasteleriaCurso.png");

export default function InfoCurso({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  console.log(id);
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState(null);
  const [sedes, setSedes]=useState([])

  useEffect(() => {
    api
      .get(`/curso/${id}`)
      .then((res) => setCurso(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          //console.log("Acceso restringido", "Debes ser alumno para ver esta información");
          setError("403");
        } else if (err.response?.status === 404) {
          //console.log("Error", "Curso no encontrado");
          setError("404");
        } else {
          //console.error(err);
          setError("unknown");
        }
      });
  }, []);

  useEffect(()=>{
    api
      .get(`/curso/${id}/sedes`)
      .then((res)=>setSedes(res.data))
      .catch((err)=> {
        console.error("Error al obtener la sede: ", err.message)
        console.error(err.config?.url);
      })
  },[])

  useEffect(() => {
    if (error) {
      let title = "";
      let message = "";

      if (error === "403") {
        title = "Acceso restringido";
        message = "Debes ser alumno para ver esta información";
      } else if (error === "404") {
        title = "Error";
        message = "Curso no encontrado";
      } else {
        title = "Error";
        message = "Ocurrió un error inesperado";
      }

      Alert.alert(
        title,
        message,
        [
          {
            text: "Aceptar",
            onPress: () => {
              navigation.goBack()
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [error]);




  if (!curso || error) {
    return (
      <View style={styles.container}>
        <Text>Cargando curso...</Text>
      </View>
    );
  }




  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: `${API_BASE_URL}/static/${curso.imagen_curso_url}` }}
        resizeMode="cover"
        style={styles.imgBg}
      >
        <View>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image source={cancel} />
          </Pressable>
        </View>
      </ImageBackground>
      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{curso.nombre}</Text>
        <Text style={styles.desc}>{curso.descripcion_breve}</Text>
        <Text style={styles.objetivo}>Objetivo</Text>
        <Text style={styles.objDesc}>{curso.descripcion_completa}</Text>
        <View style={styles.card}>
          <View style={styles.innerShadow}></View>
          <Text style={styles.objetivo}>Temario</Text>
          <View>
            {curso.temas?.map((tema, index) => (
              <Text key={index} style={{margin:5, paddingHorizontal:10}} >{tema}</Text>
            ))}
          </View>
          
          
        </View>
        
        <View style={styles.card}>
          <View style={styles.innerShadow}></View>
          <Text style={styles.objetivo}>Prácticas</Text>
          <View >
            {curso.practicas?.map((practica, index) => (
              <Text key={index} style={{margin:5, paddingHorizontal:10}}>{practica}</Text>
            ))}

          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.innerShadow}></View>
          <Text style={styles.objetivo}>Insumos</Text>

          <View>
            {curso.insumos?.map((insumo, index) => (
              <Text key={index} style={{margin:5, paddingHorizontal:10}}>{insumo}</Text>
            ))}
          </View>
          

        </View>

        <View style={{flexDirection:"row", alignItems:"center", marginVertical:20, justifyContent:"space-between", marginRight:20}}>
          <Text style={styles.objetivo}>Valor del curso:</Text>
          <View style={{alignItems:"flex-end"}}>
            <Text style={styles.objetivo}>${curso.precio}ARS</Text>
          </View>
        </View>


        {sedes.map((sede, index)=>{
          <CardSedes key={index} sede={sede}/>
        })}
        

        <View style={{alignItems:"flex-end"}}>
          <Pressable style={styles.btn}><Text style={styles.btnText}>Inscribirme</Text></Pressable>
        </View>

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBg: {
    width: "100%",
    height: height * 0.3,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopStartRadius: 50,
    borderStartEndRadius: 50,
    justifyContent: "space-around",
    paddingLeft: 20,
    paddingTop: 40,
    marginTop: -(height * 0.07),
  },
  titulo: {
    fontWeight: "700",
    fontSize: 24,
    padding: 10,
  },
  desc: {
    padding: 10,
  },
  objetivo: {
    fontWeight: "700",
    fontSize: 20,
    padding: 10,
  },
  objDesc: {
    padding: 10,
  },
  btn:{
    backgroundColor:colors.primary,
    paddingHorizontal:20,
    paddingVertical:15,
    borderRadius:sizes.radius,
    justifyContent:"center",
    alignItems:"center",
    marginRight:20
  },
  btnText:{
    color:colors.white,
    fontWeight:fonts.bold,
    fontSize:fonts.medium
  },
  card:{
    flexDirection:"row", 
    alignItems:"center", 
    marginVertical:10 , 
    marginRight:20, 
    backgroundColor:colors.secondary, 
    borderRadius:sizes.radius, 
    paddingVertical:10,

    height:166
  },
  innerShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    backgroundColor: "transparent",
    zIndex: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    height: 166,
  },
});
