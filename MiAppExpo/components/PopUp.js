import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React, { useEffect } from "react";
import { colors } from "../utils/themes";

export default function PopUp({ action, visible, onClose, duration }) {
  useEffect(() => {
    let timer;
    if (visible && duration<3000) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.action}>{action}</Text>
          {duration > 2999 && <Pressable onPress={()=>onClose()} style={styles.btn}><Text style={styles.btnText}>OK</Text></Pressable>}
        </View>
        
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    maxWidth:"90%",
  },
  action: {
    fontFamily:'Sora_700Bold',
    fontSize: 16,
  },
  btn:{
    alignSelf:"flex-end",
    backgroundColor:colors.primary,
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:15,
  },
  btnText:{
    fontFamily:"Sora_700Bold",
    color:"#fff"
  }

});
