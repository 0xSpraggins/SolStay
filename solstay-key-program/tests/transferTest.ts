import * as anchor from "@project-serum/anchor";
import { create } from "domain";
import fs from 'mz/fs';
import { SolstayKeyProgram } from "../target/types/solstay_key_program";

async function createKeypairFromFile(filepath: string): Promise<anchor.web3.Keypair> {
    const secretKeyString = await fs.readFile(filepath, {encoding: 'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return anchor.web3.Keypair.fromSecretKey(secretKey);
}

describe("NFT Transfer", async () => {
    const provider = anchor.AnchorProvider.env();
    const wallet = provider.wallet as anchor.Wallet;
    anchor.setProvider(provider);

    const program = anchor.workspace.SolstayKeyProgram as anchor.Program<SolstayKeyProgram>;

    it("Transfer NFT", async () => {

        const saleAmount = 1 * anchor.web3.LAMPORTS_PER_SOL;
        const mint: anchor.web3.PublicKey = new anchor.web3.PublicKey(
            ""
        );

        const buyer: anchor.web3.Keypair = await createKeypairFromFile(__dirname + "/Keypairs/customer1.json");

        console.log(`Buyers Pubklic Key: ${buyer.publicKey}`);

        const ownerTokenAddress = await anchor.utils.token.associatedAddress({
            mint: mint,
            owner: wallet.publicKey
        });

        const buyerTokenAddress = await anchor.utils.token.associatedAddress({
            mint: mint,
            owner: wallet.publicKey
        });

        await program.methods.transfer(
            new anchor.BN(saleAmount)
        )
        .accounts({
            mint: mint,
            ownerTokenAccount: ownerTokenAddress,
            ownerAuthority: wallet.publicKey,
            buyerTokenAccount: buyerTokenAddress,
            buyerAuthority: buyer.publicKey,
        })
        .signers([buyer])
        .rpc()
    })
})