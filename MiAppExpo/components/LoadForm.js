import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
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
    ingredientes: [
      { idIngrediente: null, cantidad: "", idUnidad: null, observaciones: "" },
    ],
    pasos: [{ nroPaso: 1, texto: "", multimedia: [] }],
    fotosAdicionales: [],
  });
  const [loadingMedia, setLoadingMedia] = useState(false);



  useEffect(() => {
    api.get("/recetas/tipos").then((res) => setTipos(res.data));
    api
      .get("/recetas/ingredientes")
      .then((res) => setIngredientesDisponibles(res.data));
    api.get("/recetas/unidades").then((res) => setUnidades(res.data));
  }, []);

  //HACER EN BACK --> para agregar un tipo o ingrediente nuevo
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

  // Manejo de cambios en los campos del formulario
  function handleChange(field, value) {
    setRecipe({ ...recipe, [field]: value });
  }

  // Manejo de cambios en los ingredientes
  function handleIngredientChange(i, field, value) {
    const ing = [...recipe.ingredientes];
    ing[i][field] = value;
    setRecipe({ ...recipe, ingredientes: ing });
  }

  function addIngredient() {
    setRecipe({
      ...recipe,
      ingredientes: [
        ...recipe.ingredientes,
        {
          idIngrediente: null,
          cantidad: "",
          idUnidad: null,
          observaciones: "",
        },
      ],
    });
  }

  // Manejo de cambios en los pasos
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

  // Funciones para subir archivos y seleccionar imágenes
  async function uploadFile(uri) {
    console.log("Subiendo archivo:", uri);
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "No se encontró el archivo");
        return null;
      }

      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("file", {
        uri: fileInfo.uri,
        name: filename,
        type,
      });
      console.log("llamando a la API con formData:", formData);
      const response = await api.post("recetas/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.url;
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo subir el archivo");
      return null;
    }
  }

  async function pickMainPhoto() {
    try {
      setLoadingMedia(true);

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.1,
      });

      if (!res.canceled) {
        const uploaded = await uploadFile(res.assets[0].uri);
        console.log("Foto principal subida:", uploaded);
        if (uploaded) {
          setRecipe((prev) => {
            const nuevo = { ...prev, fotoPrincipal: uploaded };
            console.log("Nuevo estado receta con fotoPrincipal:", nuevo);
            return nuevo;
          });
        }
      }
    } catch (err) {
      console.error("Error en pickMainPhoto:", err);
    } finally {
      setLoadingMedia(false);
    }
  }


  async function pickExtraPhotos(recipe, setRecipe) {
    try {
      setLoadingMedia(true);

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.1,
      });

      if (!res.canceled) {
        const newFotos = [];

        for (const asset of res.assets) {
          const uploaded = await uploadFile(asset.uri);
          if (uploaded) {
            newFotos.push({
              urlFoto: uploaded,
              extension: asset.uri.split(".").pop(),
            });
          }
        }

        setRecipe({
          ...recipe,
          fotosAdicionales: [...recipe.fotosAdicionales, ...newFotos],
        });
      }
    } catch (err) {
      console.error("Error en pickExtraPhotos:", err);
    } finally {
      setLoadingMedia(false);
    }
  }


  async function pickMedia(i, recipe, setRecipe) {
    try {
      setLoadingMedia(true);

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.1,
      });

      if (!res.canceled) {
        const pasosActuales = [...recipe.pasos];

        for (const asset of res.assets) {
          const ext = asset.uri.split(".").pop();
          const uploaded = await uploadFile(asset.uri);
          if (uploaded) {
            pasosActuales[i].multimedia.push({
              tipo_contenido: asset.type,
              extension: ext,
              urlContenido: uploaded,
            });
          }
        }

        setRecipe({ ...recipe, pasos: pasosActuales });
      }
    } catch (err) {
      console.error("Error en pickMedia:", err);
    } finally {
      setLoadingMedia(false);
    }
  }


  // Funciones para obtener IDs por nombre o descripción
  function getIdIngredienteByNombre(nombre) {
    const ing = ingredientesDisponibles.find((i) => i.nombre === nombre);
    return ing?.idIngrediente ?? null;
  }

  function getIdUnidadByDescripcion(desc) {
    const unidad = unidades.find((u) => u.descripcion === desc);
    return unidad?.idUnidad ?? null;
  }

  function getIdTipoByDescripcion(desc) {
    const tipo = tipos.find((t) => t.descripcion === desc);
    return tipo?.idTipo ?? null;
  }

  // Cargar receta por ID cuando se modifica
  async function cargarReceta(id) {
    try {
      const response = await api.get(`/recetas/${id}`);
      const data = response.data;
      console.log(data);
      setRecipe({
        nombreReceta: data.nombreReceta,
        descripcionReceta: data.descripcionReceta,
        idTipo: getIdTipoByDescripcion(data.tipoReceta),
        porciones: data.porciones.toString(),
        cantidadPersonas: data.cantidadPersonas.toString(),
        fotoPrincipal: data.fotoPrincipal,
        ingredientes: data.ingredientes.map((ing) => ({
          idIngrediente: getIdIngredienteByNombre(ing.ingrediente),
          cantidad: ing.cantidad.toString(),
          idUnidad: getIdUnidadByDescripcion(ing.unidad),
          observaciones: ing.observaciones || "",
        })),
        pasos: data.pasos.map((p) => ({
          nroPaso: p.nroPaso,
          texto: p.descripcionPaso,
          multimedia: p.multimedia.map((m) => ({
            tipo_contenido: m.tipo,
            urlContenido: m.url,
            extension: m.url.split(".").pop(),
          })),
        })),
        fotosAdicionales: [], // si en el futuro las separás del campo fotoPrincipal
      });
      setRecipeId(id);
      console.log(id);
      console.log(recipe);
      setModoEdicion(true);
      setCamposHabilitados(true);
    } catch (error) {
      console.error("Error al cargar receta:", error);
      Alert.alert("Error", "No se pudo cargar la receta.");
    }
  }

  // Verificar si la receta ya existe por nombre y fue creada por el usuario
  async function verificarReceta(nombre) {
    try {
      const response = await api.post(`/recetas/verificar/${nombre}`);
      Alert.alert("Nueva receta", response.data.mensaje);
      setCamposHabilitados(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log(error.response.data);
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
                setRecipeId(data.receta_id);
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

  // crear la receta
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
          observaciones: ing.observaciones,
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
        fotosAdicionales: recipe.fotosAdicionales,
      };
      console.log("Enviando payload:\n" + JSON.stringify(payload, null, 2));

      let res;
      if (modoReemplazo)
        res = await api.put(`recetas/reemplazar/${recipeId}`, payload);
      else if (modoEdicion && recipeId)
        res = await api.put(`/recetas/${recipeId}`, payload);
      else res = await api.post("/recetas", payload);

      Alert.alert(
        "Éxito",
        modoEdicion
          ? "Receta actualizada"
          : modoReemplazo
            ? "Receta reemplazada"
            : "Receta creada"
      );
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
      ingredientes: [
        {
          idIngrediente: null,
          cantidad: "",
          idUnidad: null,
          observaciones: "",
        },
      ],
      pasos: [{ nroPaso: 1, texto: "", multimedia: [] }],
      fotosAdicionales: [],
    });
    setCamposHabilitados(false);
    setModoEdicion(false);
    setModoReemplazo(false);
    setRecipeId(null);
  }

  return (
      <View style={{ flex: 1 }} pointerEvents={loadingMedia ? "none" : "auto"}>
        <ScrollView style={styles.container}>
          {loadingMedia && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#E65100" />
            </View>
          )}
          {camposHabilitados && (
            <Pressable style={styles.clear} onPress={limpiarFormulario}>
              <Text style={styles.addButtonText}>Limpiar Receta</Text>
            </Pressable>
          )}
          <Text style={styles.sectionTitle}>Nombre de la receta</Text>
          <TextInput
            editable={!camposHabilitados}
            style={[styles.input, camposHabilitados && styles.inputDisabled]}
            value={recipe.nombreReceta}
            onChangeText={(value) => handleChange("nombreReceta", value)}
            onBlur={() => verificarReceta(recipe.nombreReceta)}
          />

          {camposHabilitados && (
            <>
              <Text style={styles.sectionTitle}>Descripción del plato</Text>
              <TextInput
                style={[styles.input, ,]}
                value={recipe.descripcionReceta}
                onChangeText={(value) => handleChange("descripcionReceta", value)}
              />

              <Text style={styles.sectionTitle}>Tipo de plato</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={recipe.idTipo}
                  onValueChange={(v) => handleChange("idTipo", v)}
                >
                  <Picker.Item label="Seleccione un tipo" value="" />
                  {tipos.map((t) => (
                    <Picker.Item
                      key={t.idTipo}
                      label={t.descripcion}
                      value={t.idTipo}
                    />
                  ))}
                  <Picker.Item label="Otro..." value="otro" />
                </Picker>
              </View>
              {recipe.idTipo === "otro" && (
                <TextInput
                  placeholder="Nuevo tipo"
                  style={styles.input}
                  onChangeText={(t) => handleChange("idTipo", t)}
                />
              )}

              <Text style={styles.sectionTitle}>Porciones</Text>
              <TextInput
                style={[styles.input]}
                keyboardType="numeric"
                value={recipe.porciones}
                onChangeText={(t) => handleChange("porciones", t)}
              />

              <Text style={styles.sectionTitle}>Cantidad de Personas</Text>
              <TextInput
                style={[styles.input]}
                keyboardType="numeric"
                value={recipe.cantidadPersonas}
                onChangeText={(t) => handleChange("cantidadPersonas", t)}
              />

              <Text style={styles.sectionTitle}>Foto principal</Text>
              <Pressable style={styles.mediaButton} onPress={pickMainPhoto}>
                <Text>Seleccionar imagen</Text>
              </Pressable>
              {recipe.fotoPrincipal && (
                <Text
                  style={{
                    fontSize: 10,
                    color: "gray",
                    marginTop: 6,
                    maxWidth: "80%",
                    flexShrink: 1,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  URL: {recipe.fotoPrincipal}
                </Text>
              )}

              <Text style={styles.sectionTitle}>Ingredientes</Text>
              {recipe.ingredientes.map((ing, i) => (
                <View key={i} style={styles.ingredienteContainer}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={ing.idIngrediente}
                      onValueChange={(v) =>
                        handleIngredientChange(i, "idIngrediente", v)
                      }
                      style={{ color: "#222" }}
                    >
                      <Picker.Item label="Seleccione un ingrediente" value="" />
                      {ingredientesDisponibles.map((x) => (
                        <Picker.Item
                          key={x.idIngrediente}
                          label={x.nombre}
                          value={x.idIngrediente}
                        />
                      ))}
                      <Picker.Item label="Otro.." value="otro" />
                    </Picker>
                  </View>
                  {ing.idIngrediente === "otro" && (
                    <TextInput
                      placeholder="Nuevo ingrediente"
                      style={styles.input}
                      onChangeText={(t) =>
                        handleIngredientChange(i, "idIngrediente", t)
                      }
                    />
                  )}
                  <View style={styles.rowCantidadUnidad}>
                    <TextInput
                      style={styles.inputSmall}
                      keyboardType="numeric"
                      placeholder="Cantidad"
                      value={ing.cantidad}
                      onChangeText={(t) => handleIngredientChange(i, "cantidad", t)}
                    />
                    <View style={styles.pickerUnidad}>
                      <Picker
                        selectedValue={ing.idUnidad}
                        onValueChange={(v) =>
                          handleIngredientChange(i, "idUnidad", v)
                        }
                      >
                        <Picker.Item label="Seleccione una unidad" value="" />
                        {unidades.map((u) => (
                          <Picker.Item
                            key={u.idUnidad}
                            label={u.descripcion}
                            value={u.idUnidad}
                          />
                        ))}
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
                    onChangeText={(t) => handleStepChange(i, "texto", t)}
                  />
                  <Pressable
                    style={styles.mediaButton}
                    onPress={() => pickMedia(i)}
                  >
                    <Text>+ Multimedia</Text>
                  </Pressable>
                  {st.multimedia.map((m, k) => (
                    <Text key={k}>
                      {m.tipo_contenido}: {m.urlContenido}
                    </Text>
                  ))}
                </View>
              ))}
              <Pressable style={styles.addButton} onPress={addStep}>
                <Text style={styles.addButtonText}>+ Agregar paso</Text>
              </Pressable>

              <Text style={styles.sectionTitle}>Fotos adicionales</Text>
              <Pressable style={styles.mediaButton} onPress={pickExtraPhotos}>
                <Text>+ Agregar fotos</Text>
              </Pressable>
              <ScrollView horizontal>
                {recipe.fotosAdicionales.map((f, i) => (
                  <Image
                    key={i}
                    source={{ uri: f.urlFoto }}
                    style={styles.imagePreview}
                  />
                ))}
              </ScrollView>
              <Pressable style={styles.save} onPress={submitRecipe}>
                <Text style={styles.addButtonText}>Guardar Receta</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
    color: "#222",
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },


  rowCantidadUnidad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
    height: "80%",
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
    alignSelf: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: 8,
  },
  inputDisabled: {
    backgroundColor: "#eee",
    color: "#999",
  },
});
