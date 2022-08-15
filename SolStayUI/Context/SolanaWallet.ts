import { Keypair, Cluster } from "@solana/web3.js";
import { Mnemonic } from "ethers/lib/utils";
import React, { createContext, useContext } from "react";

export type WalletContextType = {
    network: Cluster;
    setNetwork: React.Dispatch<React.SetStateAction<Cluster>>;
    account: Keypair | null;
    setAccount: React.Dispatch<React.SetStateAction<Keypair | null>>;
    mnemonic: string | null;
    setMnemonic: React.Dispatch<React.SetStateAction<string | null>>;
    balance: number;
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    isOwner: boolean;
    setIsOwner: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SolanaWalletContext = createContext<WalletContextType>({
    network: "devnet",
    setNetwork: () => null,
    account: null,
    setAccount: () => null,
    mnemonic: null,
    setMnemonic: () => null,
    balance: 0,
    setBalance: () => 0,
    isOwner: false,
    setIsOwner: () => 0,
  });
  
  export const useSolanaWalletState = () => useContext(SolanaWalletContext);