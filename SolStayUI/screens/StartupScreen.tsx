import { Button, Image, StyleSheet, Text, View } from "react-native";
const MainLogo = require('../assets/images/SolStayLogo.png');



const StartupScreen = () => {
    return (
        <View style={styles.startupContainer}>
            <Image 
                source={MainLogo}
                style={styles.logo}
            />
            <Button
                title="Create New Account" 
                color="#913D88"
            />
            <Button
                title="Import Account" 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    startupContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        width: 262,
        height: 262,
    }
});

export default StartupScreen;

