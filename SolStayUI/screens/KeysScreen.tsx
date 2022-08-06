import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IStackScreenProps } from "../navigation/StackScreenProps";

const KeysScreen: React.FunctionComponent<IStackScreenProps> = (props) => {
    const {navigation, route, nameProp} = props;

    return (
        <View>
            <Text>Keys Screen</Text>
        </View>
    )
}


const styles = StyleSheet.create({

})

export default KeysScreen;