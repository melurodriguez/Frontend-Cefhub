import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../api/axiosInstance";

export default function LoadForm() {
  const [camposHabilitados, setCamposHabilitados] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [modoReemplazo, setModoReemplazo] = useState(false); // NUEVO
  const [recipe, setRecipe] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    porciones: "",
    ingredientes: [{ nombre: "", cantidad: "" }],
    pasos: [{ descripcion: "", video_url: [], foto_url: [] }],
    imagen_receta_url: "",
  });

  function limpiarFormulario() {
    setRecipe({
      nombre: "",
      descripcion: "",
      tipo: "",
      porciones: "",
      ingredientes: [{ nombre: "", cantidad: "" }],
      pasos: [{ descripcion: "", video_url: [], foto_url: [] }],
      imagen_receta_url: "",
    });
    setCamposHabilitados(false);
    setModoEdicion(false);
    setModoReemplazo(false);
    setRecipeId(null);
  }

  async function cargarReceta(id) {
    try {
      const response = await api.get(`/recetas/${id}`);
      const { _id, ...restoDeLaReceta } = response.data;
      setRecipe({
        ...restoDeLaReceta,
        porciones: String(restoDeLaReceta.porciones)
      });
      setRecipeId(_id);
      console.log(_id)
      console.log(restoDeLaReceta)
      setModoEdicion(true);
      setCamposHabilitados(true);
    } catch (error) {
      console.error("Error al cargar receta:", error);
      Alert.alert("Error", "No se pudo cargar la receta.");
    }
  }

  async function verificarReceta(nombre) {
      try {
        const response = await api.post(`/recetas/verificar/${nombre}`);
        Alert.alert("Nueva receta", response.data.mensaje);
        setCamposHabilitados(true);
      } catch (error) {
        if (error.response && error.response.status === 409) {
            console.log(error.response.data)
            const data = error.response.data.detail;
          Alert.alert(
            "Receta existente",
            data.mensaje,
            [
              {
                text: "Modificar",
                onPress: () => {
                  console.log("Modificar receta existente:", data.receta_id);
                  cargarReceta(data.receta_id);
                },
              },
              {
                text: "Reemplazar",
                onPress: () => {
                  setModoReemplazo(true);
                  setCamposHabilitados(true);
                },
              },
              {
                text: "Cancelar",
                style: "cancel",
              },
            ],
            { cancelable: true }
          );
        } else {
          console.error("Error inesperado:", error);
          Alert.alert("Error", "No se pudo verificar el nombre.");
        }
      }
    }



  function handleChange(field, value) {
    setRecipe({ ...recipe, [field]: value });
  }

  function handleIngredientChange(index, field, value) {
    const newIngredients = [...recipe.ingredientes];
    newIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredientes: newIngredients });
  }

  function addIngredient() {
    setRecipe({
      ...recipe,
      ingredientes: [...recipe.ingredientes, { nombre: "", cantidad: "" }],
    });
  }

  function handleStepChange(index, field, value) {
    const newPasos = [...recipe.pasos];
    newPasos[index][field] = field === "foto_url" || field === "video_url"
      ? Array.isArray(value) ? value : []
      : value;
    setRecipe({ ...recipe, pasos: newPasos });
  }

  function addStep() {
    setRecipe({
      ...recipe,
      pasos: [...recipe.pasos, { descripcion: "", video_url: [], foto_url: [] }],
    });
  }

  async function pickMedia(index) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newPasos = [...recipe.pasos];
      result.assets.forEach((asset) => {
        if (asset.type === "image") {
          newPasos[index].foto_url.push(asset.uri);
        } else if (asset.type === "video") {
          newPasos[index].video_url.push(asset.uri);
        }
      });
      setRecipe({ ...recipe, pasos: newPasos });
    }
  }

  async function submitRecipe() {
    try {
      const payload = {
        ...recipe,
        porciones: parseInt(recipe.porciones),
      };

      let response;

      if (modoReemplazo) {
        try {
          const payload = {
            ...recipe,
            porciones: parseInt(recipe.porciones),
          };

          const response = await api.post("/recetas/reemplazar", payload);
          Alert.alert("Éxito", "Receta reemplazada correctamente.");
          limpiarFormulario();
        } catch (error) {
          console.error("Error al reemplazar receta:", error);
          Alert.alert("Error", "No se pudo reemplazar la receta.");
        }
        return;
      }

      if (modoEdicion && recipeId) {
        response = await api.put(`/recetas/${recipeId}`, payload);
        Alert.alert("Éxito", "Receta actualizada.");
        limpiarFormulario()
      } else {
        response = await api.post("/recetas", payload);
        Alert.alert("Éxito", "Receta cargada correctamente.");
        limpiarFormulario()
      }

      console.log("Respuesta:", response.data);
    } catch (error) {
      console.error("Error al guardar receta:", error);
      Alert.alert("Error", "No se pudo guardar la receta.");
    }
  }



  return (
    <ScrollView style={styles.container}>

      <Text style={styles.sectionTitle}>Nombre del plato</Text>
      <TextInput
        editable={!camposHabilitados}
        style={[
            styles.input,
            camposHabilitados && styles.inputDisabled,
          ]}
        value={recipe.nombre}
        onChangeText={(value) => handleChange("nombre", value)}
        onBlur={() => verificarReceta(recipe.nombre)}
      />

      <Text style={styles.sectionTitle}>Descripción del plato</Text>
      <TextInput
        editable={camposHabilitados }
        style={[styles.input, !camposHabilitados && styles.inputDisabled,]}
        value={recipe.descripcion}
        onChangeText={(value) => handleChange("descripcion", value)}
      />

      <Text style={styles.sectionTitle}>Tipo de plato</Text>
      <TextInput
        style={[styles.input, !camposHabilitados && styles.inputDisabled,]}
        editable={camposHabilitados}
        value={recipe.tipo}
        onChangeText={(value) => handleChange("tipo", value)}
      />

      <Text style={styles.sectionTitle}>Cantidad Porciones</Text>
      <TextInput
        style={[styles.input, !camposHabilitados && styles.inputDisabled,]}
        editable={camposHabilitados}
        value={recipe.porciones}
        onChangeText={(value) => handleChange("porciones", value)}
      />

      <Text style={styles.sectionTitle}>Ingredientes</Text>
      {recipe.ingredientes.map((ing, i) => (
        <View key={i} style={styles.ingredientRow}>
          <TextInput
            style={[styles.input, { flex: 2, marginRight: 10 }, !camposHabilitados && styles.inputDisabled]}
            placeholder="Nombre"
            editable={camposHabilitados}
            value={ing.nombre}
            onChangeText={(text) => handleIngredientChange(i, "nombre", text)}
          />
          <TextInput
            style={[styles.input, { flex: 1 }, !camposHabilitados && styles.inputDisabled]}
            placeholder="Cantidad"
            editable={camposHabilitados}
            value={ing.cantidad}
            keyboardType="numeric"
            onChangeText={(text) => handleIngredientChange(i, "cantidad", text)}
          />
        </View>
      ))}
      <Pressable
        style={[styles.addMedia, !camposHabilitados && { opacity: 0.5 }]}
        onPress={addIngredient}
        disabled={!camposHabilitados}
      >
        <Text style={styles.addButtonText}>+ Agregar Ingrediente</Text>
      </Pressable>

      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Pasos</Text>
      {recipe.pasos.map((step, i) => (
        <View key={i} style={styles.stepContainer}>
          <TextInput
            style={[styles.input, { minHeight: 60 }, !camposHabilitados && styles.inputDisabled]}
              placeholder={`Descripción paso ${i + 1}`}
              multiline
              editable={camposHabilitados}
              value={step.descripcion}
            onChangeText={(text) => handleStepChange(i, "descripcion", text)}
          />

          <Pressable
            style={styles.mediaButton}
            onPress={() => pickMedia(i)}
            disabled={!camposHabilitados}
          >
            <Text style={styles.addButtonText}>+ Adjuntar Multimedia</Text>
          </Pressable>

          {step.video_url.length > 0 && <Text style={{ color: "blue" }}>Video cargado</Text>}

          {step.foto_url.length > 0 && (
            <ScrollView horizontal>
              {step.foto_url.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.imagePreview} />
              ))}
            </ScrollView>
          )}
        </View>
      ))}

      <Pressable
        style={[styles.addButton, !camposHabilitados && { opacity: 0.5 }]}
        onPress={addStep}
        disabled={!camposHabilitados}
      >
        <Text style={styles.addButtonText}>+ Agregar Paso</Text>
      </Pressable>

      <Pressable
          style={[styles.saveButton, { backgroundColor: "gray" }]}
          onPress={limpiarFormulario}
        >
          <Text style={styles.saveButtonText}>Limpiar</Text>
       </Pressable>

      <Pressable
        style={[styles.saveButton, !camposHabilitados && { opacity: 0.5 }]}
        onPress={submitRecipe}
        disabled={!camposHabilitados}
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
    borderRadius: 15,
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
  mediaButton: {
    backgroundColor: "#edd",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
    alignItems: "center",
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
  inputDisabled: {
      backgroundColor: '#ddd',
    },
});
