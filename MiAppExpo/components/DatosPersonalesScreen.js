import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, Pressable, StyleSheet, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
const welcomeIcon = require("../assets/welcomeIcon.png");
import { sizes } from "../utils/themes";
const { width, height } = Dimensions.get('window');
export default function DatosPersonalesScreen({ route }) {
  const { numeroTarjeta } = route.params;

  const [dniFrente, setDniFrente] = useState(null);
  const [dniFondo, setDniFondo] = useState(null);
  const [tramite, setTramite] = useState('');

  const pickImage = async (setter) => {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la galería');
      return;
    }
    }

    console.log("Seleccionando dni...");
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
    formData.append('file', {
      uri,
      name: `${nombreCampo}.jpg`,
      type: 'image/jpeg',
    });

    try {
      const res = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.url; // Asegurate que sea el campo correcto
    } catch (error) {
      Alert.alert('Error al subir imagen', error.response?.data?.detail || error.message);
      return null;
    }
  };


  const handleSiguiente = async () => {
    try {
      const dniFrenteUrl = dniFrente ? await subirImagen(dniFrente, 'dniFrente') : null;
      const dniFondoUrl = dniFondo ? await subirImagen(dniFondo, 'dniFondo') : null;

      const datosAlumno = {
        numeroTarjeta,
        dniFrente: dniFrenteUrl,
        dniFondo: dniFondoUrl,
        tramite,
        cuentaCorriente: null,
      };

      const res = await api.post('/me/upgrade_alumno', datosAlumno);

      Alert.alert('Éxito', 'Tu perfil ha sido actualizado a alumno');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.detail || error.message);
    }
  };

   return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Image source={welcomeIcon} style={styles.img} />
          <Text style={styles.title}>Datos Personales</Text>

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
            <Text style={styles.btnText}>Siguiente</Text>
          </Pressable>

          <Text style={styles.stepText}>7/7</Text>
        </View>
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
    form: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 15,
      width: width * 0.8,
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
    row: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    imageBox: {
      backgroundColor: '#f1f5f5',
      width: '48%',
      height: 120,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    textInput: {
      width: '100%',
      height: 45,
      backgroundColor: '#f1f5f5',
      borderRadius: 15,
      paddingHorizontal: 10,
      marginBottom: 10,
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