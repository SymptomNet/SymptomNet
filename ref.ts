// clearAndCreateRecord.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SymptomNet } from "../target/types/symptom_net"; // Adjust path if needed
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"; // If needed for other accounts
import * as fs from "fs";
import * as path from "path";

describe("Clear Counter and Create New Record", () => {
  // Configure the client to use the local cluster (or your desired cluster)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SymptomNet as Program<SymptomNet>;

  // --- Keypairs ---
  // Authority: The one who initialized the contract and can reset the counter
  const authority = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.config/solana/id.json'), 'utf-8')))
  );
  // Doctor: The one who will submit the new record
  const doctor1 = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.config/solana/doctor1.json'), 'utf-8')))
  );

  // --- PDAs ---
  // These PDAs are needed by multiple operations
  let statePda: PublicKey;
  let recordCounterPda: PublicKey;
  let tokenMintPda: PublicKey; // Assuming your program uses a token mint

  // Doctor specific PDAs (needed for submitRecord)
  let doctor1AccountPda: PublicKey;

  before(async () => {
    // Derive common PDAs
    [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("state"), authority.publicKey.toBuffer()],
      program.programId
    );
    [recordCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("record_counter"), authority.publicKey.toBuffer()],
      program.programId
    );
    [tokenMintPda] = PublicKey.findProgramAddressSync( // If your program init creates one
        [Buffer.from("SYMPT"), authority.publicKey.toBuffer()],
        program.programId
    );

    // Derive Doctor 1's account PDA
    [doctor1AccountPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("doctor"), doctor1.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Resets the record counter", async () => {
    console.log("Attempting to reset record counter...");
    try {
      await program.methods
        .resetRecordCount()
        .accounts({
          authority: authority.publicKey,
          state: statePda,
          recordCounter: recordCounterPda,
        })
        .signers([authority])
        .rpc({ commitment: "confirmed" }); // Wait for confirmation
      console.log("Record counter successfully reset.");

      // Verify by fetching the counter
      const counterAccount = await program.account.recordCounter.fetch(recordCounterPda);
      assert.ok(counterAccount.counter.toNumber() === 0, "Counter should be 0 after reset.");
      console.log("Verified: Record counter is now 0.");
    } catch (e) {
      console.error("Failed to reset record counter:", e);
      throw e; // Fail the test if reset fails
    }
  });

  it("Doctor 1 submits a new record (should get ID 0)", async () => {
    // The counter should be 0 now, so the new record ID will be 0
    const newRecordId = new anchor.BN(0); 

    // Derive PDA for the new record (ID 0) using the new PDA format
    const [newRecordPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("record"),
        authority.publicKey.toBuffer(), // state.authority
        newRecordId.toArrayLike(Buffer, "le", 8), // record_id as bytes
      ],
      program.programId
    );
    console.log(`Derived PDA for new record (ID ${newRecordId.toNumber()}): ${newRecordPda.toString()}`);

    const sickness = "Common Cold";
    const symptoms = "Runny nose, cough";
    const treatment = "Rest and fluids";

    try {
      console.log("Attempting to submit a new record...");
      await program.methods
        .submitRecord(sickness, symptoms, treatment)
        .accounts({
          doctor: doctor1.publicKey,
          doctorAccount: doctor1AccountPda, // Doctor's own account
          state: statePda,
          recordCounter: recordCounterPda,
          record: newRecordPda, // The PDA for the new record account to be created
          // systemProgram and rent are usually implicitly handled by Anchor if not specified
          // but good to be explicit if your macro requires them
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([doctor1]) // The doctor signs to pay for the record account
        .rpc({ commitment: "confirmed" });
      console.log(`Record (ID ${newRecordId.toNumber()}) submitted successfully!`);

      // Verify the record was created
      const recordAccount = await program.account.record.fetch(newRecordPda);
      assert.ok(recordAccount.id.eq(newRecordId), `Record ID should be ${newRecordId.toNumber()}`);
      assert.equal(recordAccount.sickness, sickness);
      assert.equal(recordAccount.symptoms, symptoms);
      assert.equal(recordAccount.treatment, treatment);
      assert.ok(recordAccount.submitter.equals(doctor1.publicKey), "Submitter mismatch");
      console.log("Verified: New record created with correct data.");

      // Verify counter incremented
      const counterAccount = await program.account.recordCounter.fetch(recordCounterPda);
      assert.ok(counterAccount.counter.toNumber() === 1, "Counter should be 1 after submission.");
      console.log("Verified: Record counter is now 1.");

    } catch (e) {
      console.error("Failed to submit new record:", e);
      throw e;
    }
  });
});