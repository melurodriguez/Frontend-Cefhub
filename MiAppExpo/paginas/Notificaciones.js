import {StyleSheet, View, Text, Image} from 'react-native'
import CardNotification from '../components/CardNotification'
import {sizes, fonts, colors} from '../utils/themes'
import { notifUserId } from '../backend/notifController'
import { FlatList } from 'react-native'
import AuthContext from '../auth/AuthContext'
import { useContext } from 'react'

const notifCat=require("../assets/notifCat.png")
//const { notifications } = useContext(AuthContext);


export default function Notificaciones({navigation}) {
    return(
        <FlatList 
            contentContainerStyle={styles.container}
            data={notifications}
            keyExtractor={(item)=> item.id.toString()}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Image source={notifCat} style={styles.catImage}/>
                    <Text style={styles.title}>Notificaciones</Text>
                </View>
            }
            renderItem={({item})=>(
                <CardNotification media={item.media} subject={item.subject}/>

            )}
            
        />
        
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"

    },
    header:{
        flexDirection:"row",
        justifyContent:"space-evenly",
        paddingVertical:20
    },
    title:{
        fontWeight:fonts.bold,
        fontSize:fonts.large
    },
    catImage:{
        width:80,
        height:80
    }
})