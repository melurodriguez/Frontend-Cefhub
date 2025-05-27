import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomePage from './paginas/HomePage';
import SearchPage from './paginas/SearchPage';
import LoginPage from './paginas/LoginPage';
import InfoReceta from './paginas/InfoReceta';
import TodasRecetas from './paginas/TodasRecetas';
import TodosCursos from './paginas/TodosCursos';
import InfoCurso from './paginas/InfoCurso';
import Profile from './paginas/Profile';
import Notificaciones from './paginas/Notificaciones';
import RecipeLoad from './paginas/RecipeLoad';
import ProfileNotLogged from './paginas/ProfileNotLogged';
import RegisterPage from './paginas/RegisterPage';
import LoadedRecipe from './paginas/LoadedRecipe';
import Splash from './paginas/Splash';
import { useContext } from 'react';
import AuthContext from './auth/AuthContext';
import FormNotLogged from './components/FormNotLogged';
import AuthProvider from './auth/AuthProvider';


const Stack= createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  

  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Menú') iconName = 'home-outline'
          else if (route.name === 'Búsqueda') iconName = 'search-outline'
          else if (route.name === 'Cargar') iconName='add-outline'
          else if (route.name === 'Notificaciones') iconName='notifications-outline'
          else if (route.name === 'Perfil') iconName = 'person-outline'
          
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Menú" component={HomePage}/>
      <Tab.Screen name="Búsqueda" component={SearchPage}/>
      <Tab.Screen name="Cargar" component={RecipeLoad}/>
      <Tab.Screen name="Notificaciones" component={Notificaciones}/>
      <Tab.Screen name="Perfil" component={Profile}/>
      <Tab.Screen name="Perfile" component={ProfileNotLogged}/>
      
      
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { userToken } = useContext(AuthContext);
  const context = useContext(AuthContext);
  console.log("Contexto actual:", context);


  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
        {userToken
          ? <Stack.Screen name="Main" component={TabNavigator} />
          : <Stack.Screen name="Perfile" component={FormNotLogged} />
        }
    
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="InfoCurso" component={InfoCurso} />
        <Stack.Screen name="InfoReceta" component={InfoReceta} />
        <Stack.Screen name="TodosCursos" component={TodosCursos} />
        <Stack.Screen name="TodasRecetas" component={TodasRecetas} />
        <Stack.Screen name="RegisterPage" component={RegisterPage} />
        <Stack.Screen name="LoadedRecipe" component={LoadedRecipe} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator
