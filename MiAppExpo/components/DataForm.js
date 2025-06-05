import { TextInput, View, Text, Image, Pressable } from "react-native";

export default function DataForm() {
  return (
    <View>
      <Text>Nombre de Usuario</Text>
      <TextInput />

      <Text>Email Registrado</Text>
      <TextInput />

      <Text>Contraseña</Text>
      <TextInput />

      <Text>Tipo Usuario</Text>
      <TextInput />

      <Text>Avatar</Text>
      <TextInput />
    </View>
  );
}
