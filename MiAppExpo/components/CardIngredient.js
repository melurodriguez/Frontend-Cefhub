import {View, Text, StyleSheet} from 'react-native'

export default function CardIngredient({name, quantity}) {
    return(
        <View style={styles.card}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.quantity}>    {quantity}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f1f5f5',
        marginVertical: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

        name: {
            fontWeight: 'bold',
            fontSize: 16,
            color: '#333',
            marginBottom: 10,
        },
        quantity: {
            fontSize: 15,
            color: '#666',

        },
});