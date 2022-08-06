import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faGear, faHouseChimneyWindow, faKey } from "@fortawesome/free-solid-svg-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import KeysScreen from "../screens/KeysScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const MainNavBar = () => {

    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{
            tabBarStyle: styles.NavBarContainer,
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#000000',
            tabBarShowLabel: false,
            headerShown: false,
        }}>
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{
                    tabBarIcon: ({color}) => (
                        <FontAwesomeIcon 
                            size={55}
                            color={color}
                            icon={faHouseChimneyWindow as IconProp}
                        />
                    )
                }}
            />
            <Tab.Screen 
                name="Keys" 
                component={KeysScreen} 
                options={{
                    tabBarIcon: ({color}) => (
                        <FontAwesomeIcon 
                            size={55}
                            color={color}
                            icon={faKey as IconProp}
                        />
                    )
                }}/>
            <Tab.Screen 
            name="Settings"
            component={SettingsScreen} 
            options={{
                tabBarIcon: ({color}) => (
                    <FontAwesomeIcon 
                        size={55}
                        color={color}
                        icon={faGear as IconProp}
                    />
                )
            }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    NavBarContainer: {
        height: 100,
        flexDirection: "row",
        backgroundColor: '#913D88',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 25,
    },

});


export default MainNavBar;