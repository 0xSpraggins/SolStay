import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IStackScreenProps } from "../navigation/StackScreenProps";
import MainNavBar from "../components/MainNavBar";
import { NavigationContainer } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import AvailableProperties from "../components/AvailableProperties";
import * as solStayService from '../Services/SolStayService';
import { useSolanaWalletState } from "../Context/SolanaWallet";

const HomeScreen: React.FunctionComponent<IStackScreenProps> = (props) => {
  const {navigation, route, nameProp} = props;

  return (
    <View style={{flex: 1}}>
      <View style={styles.SearchBar}>
        <SearchBar />
      </View>
      <ScrollView style={styles.MainView}>
        <AvailableProperties />
      </ScrollView>
      {/* <View style={styles.NavBar}>
        <MainNavBar />
      </View> */}
      {/* <NavigationContainer independent={true}>
        <MainNavBar />
      </NavigationContainer> */}
    </View>
  );  
} 

const styles =  StyleSheet.create({
  SearchBar: {
    flex: .2,
    justifyContent: "center"
  },
  MainView: {
    flex: .75,
  },
  NavBar: {
    
  },
});

export default HomeScreen;