import {View, Text, StyleSheet} from 'react-native'

export default function CardIngredient({name, quantity}) {
    return(
        <View style={styles.card}>
            <Text style={styles.n}>{name}</Text>
            <Text style={styles.d}>{quantity}</Text>
        </View>
    )
}

const styles=StyleSheet.create({
        
    card: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    n:{
        fontWeight:700,
        fontSize:16
    },
    d:{
        fontSize:16
    }
})