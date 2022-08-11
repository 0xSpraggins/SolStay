import { DEFAULT_ICON_COLOR } from "@expo/vector-icons/build/createIconSet";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import MainNavBar from "../components/MainNavBar";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import routes from './Routes';


const Navigation = () => {
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createStackNavigator();

function RootNavigator() {
    const {account} = useSolanaWalletState();

    if (account) {
        return (
            <MainNavBar />
        );
    } else {
        return (
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
        );
    }
}

export default Navigation;