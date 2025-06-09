import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomePage from "./paginas/HomePage";
import SearchPage from "./paginas/SearchPage";
import LoginPage from "./paginas/LoginPage";
import InfoReceta from "./paginas/InfoReceta";
import TodasRecetas from "./paginas/TodasRecetas";
import TodosCursos from "./paginas/TodosCursos";
import InfoCurso from "./paginas/InfoCurso";
import Profile from "./paginas/Profile";
import Notificaciones from "./paginas/Notificaciones";
import OfertasCursos from "./paginas/OfertasCursos";
import RecipeLoad from "./paginas/RecipeLoad";
import ProfileNotLogged from "./paginas/ProfileNotLogged";
import RegisterPage from "./paginas/RegisterPage";
import LoadedRecipe from "./paginas/LoadedRecipe";
import Splash from "./paginas/Splash";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import FormNotLogged from "./components/FormNotLogged";
import SecondStepRegister from "./paginas/SecondStepRegister";
import ThirdStepRegister from "./paginas/ThirdStepRegister";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserData from "./paginas/UserData";
import PopUpLogOut from "./components/PopUpLogOut";
import CustomDrawer from "./components/CustomDrawer";
import { colors } from "./utils/themes";
import "react-native-reanimated";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: colors.primary,
      drawerActiveTintColor: "#fff",
      drawerInactiveTintColor: "#000",
    }}
  >
    <Drawer.Screen
      name="Mis Datos"
      component={UserData}
      options={{
        drawerIcon: () => {
          <Ionicons name="server-outline" size={22} color={"#000"} />;
        },
      }}
    />
    <Drawer.Screen
      name="Asistencia"
      component={""}
      options={{
        drawerIcon: () => {
          <Ionicons name="checkmark-circle-outline" size={22} color={"#000"} />;
        },
      }}
    />
    <Drawer.Screen
      name="Cerrar Sesion"
      component={PopUpLogOut}
      options={{
        drawerIcon: () => {
          <Ionicons name="log-out-outline" size={22} color={"#000"} />;
        },
      }}
    />
  </Drawer.Navigator>;
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Menú") iconName = "home-outline";
          else if (route.name === "Búsqueda") iconName = "search-outline";
          else if (route.name === "Cargar") iconName = "add-outline";
          else if (route.name === "Notificaciones")
            iconName = "notifications-outline";
          else if (route.name === "Perfil") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Menú" component={HomePage} />
      <Tab.Screen name="Búsqueda" component={SearchPage} />
      <Tab.Screen name="Cargar" component={RecipeLoad} />
      <Tab.Screen name="Notificaciones" component={Notificaciones} />
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
}

function TabNavigatorVisitante() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Menú") iconName = "home-outline";
          else if (route.name === "Búsqueda") iconName = "search-outline";
          else if (route.name === "Perfile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Menú" component={HomePage} />
      <Tab.Screen name="Búsqueda" component={SearchPage} />
      <Tab.Screen name="Perfile" component={ProfileNotLogged} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { token, loading, user } = useContext(AuthContext);
  const context = useContext(AuthContext);

  if (loading) {
      return <Splash />; // mientras carga el contexto, mostrar splash
  }

  console.log("Contexto actual:", context);
  console.log("user tokn: ", token);
  console.log("usuario: ", user);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Pantalla splash inicial */}
              <Stack.Screen name="Splash" component={Splash} />

              {/* Si NO está logueado */}
              {!token ? (
                <>
                  <Stack.Screen name="Menú" component={TabNavigatorVisitante} options={{ headerShown: false }} />
                  <Stack.Screen name="Main" component={TabNavigatorVisitante} options={{ headerShown: false }} />
                  <Stack.Screen name="LoginPage" component={LoginPage} />
                  <Stack.Screen name="RegisterPage" component={RegisterPage} />
                  <Stack.Screen name="SecondStepRegister" component={SecondStepRegister} />
                  <Stack.Screen name="ThirdStepRegister" component={ThirdStepRegister} />
                  <Stack.Screen name="TodasRecetas" component={TodasRecetas} />
                  <Stack.Screen name="TodosCursos" component={TodosCursos} />
                  <Stack.Screen name="InfoReceta" component={InfoReceta} />
                  <Stack.Screen name="SearchPage" component={SearchPage} />
                  <Stack.Screen name="InfoCurso" component={InfoCurso} />
                </>
              ) : (
                <>
                  {/* Si está logueado */}
                  <Stack.Screen name="OfertasCursos" component={OfertasCursos} />
                  <Stack.Screen name="Menú" component={TabNavigator} />
                  <Stack.Screen name="Main" component={TabNavigator} />
                  <Stack.Screen name="LoginPage" component={LoginPage} />
                  <Stack.Screen name="RegisterPage" component={RegisterPage} />
                  <Stack.Screen name="SecondStepRegister" component={SecondStepRegister} />
                  <Stack.Screen name="ThirdStepRegister" component={ThirdStepRegister} />
                  <Stack.Screen name="TodasRecetas" component={TodasRecetas} />
                  <Stack.Screen name="TodosCursos" component={TodosCursos} />
                  <Stack.Screen name="InfoReceta" component={InfoReceta} />
                  <Stack.Screen name="InfoCurso" component={InfoCurso} />
                  <Stack.Screen name="LoadedRecipe" component={LoadedRecipe} />
                  <Stack.Screen name="SearchPage" component={SearchPage} />
                </>
              )}
            </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
