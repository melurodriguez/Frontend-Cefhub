import { View, Text, Pressable, StyleSheet } from "react-native";
import {   fonts, colors } from "../utils/themes";
import { AuthContext } from "../auth/AuthContext";
import { useContext } from "react";
import { Modal } from "react-native";

export default function PopUpLogOut({visible, onClose}) {
  const {  logout } = useContext(AuthContext);


  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Estas seguro de que quieres cerrar sesión?
          </Text>
          <View style={styles.btnContainer}>
             <Pressable style={styles.btnContinue} onPress={onClose} >
              <Text style={{ fontSize: fonts.small, fontFamily:'Sora_400Regular', }}>No, continuar en la app</Text>
            </Pressable>
            <Pressable style={styles.btnLogout} onPress={()=>{logout(); onClose();}}>
              <Text style={{ fontSize: fonts.small, color: colors.white, fontFamily:'Sora_400Regular', alignSelf:"center"}}>
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
         
        </View>
      </View>
      
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    maxWidth:"90%",
    maxHeight: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: fonts.medium,
    fontFamily:'Sora_700Bold',
  },
  btnContainer:{
    //flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    //paddingVertical:20,
    margin:10
  },
  btnContinue: {
    backgroundColor: colors.backgroundColorLight,
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:15,
    margin:5,
  },
  btnLogout: {
    backgroundColor: colors.red,
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:15,
    margin:5,
    width:240
  },
});
