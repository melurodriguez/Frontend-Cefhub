import DataForm from "../components/DataForm";
import { View, Text, Image, Pressable } from "react-native";
//reemplazar x update usuario a alumno
export default function UserData({ navigation }) {
  return (
    <View>
      <View>
        <Pressable>
          <Image />
        </Pressable>
        <Text>Mis Datos</Text>
        <Image />
      </View>
      <DataForm />
    </View>
  );
}
