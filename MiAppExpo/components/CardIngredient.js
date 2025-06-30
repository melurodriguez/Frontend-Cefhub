import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { sizes } from "../utils/themes";

export default function CardIngredient({ name, quantity, unidad, onCantidadChange, editable }) {
  const [valorInput, setValorInput] = useState(quantity.toString());

  useEffect(() => {
    setValorInput(quantity.toString());
  }, [quantity]);

  const handleBlur = () => {
    const nuevaCantidad = parseFloat(valorInput);
    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0 && onCantidadChange) {
      onCantidadChange(nuevaCantidad);
    } else {
      setValorInput(quantity.toString());
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.inputRow}>
        {editable ? (
          <TextInput
            style={styles.quantityInput}
            value={valorInput}
            keyboardType="numeric"
            onChangeText={setValorInput}
            onBlur={handleBlur}
          />
        ) : (
          <Text style={styles.quantityText}>{quantity}</Text>
        )}
        <Text style={styles.unidad}> {unidad}</Text>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f1f5f5",
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: sizes.width * 0.9,
  },

  name: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 6,
    minWidth: 60,
    fontFamily: 'Sora_400Regular',
    fontSize: 16,
    color: "#666",
    marginRight: 8,
  },

  unidad: {
    fontSize: 15,
    fontFamily: 'Sora_400Regular',
  },
});

