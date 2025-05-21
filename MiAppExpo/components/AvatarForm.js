import {View, Text, Image, StyleSheet, Pressable} from 'react-native'

const welcomeIcon=require('../assets/welcomeIcon.png')
const user=require('../assets/user.png')
const user2=require('../assets/user2.png')
const user3=require('../assets/user3.png')
const user4=require('../assets/user4.png')
const user5=require('../assets/user5.png')
const user6=require('../assets/user6.png')

const user_images_row1=[user, user2, user3]
const user_images_row2=[ user4, user5,user6]


export default function AvatarForm() {
    return(
        <View style={styles.container}>
            <View style={styles.form}>
                <Image source={welcomeIcon}/>
                <View style={styles.content}>
                    <Text style={styles.title}>Elije tu avatar</Text>
                    <View style={styles.row}>
                        {user_images_row1.map((img,index)=>(
                            <Pressable key={index} style={styles.circle}><Image source={img} style={styles.img}/></Pressable>
                        ))}

                    </View>
                    <View style={styles.row}>
                       {user_images_row2.map((img,index)=>(
                            <Pressable key={index} style={styles.circle}><Image source={img} style={styles.img}/></Pressable>
                        ))}

                    </View>
                </View>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems:"center",

    },
    form:{
        justifyContent:"center",
        alignItems:"center"

    },
    content:{
        justifyContent:"center",
        alignItems:"center"

    },
    title:{
        fontWeight:"700",
        fontSize:24
    },
    row:{
        flexDirection:"row",
        paddingTop:20
    },
    circle:{
        backgroundColor:"#f1f5f5",
        borderRadius:50,
        width:80,
        height:80,
        justifyContent:"center",
        alignItems:"center",
        margin:20
    },
    img:{
        width:60,
        height:60
    }
    
})