import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { IStackScreenProps } from "../navigation/StackScreenProps";

const SettingsScreen: React.FunctionComponent<IStackScreenProps> = (props) => {
    const {navigation, route, nameProp} = props;
    // cpmst [userContext, setUserContext] = useContext(User)
    return (
        <View>
            <Text>Settings Screen</Text>
            {/* <Pressable onPress={() => set}>Log Out</Pressable> */}
        </View>
    )
}


const styles = StyleSheet.create({

})

export default SettingsScreen;