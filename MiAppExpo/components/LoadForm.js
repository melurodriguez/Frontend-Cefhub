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
import { useNavigation } from '@react-navigation/native';
import api from "../api/axiosInstance";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../utils/themes";
import UploadingScreen from "../components/UploadingScreen";



export default function LoadForm() {
  const navigation = useNavigation();
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


///////////// Funciones de manejo de cambios en el formulario ///////////////

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

  const validarFormulario = () => {
      if (!recipe.nombreReceta.trim()) return false;
      if (!recipe.descripcionReceta.trim()) return false;
      if (!recipe.tipo.trim()) return false;
      if (!recipe.porciones || isNaN(recipe.porciones)) return false;
      if (!recipe.cantidadPersonas || isNaN(recipe.cantidadPersonas)) return false;
      if (!recipe.fotoPrincipal) return false;

      for (let ing of recipe.ingredientes) {
        if (!ing.nombre.trim() || !ing.cantidad || !ing.idUnidad) return false;
      }

      for (let paso of recipe.pasos) {
        if (!paso.texto.trim()) return false;
      }

      return true;
    };

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


  ////////////////// Funciones para subir archivos y seleccionar imágenes ///////////////////////

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
      quality: 0.5,
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
      quality: 0.5,
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
      quality: 0.5,
    });

    if (!result.canceled) {
      const nuevasFotos = result.assets.map((a) => ({ urlFoto: a.uri }));
      setRecipe(prev => ({
        ...prev,
        fotosAdicionales: [...prev.fotosAdicionales, ...nuevasFotos],
      }));
    }
  };

///////////////////////////////////////////////////////////////////////////////////////////

  // Funciones para obtener IDs por nombre UNIDAD

  function getIdUnidadByDescripcion(desc) {
    const unidad = unidades.find((u) => u.descripcion === desc);
    return unidad?.idUnidad ?? null;
  }


  /////////////// Cargar receta existente  por ID para se MODIFICAR  ///////////////
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
        const response = await api.post(`/recetas/verificar/${encodeURIComponent(nombre)}`);

        // Si no hay conflicto, es receta nueva
        Alert.alert("Nueva receta", response.data.mensaje);
        setCamposHabilitados(true);

      } catch (error) {
        if (error.response && error.response.status === 409) {
          const data = error.response.data?.detail || {};

          Alert.alert(
            "Receta existente",
            data.mensaje || "Ya existe una receta con este nombre.",
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
          console.console("Error inesperado:", error);
          Alert.alert("Error", "No se pudo verificar el nombre.");
        }
      }
    }



  /////////////// Funciones para eliminar multimedia y fotos adicionales/////////////
  const removeMediaFromStep = (indexPaso, indexMedia) => {
    const nuevosPasos = [...recipe.pasos];
    nuevosPasos[indexPaso].multimedia.splice(indexMedia, 1);
    setRecipe({ ...recipe, pasos: nuevosPasos });
  };
  const removeExtraPhoto = (index) => {
    const nuevasFotos = [...recipe.fotosAdicionales];
    nuevasFotos.splice(index, 1);
    setRecipe({ ...recipe, fotosAdicionales: nuevasFotos });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////
    async function submitRecipe(navigation) {
        if (!validarFormulario()) {
            Alert.alert("Error", "Por favor, completá todos los campos obligatorios.");
            return;
        }
        try {
          setLoadingMedia(true);

          const recetaObj = {
            nombreReceta: recipe.nombreReceta,
            descripcionReceta: recipe.descripcionReceta,
            porciones: parseInt(recipe.porciones),
            cantidadPersonas: parseInt(recipe.cantidadPersonas),
            tipo: recipe.tipo,
            ingredientes: recipe.ingredientes.map((ing) => ({
              nombre: ing.nombre,
              cantidad: parseFloat(ing.cantidad),
              idUnidad: ing.idUnidad,
              observaciones: ing.observaciones,
            })),
            pasos: recipe.pasos.map((p) => ({
              nroPaso: p.nroPaso,
              texto: p.texto,
            }))
          };
          let res;
          let idReceta;

          if (modoReemplazo) {
            res = await api.put(`/recetas/reemplazar/${recipeId}`, recetaObj);
            idReceta = res.data.idReceta;
          } else if (modoEdicion && recipeId) {
            res = await api.put(`/recetas/${recipeId}`, recetaObj);
            idReceta = recipeId;
          } else {
            console.log("Creando nueva receta...");
            res = await api.post("/recetas/", recetaObj);
            idReceta = res.data.idReceta;
            console.log("Receta creada. ID:", idReceta);
          }

          const config = {
            headers: { "Content-Type": "multipart/form-data" },
            transformRequest: (data) => data,
          };

          if (recipe.fotoPrincipal?.startsWith("file://")) {
            const fotoData = new FormData();
            fotoData.append("archivo", {
              uri: recipe.fotoPrincipal,
              type: "image/jpeg",
              name: "fotoPrincipal.jpg",
            });
            await api.post(`/recetas/${idReceta}/foto-principal`, fotoData, config);
          }

          for (let i = 0; i < recipe.fotosAdicionales.length; i++) {
            const f = recipe.fotosAdicionales[i];
            if (f.urlFoto?.startsWith("file://")) {
              const fotoData = new FormData();
              fotoData.append("archivo", {
                uri: f.urlFoto,
                type: "image/jpeg",
                name: `fotoAdicional_${i}.jpg`,
              });
              await api.post(`/recetas/${idReceta}/foto-adicional`, fotoData, config);
            }
          }

          for (let i = 0; i < recipe.pasos.length; i++) {
            const paso = recipe.pasos[i];
            for (let j = 0; j < paso.multimedia.length; j++) {
              const media = paso.multimedia[j];
              if (media.urlContenido?.startsWith("file://")) {
                const mediaData = new FormData();
                mediaData.append("archivo", {
                  uri: media.urlContenido,
                  type: media.tipo_contenido === "video" ? "video/mp4" : "image/jpeg",
                  name: `paso_${i}_media_${j}.${media.tipo_contenido === "video" ? "mp4" : "jpg"}`,
                });
                await api.post(
                  `/recetas/${idReceta}/paso/${i}/media`,
                  mediaData,
                  config
                );
              }
            }
          }
          navigation.navigate("LoadedRecipe");
          limpiarFormulario();
        } catch (e) {
          console.log("Error en submitRecipe:", {
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

    if (loadingMedia) {
    return <UploadingScreen />;
    }

  return (
      <View style={{ flex: 1 }} pointerEvents={loadingMedia ? "none" : "auto"}>
        <ScrollView style={styles.container}>

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
                  <Picker.Item label="Seleccione un tipo" value="" style={{fontFamily:"SOra_400Regular"}}/>
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
                <View style={styles.previewContainer}>
                  <Image source={{ uri: recipe.fotoPrincipal }} style={styles.imagePreview} />
                  <Pressable
                    style={styles.deleteMediaButton}
                    onPress={() => handleChange("fotoPrincipal", null)}
                  >
                    <Text style={styles.deleteText}>✕</Text>
                  </Pressable>
                </View>
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
                    <View key={k} style={styles.previewContainer}>
                      {m.tipo_contenido === "imagen" ? (
                        <Image source={{ uri: m.urlContenido }} style={styles.imagePreview} />
                      ) : (
                        <View style={styles.videoPlaceholder}>
                          <Text>Video: {m.urlContenido}</Text>
                        </View>
                      )}
                      <Pressable
                        style={styles.deleteMediaButton}
                        onPress={() => removeMediaFromStep(i, k)}
                      >
                        <Text style={styles.deleteText}>✕</Text>
                      </Pressable>
                    </View>
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
                  <View key={i} style={styles.previewContainer}>
                    <Image source={{ uri: f.urlFoto }} style={styles.imagePreview} />
                    <Pressable
                      style={styles.deleteMediaButton}
                      onPress={() => removeExtraPhoto(i)}
                    >
                      <Text style={styles.deleteText}>✕</Text>
                    </Pressable>
                  </View>
                ))}

              </ScrollView>
              <Pressable style={styles.save} onPress={() => submitRecipe(navigation)}>
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
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 15,

  },
  addButtonText: {
    fontFamily: "Sora_700Bold",
    color: "white",
    fontSize: 16,
  },
  save: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
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
  previewContainer: {
    position: "relative",
    margin: 5,
  },

  deleteMediaButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },

  deleteText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },

});
