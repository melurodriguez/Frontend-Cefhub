import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from "@react-navigation/drawer";
import { View , Text, Image} from "react-native";
import { colors, fonts, sizes } from "../utils/themes";
import { Ionicons } from "@expo/vector-icons";

const CustomDrawer = (props) => {

 const { navigation } = props;

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
          
          <Text style={{fontFamily:'Sora_700Bold', fontSize:fonts.medium, padding:20}}>Menú</Text>
          <Image source={require('../assets/welcomeIcon.png')} style={{height:80, width:80}}/>
        </View>
        
        <DrawerItemList {...props} />

        <DrawerItem
          label="Mis Datos"
          onPress={goToUserData}
          icon={({ color, size }) => (
            <Ionicons name="server-outline" color={color} size={size} />
          )}
        />
        
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;
