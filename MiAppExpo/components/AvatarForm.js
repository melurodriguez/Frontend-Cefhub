import { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import api from "../api/axiosInstance";
import { colors } from "../utils/themes";
import { MaterialIcons } from '@expo/vector-icons';
const welcomeIcon = require("../assets/welcomeIcon.png");
const user = require("../assets/user.png");
const user2 = require("../assets/user2.png");
const user3 = require("../assets/user3.png");
const user4 = require("../assets/user4.png");
const user5 = require("../assets/user5.png");
const user6 = require("../assets/user6.png");

const user_images_row1 = [user, user2, user3];
const user_images_row2 = [user4, user5, user6];


export default function AvatarForm({navigation, email, password}) {

  const [chosenAvatar, setChoseAvatar]=useState(0)
  const [popUpInesperado, setPopUpInesperado]= useState(false)

  const handleFourthStep= async()=>{
    try{
      console.log("Avatar elegido:", chosenAvatar);
      const res=await api.post("/register/avatar", {email:email, avatar:chosenAvatar.toString()})
      console.log("Respuesta del backend:", res)
      navigation.navigate("TipoUsuarioRegister", {email:email, password:password})
    }catch(err){
      console.log("Error al elegir el avatar: ", err)
    }
    
  }

  return (
      <View style={styles.form}>
        <Image source={welcomeIcon} style={styles.catImage} />
        <View style={styles.content}>
          <Text style={styles.title}>Elije tu avatar</Text>
          <View style={styles.row}>
            {user_images_row1.map((img, index) => (
              <Pressable
                key={index}
                style={[
                  styles.circle,
                  chosenAvatar === index && styles.selectedCircle,
                ]}
                onPress={() => setChoseAvatar(index)}
              >
                <Image source={img} style={styles.img} />
                {chosenAvatar === index && (
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color="green"
                    style={styles.checkIcon}
                  />
                )}
              </Pressable>
            ))}
          </View>
          <View style={styles.row}>
            {user_images_row2.map((img, index) => {
              const currentIndex = index + user_images_row1.length;
              return (
                <Pressable
                  key={index}
                  style={[
                    styles.circle,
                    { backgroundColor: colors.backgroundColorLight },
                    chosenAvatar === currentIndex && styles.selectedCircle,
                  ]}
                  onPress={() => setChoseAvatar(currentIndex)}
                >
                  <Image source={img} style={styles.img} />
                  {chosenAvatar === currentIndex && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color="#28a745"
                      style={styles.checkIcon}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
        <Pressable style={styles.button} onPress={handleFourthStep}>
          <Text style={styles.btnText}>Registarme</Text>
        </Pressable>
        {popUpInesperado && <PopUp action={"Error. Ocurrió un error inesperado"} visible={popUpInesperado} onClose={()=>setPopUpInesperado(false)} duration={1500}/>}

      </View>
    );
  }

const styles = StyleSheet.create({
  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 50,
    paddingHorizontal: 10,
    maxWidth:"90%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 24,
  },
  row: {
    flexDirection: "row",
    paddingTop: 20,
  },
  circle: {
    backgroundColor: "#f1f5f5",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  selectedCircle: {
    borderWidth: 3,
    borderColor: "#505c86",
  },
  img: {
    width: 60,
    height: 60,
  },
  checkIcon: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "white",  // Fondo sólido para que no sea transparente
  },
  catImage: {
    width: 132,
    height: 133,
    position: "absolute",
    top: -90,
    alignSelf: "center",
    zIndex: 1,
  },
  button: {
    backgroundColor: "#505c86",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: 277,
    height: 50,
    margin: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontFamily: "Sora_700Bold",
    fontSize: 20,
  },
});
