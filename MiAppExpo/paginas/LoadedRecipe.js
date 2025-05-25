import {View, Image, Pressable, Text} from 'react-native'

const flyingCat=require('../assets/flyingCat.png')

export default function LoadedRecipe({navigation}) {
    return(
        <View>
            <Text>¡Listo! La solicitud de tu receta ha sido enviada.</Text>
            <Image source={flyingCat}/>
            <Text>Te enviaremos una notificacion con su estado de aprobación a la brevedad</Text>
            <Pressable onPress={()=>navigation.navigate('Menú')}><Text>Volver al inicio</Text></Pressable>
        </View>
    )
}