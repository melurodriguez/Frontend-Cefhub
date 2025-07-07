import { View, Text, StyleSheet, Modal, Pressable , Image} from "react-native";
import React, { useEffect } from "react";
import { colors } from "../utils/themes";

export default function PopUpConexion({  visible, onClose, botones = [], image }) {
    return(

        <Modal visible={visible} transparent animationType="fade">
              <View style={styles.overlay}>
                <View style={styles.popup}>
                  {image && <Image source={image} style={styles.img}/>}
                  <Text style={styles.action}>Tipo de conexión</Text>
                  <Text style={styles.action}>Estás conectado por: Red Paga</Text>
                  <Text style={styles.action}>¿Querés guardar la receta con esta conexión?</Text>
                  <View>
                    {botones.map((btn, index) => (
                        <Pressable
                            key={index}
                            style={[
                            styles.boton,
                            btn.style === "cancel" && styles.cancelButton,
                            ]}
                            onPress={async () => {
                                if (btn.onPress) await btn.onPress(); // funciona con sync y async
                                onClose();
                            }}
                        >
                            <Text
                            style={[
                                styles.botonTexto,
                                btn.style === "cancel" && { color: "#666" },
                            ]}
                            >
                            {btn.text}
                            </Text>
                        </Pressable>
                        ))}
                  </View>
                </View>
                
              </View>
        </Modal>

    )
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
    fontSize: 15,
    alignSelf:"center",
    textAlign:"center"
  },
  btn:{
    alignSelf:"flex-end",
    //backgroundColor:colors.primary,
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:15,
    marginTop:20
  },
  btnText:{
    fontFamily:"Sora_700Bold",
    color:colors.primary
  },
  img:{
    width:50,
    height:50,
    alignSelf:"center",
    marginVertical:20,
  },
  boton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#505c86",
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#eee",
  },

});