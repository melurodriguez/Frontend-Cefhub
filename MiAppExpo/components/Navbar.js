import { useState } from "react";
import { Pressable, View, StyleSheet, Image } from "react-native";
import HomePage from "../paginas/HomePage";
import SearchPage from "../paginas/SearchPage";

const home=require("../assets/home.svg")
const search=require("../assets/search.svg")
const notif=require("../assets/notif.svg")
const profile=require("../assets/profile.svg")



export default function Navbar() {

    const [indexPressed, setIndexPressed]=useState(null)

    function handleClick(index){
        setIndexPressed(index)

    }

    const icons=[home, search, home, notif, profile];

    return(
        <View style={styles.view}>
            {icons.map((icon, index)=>[
                <Pressable key={index} onPress={()=>handleClick(index)} style={[styles.pressable, indexPressed === index && styles.pressed]} >
                    <Image source={icon} style={[styles.image, indexPressed ===index && styles.pressedImg]}/>
                </Pressable>
            ])}
        </View>

    )
}

const styles=StyleSheet.create({
    view:{
        flexDirection:"row",
        backgroundColor:"#f9f9f9",
        height: 93,
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    image: {
        width: 30,
        height: 30,
        tintColor:"#000"
    },
    pressable:{
        padding: 10,
        borderRadius: 10
    },
    pressed: {
      backgroundColor: "#505C86",
    },
    pressedImg:{
        tintColor:"#fff"
    }
})