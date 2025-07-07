import React, { useContext, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { sizes } from "../utils/themes";
import api from '../api/axiosInstance';
import { ActivityIndicator } from 'react-native';
import { AuthContext } from '../auth/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import PopUp from './PopUp';

const welcomeIcon = require("../assets/welcomeIcon.png");

export default function RegistroAlumnoScreen() {

  const route = useRoute();
  const navigation= useNavigation();
  const { email } = route.params || {};
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, logout } = useContext(AuthContext);


  //datos que se guardan
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [tramite, setTramite] = useState('');
    const [cuentaCorriente, setCuentaCorriente] = useState(0);
    const [dniFrente, setDniFrente] = useState(null);
    const [dniFondo, setDniFondo] = useState(null);
    const [permisoGaleria, setPermisoGaleria]= useState(false)
    const [errorSubir, setErrorSubir]=useState(false)
    const [noToken, setNoToken]=useState(false)
    const [actualizado, setActualizado]=useState(false)
    const [desconocido, setDesconocido]=useState(false)


  const pickImage = async (setter) => {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setPermisoGaleria(true)
        //Alert.alert('Permiso denegado', 'No se puede acceder a la galería');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const subirImagen = async (uri, nombreCampo) => {
    const formData = new FormData();
    formData.append('archivo', {
      uri,
      name: `${nombreCampo}.jpg`,
      type: 'image/jpeg',
    });

    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      formData.append('email', email);
    }

    try {
      const res = await api.post(`user/dni/upload?campo=${nombreCampo}`, formData, {
        headers,
      });
      return res.data.url;
    } catch (error) {
      setErrorSubir(true)
      //Alert.alert('Error al subir imagen', error.response?.data?.detail || error.message);
      return null;
    }
    };


  const handleSiguiente = async () => {
      setLoading(true); // Activar spinner
      try {
        const datosAlumno = {
          numeroTarjeta: numeroTarjeta,
          tramite: tramite,
        };

        if (!token) {
          if (!email) {
            setNoToken(true)
            //Alert.alert('Error', 'No hay token ni email para identificar al usuario');
            return;
          }
          datosAlumno.email = email; 
        }

        await api.post('/user/me/upgrade_alumno', datosAlumno);


        if (dniFrente) await subirImagen(dniFrente, 'dniFrente');
        if (dniFondo) await subirImagen(dniFondo, 'dniFondo');

        setActualizado(true)

        if (token) {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginPage" }],
          });
        } else {
          navigation.navigate("LoginPage");
        }

      } catch (error) {
        console.error(error);
        setDesconocido(true)
        //Alert.alert('Error', error.response?.data?.detail || 'Error desconocido');
      } finally {
        setLoading(false);
      }
  };



  return (
    <View style={styles.container}>
       {loading && (
           <View style={styles.loadingOverlay}>
             <ActivityIndicator size="large" color="#000" />
           </View>
         )}
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.img} />
        <Text style={styles.title}>Registro Alumno</Text>

        {/* DATOS TARJETA */}
        <TextInput
          placeholder="Número de Tarjeta"
          style={styles.textInput}
          value={numeroTarjeta}
          onChangeText={setNumeroTarjeta}
        />
        <View style={styles.row}>
          <TextInput
            placeholder="Vencimiento"
            style={[styles.textInput, { flex: 1, marginRight: 5 }]}
            value={vencimiento}
            onChangeText={setVencimiento}
          />
          <TextInput
            placeholder="CVV"
            style={[styles.textInput, { flex: 1, marginLeft: 5 }]}
            value={cvv}
            onChangeText={setCvv}
          />
        </View>

        {/* DATOS PERSONALES */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setDniFrente)}>
            {dniFrente ? (
              <Image source={{ uri: dniFrente }} style={styles.image} />
            ) : (
              <Text>Frente DNI</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setDniFondo)}>
            {dniFondo ? (
              <Image source={{ uri: dniFondo }} style={styles.image} />
            ) : (
              <Text>Dorso DNI</Text>
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Número de trámite"
          style={styles.textInput}
          value={tramite}
          onChangeText={setTramite}
        />
        <Pressable style={styles.button} onPress={handleSiguiente}>
          <Text style={styles.btnText}>Finalizar</Text>
        </Pressable>

      </View>
      {actualizado && <PopUp action={"Éxito. Tu perfil ha sido actualizado a alumno"} visible={actualizado} onClose={()=>setActualizado(false)} duration={3000}/>}
      {desconocido && <PopUp action={"Error desconocido."} visible={desconocido} onClose={()=>setDesconocido(false)} duration={1500}/>}
      {noToken && <PopUp action={"Error. No hay token para identificar al usuario"} visible={noToken} onClose={()=>setNoToken(false)} duration={1500}/>}
      {errorSubir && <PopUp action={"Error al subir imagen."} visible={errorSubir} onClose={()=>setErrorSubir(false)} duration={1500}/>}
      {permisoGaleria && <PopUp action={"Permiso denegado. No se puede acceder a la galería." } visible={permisoGaleria} onClose={()=>setPermisoGaleria(false)} duration={3000}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8CBB7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    width: sizes.width * 0.8,
    padding: 20,
    paddingTop: 80,
    position: 'relative',
  },
  img: {
    width: 132,
    height: 133,
    position: 'absolute',
    top: -66,
    zIndex: 1,
  },
  title: {
    fontFamily: 'Sora_700Bold',
    fontSize: 24,
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    height: 45,
    backgroundColor: '#f1f5f5',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  imageBox: {
    width: '48%',
    height: 100,
    backgroundColor: '#f1f5f5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  button: {
    backgroundColor: '#505c86',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 277,
    height: 50,
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
  },
  stepText: {
    marginTop: 10,
    color: '#555',
  },
});

