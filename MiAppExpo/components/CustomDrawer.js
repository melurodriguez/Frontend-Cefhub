import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from "@react-navigation/drawer";
import { View , Text, Image} from "react-native";
import { colors, fonts, sizes } from "../utils/themes";
import { Ionicons } from "@expo/vector-icons";
import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import PopUpLogOut from "./PopUpLogOut";

const CustomDrawer = (props) => {

 const { navigation } = props;
 const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { logout , user} = useContext(AuthContext);

  // Función para navegar a UserData dentro del tab Perfil
  const goToUserData = () => {
    navigation.navigate("Inicio", {
      screen: "Perfil",
      params: {
        screen: "UserData",
      },
    });
  };


  return (
    <View style={{flex:1}}>
      <DrawerContentScrollView {...props} >
        <View style={{padding:20, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
          
          <Text style={{fontFamily:'Sora_700Bold', fontSize:fonts.medium, padding:20, color:"#000"}}>Menú</Text>
          <Image source={require('../assets/welcomeIcon.png')} style={{height:80, width:80}}/>
        </View>
        
        <DrawerItemList {...props} />
        { user?.tipo_usuario === "Usuario" && (
            <DrawerItem
              label="Upgrade a Alumno"
              onPress={() => navigation.navigate("RegistroAlumnoScreen")}
                icon={({ color, size }) => (
                  <Ionicons name="school-outline" size={22}color={color} />
                )}

            />
        )
        }

        {user?.tipo_usuario === "Alumno" && (
            <DrawerItem
              label="Asistencia"
              onPress={() => navigation.navigate("Asistencia")}
                icon={({ color, size }) => (
                  <Ionicons name="qr-code-outline" size={22} color={color}/>
                )}

            />

        )}

        <DrawerItem
          label="Mis Datos"
          onPress={goToUserData}
          icon={({ color, size }) => (
            <Ionicons name="server-outline" color={color} size={size} />
          )}
        />

        <DrawerItem
          label="Cerrar Sesión"
          onPress={() => setShowLogoutPopup(true)}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          )}
        />
        
      </DrawerContentScrollView>
       <PopUpLogOut
        visible={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={() => {
          setShowLogoutPopup(false);
          logout();
        }}
      />
    </View>
  );
};

export default CustomDrawer;
