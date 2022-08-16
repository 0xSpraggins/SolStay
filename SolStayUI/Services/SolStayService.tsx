import { faBalanceScale, faRandom } from '@fortawesome/free-solid-svg-icons';
import { getStateFromPath } from '@react-navigation/native';
import { Keypair, Connection, clusterApiUrl, Cluster, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction} from '@solana/web3.js';
import * as Bip39 from "bip39";
import { ethers } from "ethers";
import * as Random from "expo-random";
import * as anchor from "../Anchor/dist/browser/index";
import { useSolanaWalletState } from '../Context/SolanaWallet';
import { programIdl } from '../programIdl';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
const assert = require("assert");

if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer

export const solanaConnect = (network: Cluster) => {
    return new Connection(clusterApiUrl(network), 'confirmed');
}

export async function createNewWallet(recoveryPhrase: string): Promise<Keypair> {
    
    console.log(`Creating wallet with recovery phrase: ${recoveryPhrase}`);
    const newAccount = await accountFromMnemonic(recoveryPhrase);
    console.log(`Public Key: ${newAccount.publicKey}`);
    return newAccount;

}

export async function generateMnemonic(): Promise<string> {
    // Generate a random byte array to use to read the mnemonic phrase
    const randomBytes = await Random.getRandomBytesAsync(16);
    const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
    
    return mnemonic;
}

async function generateKeypair(): Promise<Keypair> {
    const phrase = await generateMnemonic();
    const account = await createNewWallet(phrase);
    return account;
}

export async function accountFromMnemonic(recoveryPhrase: string): Promise<Keypair> {
    //Convert the mnemonic phrase to a seed phrase
    const seed = Bip39.mnemonicToSeedSync(recoveryPhrase);
    return Keypair.fromSeed(seed.subarray(0, 32));

}


async function loadAnchor(network: Cluster, payer: Keypair): Promise<anchor.Program> {
    const programId = new PublicKey(
        "8PCTb312rhuBU7pM1btq6Dy9XPjrEnqEPQySxxADRjGA"
    );

    const connection = solanaConnect(network);
    
    const provider = new anchor.AnchorProvider(connection, payer,{
        commitment: "processed",
    });

    anchor.setProvider(provider);
    const newProgram = new anchor.Program(programIdl, programId, provider, undefined);
    
    return newProgram;
}

export async function mintNFT(network: Cluster, userWallet: Keypair): Promise<boolean> {
    const nftName = "SolStay - Key";
    const nftSymbol = "STAY";
    const nftUri = "https://raw.githubusercontent.com/baileyspraggins/SolStay/main/solstay-key-program/tests/Assets/testNftMetadata.json"


    const program = await loadAnchor(network, userWallet);

    console.log(program);
    //const program = anchor.web3.
    //Import the token metadata program id
    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    
    // Create mint address and associated token account address
    const mintKeypair: Keypair = await generateKeypair();
    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mintKeypair.publicKey,
      owner: userWallet.publicKey,
    });
    console.log(`New token: ${mintKeypair.publicKey}`);

    // create metadata address
    const metadataAddress = (await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    console.log("Metadata created!");

    const masterEditionAddress = (await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    console.log("Master Edition Metadata created");
    
    if (program != null) {
        try {
            // Use the mint function from the solstay_key_program
            await program.methods.mint(
                nftName, nftSymbol, nftUri
                ).accounts({
                metadata: metadataAddress,
                masterEditionMetadata: masterEditionAddress,
                mint: mintKeypair.publicKey,
                tokenAccount: tokenAddress,
                mintAuthority: userWallet.publicKey,
                mplTokenMetadata: TOKEN_METADATA_PROGRAM_ID,
                })
                .signers([mintKeypair])
                .rpc().then((response: any) => {console.log(response)});
        } catch (err) {
            console.log("could not create NFT");
            console.log(err);
            return false;
        }
        console.log("NFT Minted");
    } else {
        console.log("could not load program");
    }
    return true;

}


export async function getBalance(account: Keypair | null, network: Cluster): Promise<number> {

    if (account) {
        try {
            const connection = solanaConnect(network);
            const balance = await connection.getBalance(account.publicKey);
            return balance;
        } catch (err) {
            console.log(err);
            return 0;
        }
    } else {
        console.log("No account is loaded");
        return 0;
    }
}

export async function transferSol(fromWallet: Keypair, toWallet: PublicKey, numSol: number, network: Cluster): Promise<boolean> {
    const connection = solanaConnect(network);

    let transaction = new Transaction();

    transaction.add(
        SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: toWallet,
            lamports: numSol * LAMPORTS_PER_SOL
        })
    );
    
    try {
        sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet]
        );
    } catch (err) {
        console.log(err);
        return false;
    }
    
    return true;
}

export async function airDropSol(account: Keypair, network: Cluster): Promise<boolean> {
    const lamports = (network === 'devnet') ? 2 * LAMPORTS_PER_SOL : LAMPORTS_PER_SOL;

    try {
        const connection = solanaConnect(network);
        await connection.requestAirdrop(account.publicKey, lamports);
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

