import { AuthProvider } from './auth/AuthContext';
import AppNavigator from './AppNavigator';

//Stack.Navigator no deja espacio para elementos externos.
//Bottom Tabs Navigation es lo adecuado para barras inferiores:

//import icon from './assets/icon.png'
//navbar fuera del scroll view para q se manetnga fija


export default function App() {
  console.log(AuthProvider)
  console.log(AppNavigator)
  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
    
  );
}


