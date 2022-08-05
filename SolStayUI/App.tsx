import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import routes from './navigation/Routes';
import StartupScreen from './screens/StartupScreen';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
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
    );
  }
}
