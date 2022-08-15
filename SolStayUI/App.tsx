import React, { createContext, useContext, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './navigation/Navigation';
import { SolanaWalletContext } from './Context/SolanaWallet';
import { Cluster, Keypair } from '@solana/web3.js';
import 'react-native-get-random-values';

const Stack = createStackNavigator();


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // Initialize the starting states of the Solana Wallet Context.
  // In future updates store in memory
  const [network, setNetwork] = useState<Cluster>("devnet");
  const [account, setAccount] = useState<Keypair | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SolanaWalletContext.Provider value={{network, setNetwork, account, setAccount, mnemonic, setMnemonic, balance, setBalance, isOwner, setIsOwner}}>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </SolanaWalletContext.Provider>
    );
  }
}
