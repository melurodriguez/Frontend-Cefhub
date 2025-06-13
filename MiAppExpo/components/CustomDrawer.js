import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View , Text, Image} from "react-native";
import { colors, fonts, sizes } from "../utils/themes";

const CustomDrawer = (props) => {
  return (
    <View style={{flex:1}}>
      <DrawerContentScrollView {...props} >
        <View style={{padding:20, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
          
          <Text style={{fontFamily:'Sora_700Bold', fontSize:fonts.medium, padding:20}}>Menú</Text>
          <Image source={require('../assets/welcomeIcon.png')} style={{height:80, width:80}}/>
        </View>
        
        <DrawerItemList {...props} />
        
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;
