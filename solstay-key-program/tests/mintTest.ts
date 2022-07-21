import * as anchor from "@project-serum/anchor";
import { SolstayKeyProgram } from "../target/types/solstay_key_program";

describe("solstay-key-program", () => {

  const testNFTName = "SolStay - Key";
  const testNFTSymbol = "STAY";
  const testNFTUri = "https://raw.githubusercontent.com/baileyspraggins/SolStay/main/solstay-key-program/tests/Assets/testNftMetadata.json";

  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);

  const program = anchor.workspace.SolstayKeyProgram as anchor.Program<SolstayKeyProgram>;

  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  it("Mint Key", async () => {

    // Create mint address and associated token account address
    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mintKeypair.publicKey,
      owner: wallet.publicKey,
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

    const masterEditioAddress = (await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    console.log("Master Edition Metadata created");

    // Use the mint function from the solstay_key_program
    try {
      await program.methods.mint(
        testNFTName, testNFTSymbol, testNFTUri
      ).accounts({
        metadata: metadataAddress,
        masterEditionMetadata: masterEditioAddress,
        mint: mintKeypair.publicKey,
        tokenAccount: tokenAddress,
        mintAuthority: wallet.publicKey,
        mplTokenMetadata: TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([mintKeypair])
      .rpc();
      console.log("NFT Minted");
    } catch (error) {
      console.log(error);
    }
  });
});
