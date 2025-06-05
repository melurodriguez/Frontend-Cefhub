import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function LoadForm() {
  const [recipe, setRecipe] = useState({
    ingredients: [{ name: "", quantity: "" }],
    instructions: [{ descripcion: "", video_url: null, foto_url: [] }],
  });

  // Ingredientes
  function handleIngredientChange(index, field, value) {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  }

  function addIngredient() {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: "", quantity: "" }],
    });
  }

  // Pasos
  function handleStepChange(index, field, value) {
    const newInstructions = [...recipe.instructions];
    newInstructions[index][field] = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  }

  function addStep() {
    setRecipe({
      ...recipe,
      instructions: [
        ...recipe.instructions,
        { descripcion: "", video_url: null, foto_url: [] },
      ],
    });
  }

  return (
    <ScrollView style={styles.container}>
      {/* Ingredientes */}
      <View>
        <Text style={styles.sectionTitle}>Nombre del plato</Text>
        <TextInput
          style={styles.input}
          value={recipe.name}
          onChangeText={(value) => {
            handleChange("name", value);
          }}
        />
      </View>
      <View>
        <Text style={styles.sectionTitle}>Descripción del plato</Text>
        <TextInput
          style={styles.input}
          value={recipe.description}
          onChangeText={(value) => {
            handleChange("description", value);
          }}
        />
      </View>
      <View>
        <Text style={styles.sectionTitle}>Tipo de plato</Text>
        <TextInput
          style={styles.input}
          value={recipe.tipo}
          onChangeText={(value) => {
            handleChange("description", value);
          }}
        />
      </View>
      <View>
        <Text style={styles.sectionTitle}>Cantidad Porciones</Text>
        <TextInput
          style={styles.input}
          value={recipe.porciones}
          onChangeText={(value) => {
            handleChange("description", value);
          }}
        />
      </View>
      <Text style={styles.sectionTitle}>Ingredientes</Text>
      {recipe.ingredients.map((ing, i) => (
        <View key={i} style={styles.ingredientRow}>
          <TextInput
            style={[styles.input, { flex: 2, marginRight: 10 }]}
            placeholder="Nombre"
            value={ing.name}
            onChangeText={(text) => handleIngredientChange(i, "name", text)}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Cantidad"
            value={ing.quantity}
            onChangeText={(text) => handleIngredientChange(i, "quantity", text)}
          />
        </View>
      ))}
      <Pressable style={styles.addButton} onPress={addIngredient}>
        <Text style={styles.addButtonText}>+ Agregar Ingrediente</Text>
      </Pressable>

      {/* Pasos */}
      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Pasos</Text>
      {recipe.instructions.map((step, i) => (
        <View key={i} style={styles.stepContainer}>
          <TextInput
            style={[styles.input, { minHeight: 60 }]}
            placeholder={`Descripción paso ${i + 1}`}
            multiline
            value={step.descripcion}
            onChangeText={(text) => handleStepChange(i, "descripcion", text)}
          />
          {/* Botones para video y fotos (implementar pickers) */}
          <View style={styles.mediaButtons}>
            <Pressable style={styles.mediaButton} onPress={() => pickVideo(i)}>
              <Text>Agregar Video</Text>
            </Pressable>
            <Pressable style={styles.mediaButton} onPress={() => pickImages(i)}>
              <Text>Agregar Fotos</Text>
            </Pressable>
          </View>

          {/* Mostrar preview simple (ejemplo) */}
          {step.video_url ? (
            <Text style={{ color: "blue" }}>Video cargado</Text>
          ) : null}
          {step.foto_url.length > 0 && (
            <ScrollView horizontal>
              {step.foto_url.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.imagePreview} />
              ))}
            </ScrollView>
          )}
        </View>
      ))}
      <Pressable style={styles.addButton} onPress={addStep}>
        <Text style={styles.addButtonText}>+ Agregar Paso</Text>
      </Pressable>

      {/* Botón para guardar receta */}
      <Pressable
        style={styles.saveButton}
        onPress={() => {
          /* tu función aquí */
        }}
      >
        <Text style={styles.saveButtonText}>Cargar Receta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  ingredientRow: { flexDirection: "row", marginBottom: 10 },
  addButton: {
    backgroundColor: "#ddd",
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  addButtonText: { fontWeight: "bold" },
  stepContainer: { marginBottom: 20 },
  mediaButtons: { flexDirection: "row", gap: 10, marginBottom: 10 },
  mediaButton: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: { color: "white", fontWeight: "bold" },
});
