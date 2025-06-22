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
    tipo: null,
    porciones: "",
    cantidadPersonas: "",
    fotoPrincipal: null,
    ingredientes: [
      { nombre: null, cantidad: "", idUnidad: null, observaciones: "" },
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

  // Para imagen principal:
  const pickMainPhoto = async () => {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la galería');
        return;
      }
    }

    console.log("Seleccionando foto principal...");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setRecipe(prev => ({ ...prev, fotoPrincipal: uri }));
    }
  };

  // Para adjuntar imágenes o videos en un paso:
  const pickMedia = async (indexPaso) => {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la galería');
        return;
      }
    }

    console.log("Seleccionando imagen o video...");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const tipo = asset.type === 'video' ? 'video' : 'imagen';
      const nuevoMultimedia = {
        tipo_contenido: tipo,
        urlContenido: asset.uri,
      };

      setRecipe(prev => {
        const nuevosPasos = [...prev.pasos];
        nuevosPasos[indexPaso].multimedia.push(nuevoMultimedia);
        return { ...prev, pasos: nuevosPasos };
      });
    }
  };

  // Para fotos adicionales (solo imágenes):
  const pickExtraPhotos = async () => {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la galería');
        return;
      }
    }

    console.log("Seleccionando fotos adicionales...");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true, // Funciona solo en web, en nativo será una sola
      quality: 1,
    });

    if (!result.canceled) {
      const nuevasFotos = result.assets.map((a) => ({ urlFoto: a.uri }));
      setRecipe(prev => ({
        ...prev,
        fotosAdicionales: [...prev.fotosAdicionales, ...nuevasFotos],
      }));
    }
  };



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
        tipo: data.tipoReceta,
        porciones: data.porciones.toString(),
        cantidadPersonas: data.cantidadPersonas.toString(),
        fotoPrincipal: data.fotoPrincipal,
        ingredientes: data.ingredientes.map((ing) => ({
          nombre: ing.ingrediente,
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
      setLoadingMedia(true);

      const formData = new FormData();

      const ingredientesPrep = recipe.ingredientes.map((ing) => ({
        nombre: ing.nombre,
        cantidad: parseFloat(ing.cantidad),
        idUnidad: ing.idUnidad,
        observaciones: ing.observaciones,
      }));

      const tipo = recipe.tipo;

      const pasosSinMedia = recipe.pasos.map(p => ({
        nroPaso: p.nroPaso,
        texto: p.texto,
        multimedia: []
      }));

      const recetaObj = {
        nombreReceta: recipe.nombreReceta,
        descripcionReceta: recipe.descripcionReceta,
        porciones: parseInt(recipe.porciones),
        cantidadPersonas: parseInt(recipe.cantidadPersonas),
        tipo: tipo,
        ingredientes: ingredientesPrep,
        pasos: pasosSinMedia,
        fotosAdicionales: [],
      };

      formData.append("datos", JSON.stringify(recetaObj));

      if (recipe.fotoPrincipal?.startsWith("file://")) {
        formData.append("fotoPrincipal", {
          uri: recipe.fotoPrincipal,
          type: "image/jpeg",
          name: "fotoPrincipal.jpg",
        });
      }

      recipe.fotosAdicionales.forEach((f, i) => {
        if (f.urlFoto?.startsWith("file://")) {
          formData.append(`fotosAdicionales`, {
            uri: f.urlFoto,
            type: "image/jpeg",
            name: `fotoAdicional_${i}.jpg`,
          });
        }
      });

      recipe.pasos.forEach((p, i) => {
        p.multimedia.forEach((m, j) => {
          if (m.urlContenido?.startsWith("file://")) {
            formData.append("archivosPasos", {
              uri: m.urlContenido,
              type: m.tipo_contenido === "video" ? "video/mp4" : "image/jpeg",
              name: `paso_${i}_media_${j}.${m.tipo_contenido === "video" ? "mp4" : "jpg"}`,
            });
          }
        });
      });
      console.log("Contenido de formData:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }


      let res;
      if (modoReemplazo) {
        res = await api.put(`/recetas/reemplazar/${recipeId}`, formData);
      } else if (modoEdicion && recipeId) {
        res = await api.put(`/recetas/${recipeId}`, formData);
      } else {
        res = await api.post("/recetas", formData);
        console.log("Respuesta:", res.data);
      }


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
      console.error("Error en submitRecipe:", {
        message: e.message,
        config: e.config,
        request: e.request,
        response: e.response?.data,
        status: e.response?.status,
      });
      Alert.alert("Error", "No se pudo guardar la receta.");
    }
    finally {
      setLoadingMedia(false);
    }
  }


  function limpiarFormulario() {
    setRecipe({
      nombreReceta: "",
      descripcionReceta: "",
      tipo: null,
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
                  selectedValue={recipe.tipo}
                  onValueChange={(v) => handleChange("tipo", v)}
                >
                  <Picker.Item label="Seleccione un tipo" value="" />
                  {tipos.map((t) => (
                    <Picker.Item
                      key={t.idTipo}
                      label={t.descripcion}
                      value={t.descripcion}
                    />
                  ))}
                  <Picker.Item label="Otro..." value="otro" />
                </Picker>
              </View>
              {(recipe.tipo === "otro" || !tipos.some(t => t.descripcion === recipe.tipo)) && (
                <>
                  <Text style={styles.label}>Nuevo tipo:</Text>
                  <TextInput
                    placeholder="Ingrese tipo de plato"
                    style={styles.input}
                    onChangeText={(t) => handleChange("tipo", t)}
                  />
                </>
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
                <Image
                  source={{ uri: recipe.fotoPrincipal }}
                  style={styles.imagePreview}
                />
              )}


              <Text style={styles.sectionTitle}>Ingredientes</Text>
              {recipe.ingredientes.map((ing, i) => (
                <View key={i} style={styles.ingredienteContainer}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={ing.nombre}
                      onValueChange={(v) =>
                        handleIngredientChange(i, "nombre", v)
                      }
                      style={{ color: "#222" }}
                    >
                      <Picker.Item label="Seleccione un ingrediente" value="" />
                      {ingredientesDisponibles.map((x) => (
                        <Picker.Item
                          key={x.idIngrediente}
                          label={x.nombre}
                          value={x.nombre}
                        />
                      ))}
                      <Picker.Item label="Otro.." value="otro" />
                    </Picker>
                  </View>
                  {(ing.nombre === "otro" || !ingredientesDisponibles.some(i => i.nombre === ing.nombre)) && (
                    <>
                      <Text style={styles.label}>Nuevo ingrediente:</Text>
                      <TextInput
                        placeholder="Ingrese ingrediente"
                        style={styles.input}
                        onChangeText={(t) => handleIngredientChange(i, "nombre", t)}
                      />
                    </>
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
                    m.tipo_contenido === "imagen" ? (
                      <Image
                        key={k}
                        source={{ uri: m.urlContenido }}
                        style={styles.imagePreview}
                      />
                    ) : (
                      <View key={k} style={styles.videoPlaceholder}>
                        <Text>Video: {m.urlContenido}</Text>
                      </View>
                    )
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
  videoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
    marginTop: 5,
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
