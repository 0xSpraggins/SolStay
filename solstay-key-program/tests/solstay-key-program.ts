import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolstayKeyProgram } from "../target/types/solstay_key_program";

describe("solstay-key-program", () => {

  const testNFTName = "SolStay - Key";
  const testNFTSymbol = "STAY";
  const testNFTUri = ""

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolstayKeyProgram as Program<SolstayKeyProgram>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
