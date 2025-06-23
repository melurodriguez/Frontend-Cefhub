import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { sizes } from "../utils/themes";
import api from '../api/axiosInstance';

const welcomeIcon = require("../assets/welcomeIcon.png");

export default function RegistroAlumnoScreen() {
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');

  //datos que se guardan
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [tramite, setTramite] = useState('');
    const [cuentaCorriente, setCuentaCorriente] = useState('');
    const [dniFrente, setDniFrente] = useState(null);
    const [dniFondo, setDniFondo] = useState(null);


  const pickImage = async (setter) => {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la galería');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

    try {
      const res = await api.post(`/dni/upload?campo=${nombreCampo}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.url;
    } catch (error) {
      Alert.alert('Error al subir imagen', error.response?.data?.detail || error.message);
      return null;
    }
  };


  const handleSiguiente = async () => {
    try {
      const datosAlumno = {
        numeroTarjeta: numeroTarjeta,
        tramite: tramite ,
        cuentaCorriente: parseFloat(cuentaCorriente) ,
      };

      const res = await api.post('user/me/upgrade_alumno', datosAlumno);

      if (res) {
        // Subís imágenes una por una y capturás las URLs
        const dniFrenteUrl = dniFrente ? await subirImagen(dniFrente, 'dniFrente') : null;
        const dniFondoUrl = dniFondo ? await subirImagen(dniFondo, 'dniFondo') : null;

        // Si alguna imagen subió, actualizás el perfil con esas URLs
        if (dniFrenteUrl || dniFondoUrl) {
          await api.patch('/me/upgrade_alumno', {
            dniFrente: dniFrenteUrl,
            dniFondo: dniFondoUrl,
          });
        }
      }

      Alert.alert('Éxito', 'Tu perfil ha sido actualizado a alumno');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response);
    }
  };


  return (
    <View style={styles.container}>
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
        <TextInput
          placeholder="Cuenta Corriente"
          style={styles.textInput}
          keyboardType="numeric"
          value={cuentaCorriente}
          onChangeText={setCuentaCorriente}
        />

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

