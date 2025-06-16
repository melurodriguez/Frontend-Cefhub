import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  View, Text, TextInput, Pressable,
  Image, ScrollView, StyleSheet, Alert
} from "react-native";
import api from "../api/axiosInstance";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../utils/themes";

export default function LoadForm() {
  const [camposHabilitados, setCamposHabilitados] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoReemplazo, setModoReemplazo] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [recipe, setRecipe] = useState({
    nombreReceta: "",
    descripcionReceta: "",
    idTipo: null,
    porciones: "",
    cantidadPersonas: "",
    fotoPrincipal: null,
    ingredientes: [{ idIngrediente: null, cantidad: "", idUnidad: null, observaciones: "" }],
    pasos: [{ nroPaso: 1, texto: "", multimedia: [] }],
    fotosAdicionales: []
  });

  useEffect(() => {
    api.get("/recetas/tipos").then(res => setTipos(res.data));
    api.get("/recetas/ingredientes").then(res => setIngredientesDisponibles(res.data));
    api.get("/recetas/unidades").then(res => setUnidades(res.data));
  }, []);


  //HACER EN BACK
  const handleNewTipo = async (descripcion) => {
    try {
      const res = await api.post("/recetas/tipos", { descripcion });
      setTipos([...tipos, res.data]);
      return res.data.idTipo;
    } catch {
      Alert.alert("Error", "No se pudo crear el tipo.");
    }
  };

  const handleNewIngrediente = async (nombre) => {
    try {
      const res = await api.post("/recetas/ingredientes", { nombre });
      setIngredientesDisponibles([...ingredientesDisponibles, res.data]);
      return res.data.idIngrediente;
    } catch {
      Alert.alert("Error", "No se pudo crear el ingrediente.");
    }
  };

  function handleChange(field, value) {
    setRecipe({ ...recipe, [field]: value });
  }

  function handleIngredientChange(i, field, value) {
    const ing = [...recipe.ingredientes];
    ing[i][field] = value;
    setRecipe({ ...recipe, ingredientes: ing });
  }

  function addIngredient() {
    setRecipe({
      ...recipe,
      ingredientes: [...recipe.ingredientes, { idIngrediente:null, cantidad:"", idUnidad:null, observaciones:""}]
    });
  }

  function handleStepChange(i, field, value) {
    const ps = [...recipe.pasos];
    ps[i][field] = value;
    setRecipe({ ...recipe, pasos: ps });
  }

  function addStep() {
    const ps = [...recipe.pasos];
    ps.push({ nroPaso: ps.length + 1, texto: "", multimedia: [] });
    setRecipe({ ...recipe, pasos: ps });
  }

  async function pickMedia(i) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const ps = [...recipe.pasos];
      result.assets.forEach(a => {
        const ext = a.uri.split(".").pop();
        ps[i].multimedia.push({
          tipo_contenido: a.type,
          extension: ext,
          urlContenido: a.uri
        });
      });
      setRecipe({ ...recipe, pasos: ps });
    }
  }

  async function pickMainPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled) {
      setRecipe({ ...recipe, fotoPrincipal: res.assets[0].uri });
    }
  }

  async function pickExtraPhotos() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true
    });
    if (!res.canceled) {
      const extras = res.assets.map(a => ({
        urlFoto: a.uri,
        extension: a.uri.split(".").pop()
      }));
      setRecipe({ ...recipe, fotosAdicionales: [...recipe.fotosAdicionales, ...extras] });
    }
  }

  function getIdIngredienteByNombre(nombre) {
    const ing = ingredientesDisponibles.find(i => i.nombre === nombre);
    return ing?.idIngrediente ?? null;
  }

  function getIdUnidadByDescripcion(desc) {
    const unidad = unidades.find(u => u.descripcion === desc);
    return unidad?.idUnidad ?? null;
  }

  async function cargarReceta(id) {
      try {
        const response = await api.get(`/recetas/${id}`);
        const data= response.data;
        console.log(data)
        setRecipe({
            nombreReceta: data.nombreReceta,
            descripcionReceta: data.descripcionReceta,
            idTipo: data.tipoReceta, // Si usás el ID del tipo, deberías mapearlo correctamente
            porciones: data.porciones.toString(),
            cantidadPersonas: data.cantidadPersonas.toString(),
            fotoPrincipal: data.fotoPrincipal,
            ingredientes: data.ingredientes.map(ing => ({
              idIngrediente: getIdIngredienteByNombre(ing.ingrediente), // 💡 función auxiliar para buscar el ID
              cantidad: ing.cantidad.toString(),
              idUnidad: getIdUnidadByDescripcion(ing.unidad),
              observaciones: ing.observaciones || ""
            })),
            pasos: data.pasos.map(p => ({
              nroPaso: p.nroPaso,
              texto: p.descripcionPaso,
              multimedia: p.multimedia.map(m => ({
                tipo_contenido: m.tipo,
                urlContenido: m.url,
                extension: m.url.split('.').pop()
              }))
            })),
            fotosAdicionales: [] // si en el futuro las separás del campo fotoPrincipal
          });
        setRecipeId(id);
        console.log(id)
        console.log(recipe)
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

  async function submitRecipe() {
    try {
      let tipoId = recipe.idTipo;
      if (typeof tipoId === "string") tipoId = await handleNewTipo(tipoId);

      const ingredientesPrep = [];
      for (let ing of recipe.ingredientes) {
        let idI = ing.idIngrediente;
        if (typeof idI === "string") idI = await handleNewIngrediente(idI);
        ingredientesPrep.push({
          idIngrediente: idI,
          cantidad: parseFloat(ing.cantidad),
          idUnidad: ing.idUnidad,
          observaciones: ing.observaciones
        });
      }

      const payload = {
        nombreReceta: recipe.nombreReceta,
        descripcionReceta: recipe.descripcionReceta,
        fotoPrincipal: recipe.fotoPrincipal,
        porciones: parseInt(recipe.porciones),
        cantidadPersonas: parseInt(recipe.cantidadPersonas),
        idTipo: tipoId,
        ingredientes: ingredientesPrep,
        pasos: recipe.pasos,
        fotosAdicionales: recipe.fotosAdicionales
      };

      let res;
      if (modoReemplazo)
        res = await api.post("/recetas/reemplazar", payload);
      else if (modoEdicion && recipeId)
        res = await api.put(`/recetas/${recipeId}`, payload);
      else
        res = await api.post("/recetas", payload);

      Alert.alert("Éxito", modoEdicion ? "Receta actualizada" :
        modoReemplazo ? "Receta reemplazada" : "Receta creada");
      limpiarFormulario();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo guardar la receta.");
    }
  }

  function limpiarFormulario() {
    setRecipe({
      nombreReceta: "",
      descripcionReceta: "",
      idTipo: null,
      porciones: "",
      cantidadPersonas: "",
      fotoPrincipal: null,
      ingredientes: [{ idIngrediente: null, cantidad: "", idUnidad: null, observaciones: "" }],
      pasos: [{ nroPaso: 1, texto: "", multimedia: [] }],
      fotosAdicionales: []
    });
    setCamposHabilitados(false);
    setModoEdicion(false);
    setModoReemplazo(false);
    setRecipeId(null);
  }

return (
  <ScrollView style={styles.container}>
    <Text style={styles.sectionTitle}>Nombre</Text>
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
            value={recipe.descripcionReceta}
            onChangeText={value => handleChange("descripcionReceta", value)}
          />

    <Text style={styles.sectionTitle}>Tipo de plato</Text>
    <View style={styles.pickerContainer} >
      <Picker
        selectedValue={recipe.idTipo}
        onValueChange={v => handleChange("idTipo", v)}
        enabled={camposHabilitados }
        style={[!camposHabilitados && styles.inputDisabled,]}
      >
        {tipos.map(t => <Picker.Item key={t.idTipo} label={t.descripcion} value={t.idTipo} />)}
        <Picker.Item label="Otro..." value="otro" />
      </Picker>
    </View>
    {recipe.idTipo === "otro" && (
      <TextInput
        placeholder="Nuevo tipo"
        style={styles.input}
        onChangeText={t => handleChange("idTipo", t)}
      />
    )}

    <Text style={styles.sectionTitle}>Porciones</Text>
    <TextInput
      editable={camposHabilitados }
      style={[styles.input, !camposHabilitados && styles.inputDisabled,]}
      keyboardType="numeric"
      value={recipe.porciones}
      onChangeText={t => handleChange("porciones", t)}
    />

    <Text style={styles.sectionTitle}>Cant. Personas</Text>
    <TextInput
      editable={camposHabilitados }
      style={[styles.input, !camposHabilitados && styles.inputDisabled,]}
      keyboardType="numeric"
      value={recipe.cantidadPersonas}
      onChangeText={t => handleChange("cantidadPersonas", t)}
    />

    <Text style={styles.sectionTitle}>Foto principal</Text>
    <Pressable disabled={!camposHabilitados } style={styles.mediaButton} onPress={pickMainPhoto}><Text>Seleccionar imagen</Text></Pressable>
    {recipe.fotoPrincipal && <Image source={{ uri: recipe.fotoPrincipal }} style={styles.imagePreview} />}

    <Text style={styles.sectionTitle}>Ingredientes</Text>
    {recipe.ingredientes.map((ing, i) => (
      <View key={i} style={styles.ingredienteContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={ing.idIngrediente}
            onValueChange={v => handleIngredientChange(i, "idIngrediente", v)}
            style={{ color: "#222" }}
          >
            {ingredientesDisponibles.map(x =>
              <Picker.Item key={x.idIngrediente} label={x.nombre} value={x.idIngrediente} />
            )}
            <Picker.Item label="Otro.." value="otro" />
          </Picker>
        </View>
        {ing.idIngrediente === "otro" && (
          <TextInput
            placeholder="Nuevo ingrediente"
            style={styles.input}
            onChangeText={t => handleIngredientChange(i, "idIngrediente", t)}
          />
        )}
        <View style={styles.rowCantidadUnidad}>
          <TextInput
            style={styles.inputSmall}
            keyboardType="numeric"
            placeholder="Cantidad"
            value={ing.cantidad}
            onChangeText={t => handleIngredientChange(i, "cantidad", t)}
          />
          <View style={styles.pickerUnidad}>
            <Picker
              selectedValue={ing.idUnidad}
              onValueChange={v => handleIngredientChange(i, "idUnidad", v)}
            >
              {unidades.map(u => <Picker.Item key={u.idUnidad} label={u.descripcion} value={u.idUnidad} />)}
            </Picker>
          </View>

        </View>
      </View>
    ))}
    <Pressable style={styles.addButton} onPress={addIngredient}>
      <Text style={styles.addButtonText}>+ Ingrediente</Text>
    </Pressable>

    <Text style={styles.sectionTitle}>Pasos</Text>
    {recipe.pasos.map((st, i) => (
      <View key={i} style={styles.step}>
        <Text>Paso {st.nroPaso}</Text>
        <TextInput
          style={styles.textarea}
          value={st.texto}
          onChangeText={t => handleStepChange(i, "texto", t)}
        />
        <Pressable style={styles.mediaButton} onPress={() => pickMedia(i)}><Text>+ Multimedia</Text></Pressable>
        {st.multimedia.map((m, k) => (
          <Text key={k}>{m.tipo_contenido}: {m.urlContenido}</Text>
        ))}
      </View>
    ))}
    <Pressable style={styles.addButton} onPress={addStep}><Text style={styles.addButtonText}>+ Agregar paso</Text></Pressable>

    <Text style={styles.sectionTitle}>Fotos adicionales</Text>
    <Pressable style={styles.mediaButton} onPress={pickExtraPhotos}><Text>+ Agregar fotos</Text></Pressable>
    <ScrollView horizontal>
      {recipe.fotosAdicionales.map((f, i) => (
        <Image key={i} source={{ uri: f.urlFoto }} style={styles.imagePreview} />
      ))}
    </ScrollView>

    <Pressable style={styles.save} onPress={submitRecipe}><Text style={styles.addButtonText}>Guardar Receta</Text></Pressable>
    <Pressable style={styles.clear} onPress={limpiarFormulario}><Text style={styles.addButtonText}>Limpiar</Text></Pressable>
  </ScrollView>
);

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Sora_700Bold",
    marginBottom: 12,
    color: colors.primary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 15,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
    color: "#222",
  },
  rowCantidadUnidad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginRight: 10,
    fontSize: 14,
    height:"80%",
    justifyContent: "center",
  },
  ingredienteContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  step: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 12,
    padding: 10,
    fontSize: 15,
    minHeight: 60,
    marginTop: 8,
    backgroundColor: "white",
    color: "#222",
  },
  mediaButton: {
    backgroundColor: "#f3d1d1",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  mediaButtonText: {
    color: "#7a0b0b",
    fontWeight: "700",
  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pickerUnidad: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    fontFamily: "Sora_700Bold",
    color: "white",
    fontSize: 16,
  },
  save: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  clear: {
    backgroundColor: "#bbb",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 40,
  },
  inputDisabled: {
    backgroundColor: "#eee",
    color: "#999",
  },
});

