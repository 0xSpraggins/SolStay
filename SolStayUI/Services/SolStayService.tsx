import { Keypair, Connection, clusterApiUrl, Cluster, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction, SYSVAR_RENT_PUBKEY} from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as Bip39 from "bip39";
import { ethers } from "ethers";
import * as Random from "expo-random";
import * as borsh from "@project-serum/borsh";
import Metaplex from "../js-react-native/Metaplex";

const BN = require('bn.js');

if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer
const SOLSTAY_PROFIT_PUBKEY  = new PublicKey("73x2NKEnXPo4qMupw75VgLLBTxDHKutJVG7ndPxP3qK");


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

export async function mintKey(network: Cluster, userWallet: Keypair, propertyOwnerId: PublicKey, totalCost: number): Promise<string | null> {

    let functionResult: string | null = null;

    //Estalish a connection with the Solana Blockchain
    const connection = await solanaConnect(network);
    //Init the programId
    const programId = new PublicKey("GFAeoYkQ7MVDBKoTg4vhfU5nS7BqHZgW4gH5GFiaviPi");

    //Derive the mint address and associated token account address
    const mintKeypair: Keypair = await generateKeypair();
    const tokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      userWallet.publicKey
    );
    console.log(`New token: ${mintKeypair.publicKey}`);
    
    // create metadata address and the masterEdition address from the metaplex token program id
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );
    const metadataAddress = (await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      ))[0];

    console.log("Metadata Address", metadataAddress);

      const masterEditionAddress = (await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      ))[0];
    
      console.log("Metadata and master edition accounts created successfully!");

    // Define the borsh struct and schema definition for creating the data buffer
    const paymentSchema = borsh.struct([
        borsh.u64('num_lamports'),
    ])

    // Cast the amount to a big number to allow it to be encoded
    const paymentAmount = new BN(totalCost);
    // Allocate a large buffer size
    const buffer = Buffer.alloc(1000);
    
    //Encode and slice the buffer to get the final databuffer to be sent to on-chain contract
    paymentSchema.encode({num_lamports: paymentAmount}, buffer);
    const dataBuffer = buffer.subarray(0, paymentSchema.getSpan(buffer));

    //Create a new transaction instruction
    const instruction = new TransactionInstruction({
        keys: [
            // Mint account
            {
                pubkey: mintKeypair.publicKey,
                isSigner: true,
                isWritable: true,
            },
            // Token account
            {
                pubkey: tokenAddress,
                isSigner: false,
                isWritable: true,
            },
            // Mint Authority
            {
                pubkey: userWallet.publicKey,
                isSigner: true,
                isWritable: true,
            },
            // Rent account
            {
                pubkey: SYSVAR_RENT_PUBKEY,
                isSigner: false,
                isWritable: false,
            },
            // System program
            {
                pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
            // Token program
            {
                pubkey: TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            // Associated token program
            {
                pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            // Metdata account
            {
                pubkey: metadataAddress,
                isSigner: false,
                isWritable: true,
            },
            // Master edition metadata account
            {
                pubkey: masterEditionAddress,
                isSigner: false,
                isWritable: true,
            },
            // Metaplex Token metadata account
            {
                pubkey: TOKEN_METADATA_PROGRAM_ID,
                isSigner: false,
                isWritable: false
            },
            // Property owner account
            {
                pubkey: propertyOwnerId,
                isSigner: false,
                isWritable: true,
            },
            // Solstay profit account
            {
                pubkey: SOLSTAY_PROFIT_PUBKEY,
                isSigner: false,
                isWritable: true,
            }
        ],
        programId: programId,
        data: dataBuffer,
    })

    try {
        await sendAndConfirmTransaction(
            connection,
            new Transaction().add(instruction),
            [userWallet, mintKeypair],
        ).then((response) => {
            functionResult = response;
        });
    } catch (err) {
        console.log(err);
        functionResult = null;
    }

    return functionResult;

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


