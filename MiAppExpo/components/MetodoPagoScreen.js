import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Image, Pressable } from 'react-native';
const welcomeIcon = require("../assets/welcomeIcon.png");
import { sizes } from "../utils/themes";
import api from '../api/axiosInstance'; // Ajustá el path según tu estructura


export default function MetodoPagoScreen({ navigation, route }) {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSiguiente = () => {
    navigation.navigate('DatosPersonales', {
      numeroTarjeta,
      nombreTarjeta,
      vencimiento,
      cvv,
    });
  };

  return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Image source={welcomeIcon} style={styles.img} />
          <Text style={styles.title}>Método de Pago</Text>

          <TextInput
            placeholder="Número de Tarjeta"
            style={styles.textInput}
            value={numeroTarjeta}
            onChangeText={setNumeroTarjeta}
          />
          <TextInput
            placeholder="Nombre como aparece en la tarjeta"
            style={styles.textInput}
            value={nombreTarjeta}
            onChangeText={setNombreTarjeta}
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

          <Pressable style={styles.button} onPress={handleSiguiente}>
            <Text style={styles.btnText}>Siguiente</Text>
          </Pressable>

          <Text style={styles.stepText}>6/7</Text>
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
      top: -66, // para que sobresalga justo la mitad
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
