import { NavigationContainer } from '@react-navigation/native';
import React, { createContext, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import routes from './navigation/Routes';
import StartupScreen from './screens/StartupScreen';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavBar from './components/MainNavBar';


const Stack = createStackNavigator();


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const UserContext = React.createContext('');
  const [user, setUser] = useState('safudhio7348903w')

  if (!isLoadingComplete) {
    return null;
  } else if (user.length > 1) {
    return (
      <NavigationContainer>
        <MainNavBar />
      </NavigationContainer>
    );
  } else {
    return (
      // <UserContext.Provider value={[user, setUser]}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName='StartupScreen'
            screenOptions={{
              headerShown: false,
            }}>
            {routes.map((r,i) => (
              <Stack.Screen key={i} name={r.name}>
                {(props) => <r.component nameProp={r.name} {...props} />}
              </Stack.Screen>
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      // </UserContext.Provider>
    );
  }
}
