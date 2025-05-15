import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor/dist/cjs";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import idl from "../idl/symptom_net.json"
import { SymptomNetContract } from "../types/symptomNet"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "bn.js";
import user from "../model/user";

const SYMPTOM_NET_ADDRESS = process.env.SYMPTOMNET_ID
const ADMIN_WALLET = process.env.ADMIN_WALLET

export default class Blockchain {
    instance = null;
    programId
    connection
    adminWallet

    constructor() {
        if (this.instance) {
            return this.instance
        }

        this.programId = new PublicKey(SYMPTOM_NET_ADDRESS)
        this.connection = new Connection("https://api.devnet.solana.com", "confirmed");
        this.adminWallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(ADMIN_WALLET)))
        this.instance = this
    }

    getProgram(wallet: Keypair) {
        const provider = new AnchorProvider(
            this.connection,
            new Wallet(wallet),
            { commitment: "confirmed" }
        )
        return new Program<SymptomNetContract>(idl, provider)
    }
    
    async submitRecord(doctorWallet: Keypair, sickness: string, symptoms: string, treatment: string) {
        const program = this.getProgram(doctorWallet);

        // Derive PDAs
        const [statePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("state"), this.adminWallet.publicKey.toBuffer()],
            this.programId
        );

        const [recordCounterPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("record_counter"), this.adminWallet.publicKey.toBuffer()],
            this.programId
        );

        const [doctorAccountPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("doctor"), doctorWallet.publicKey.toBuffer()],
            this.programId
        );

        // Get current record counter to derive record PDA
        const recordCounter = await program.account.recordCounter.fetch(recordCounterPda);
        const recordId = recordCounter.counter.toNumber();

        const [recordPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("record"), 
                this.adminWallet.publicKey.toBuffer(),
                new BN(recordId).toArrayLike(Buffer, 'le', 8),
            ],
            this.programId
        );

        try {
            const ret = await program.methods
                .submitRecord(sickness, symptoms, treatment)
                .accounts({
                    doctor: doctorWallet.publicKey,
                    doctorAccount: doctorAccountPda,
                    state: statePda,
                    recordCounter: recordCounterPda,
                    record: recordPda,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: web3.SystemProgram.programId,
                })
                .signers([doctorWallet])
                .rpc();

            console.log("Record submitted successfully");
            return recordPda;
        } catch (error) {
            console.error("Error submitting record:", error);
            throw error;
        }
    }

    async verifyRecord(doctorWallet: Keypair, id: number) {
        const record = await this.getSpecificRecords(doctorWallet, id)
        if (record === undefined) {
            return {
                'ok': false,
                'msg': "Not found",
                'code': 404
            }
        }
        
        const [recordPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("record"), 
                this.adminWallet.publicKey.toBuffer(),
                new BN(id).toArrayLike(Buffer, 'le', 8),
            ],
            this.programId
        );
        
        const submitterPublicKey = record.submitter
        this.verifyRecordBC(doctorWallet, submitterPublicKey, recordPda)        
        return {
            'ok': true
        }
    }

    async verifyRecordBC(doctorWallet, submitterPublicKey, recordPda) {
        const program = this.getProgram(doctorWallet);
        
        // Derive PDAs
        const [statePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("state"), this.adminWallet.publicKey.toBuffer()],
            this.programId
        );

        const [tokenMintPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("SYMPT"), this.adminWallet.publicKey.toBuffer()],
            this.programId
        );
        
        const [doctorAccountPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("doctor"), doctorWallet.publicKey.toBuffer()],
            this.programId
        );
        
        const [submitterAccountPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("doctor"), submitterPublicKey.toBuffer()],
            this.programId
        );
        
        const [doctorTokenAccountPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("doctor-token"), doctorWallet.publicKey.toBuffer()],
            this.programId
        );
        
        const [submitterTokenAccountPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("doctor-token"), submitterPublicKey.toBuffer()],
            this.programId
        );
        
        try {
            await program.methods
            .verifyRecord()
            .accounts({
                doctor: doctorWallet.publicKey,
                doctorAccount: doctorAccountPda,
                submitterAccount: submitterAccountPda,
                record: recordPda,
                state: statePda,
                tokenMint: tokenMintPda,
                doctorTokenAccount: doctorTokenAccountPda,
                submitterTokenAccount: submitterTokenAccountPda,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([doctorWallet])
            .rpc();
            
            console.log("Record verified successfully");
            return await program.account.record.fetch(recordPda);
        } catch (error) {
            console.error("Error verifying record:", error);
            throw error;
        }
    }

    async fetchAllSymptomRecords(userWallet: Keypair) {
        const program = this.getProgram(userWallet)
        
        // 1. Derive the PDA for the RecordCounter account
        const [recordCounterPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("record_counter"), this.adminWallet.publicKey.toBuffer()], // Seeds must match your on-chain definition
            this.programId
        );

        // 2. Fetch the RecordCounter account to get the total number of records
        let recordCounterAccount;
        try {
            recordCounterAccount = await program.account.recordCounter.fetch(recordCounterPda);
        } catch (e) {
            console.error("Failed to fetch record counter:", e);
            return []; // Or throw error
        }
        
        const totalRecords = recordCounterAccount.counter.toNumber();
        console.log(`Total records expected: ${totalRecords}`);

        const fetchedRecords = [];

        // 3. Loop through all possible record IDs
        for (let i = 0; i < totalRecords; i++) {
            try {
                // 4. Derive PDA for the current record ID
                // The ID 'i' needs to be converted to an 8-byte little-endian buffer
                const recordIdBytes = new BN(i).toArrayLike(Buffer, 'le', 8);
                
                const [recordPda] = PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("record"), 
                        this.adminWallet.publicKey.toBuffer(),
                        recordIdBytes         // The record ID as bytes
                    ],
                    this.programId
                );

                // 5. Fetch the Record account data
                const recordData = await program.account.record.fetch(recordPda);
                
                // You can now use recordData, e.g., log it or add to a list
                console.log(`Fetched Record ID: ${recordData.id.toNumber()}`, {
                    sickness: recordData.sickness,
                    symptoms: recordData.symptoms,
                    submitter: recordData.submitter.toString(),
                    status: recordData.status,
                    verificationCount: recordData.verificationCount.toNumber(),
                    treatment: recordData.treatment, // The new field
                    // ... any other fields in your Record struct
                });
                fetchedRecords.push(recordData);

            } catch (error) {
                // It's good practice to handle cases where a specific record ID might not exist,
                // though with sequential IDs, this should ideally fetch all of them.
                console.warn(`Could not fetch record with ID ${i}. It might not exist or there was an error:`, error.message);
            }
        }
        return fetchedRecords;
    }

    async resetRecordCounter() {
        const program = this.getProgram(this.adminWallet)

        // Derive common PDAs
        const [statePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("state"), this.adminWallet.publicKey.toBuffer()],
            program.programId
        );
        const [recordCounterPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("record_counter"), this.adminWallet.publicKey.toBuffer()],
            program.programId
        );
        const [tokenMintPda] = PublicKey.findProgramAddressSync( // If your program init creates one
            [Buffer.from("SYMPT"), this.adminWallet.publicKey.toBuffer()],
            program.programId
        );

        try {
            await program.methods
                .resetRecordCount()
                .accounts({
                    authority: this.adminWallet.publicKey,
                    state: statePda,
                    recordCounter: recordCounterPda,
                })
                .signers([this.adminWallet])
                .rpc({ commitment: "confirmed" }); // Wait for confirmation
                console.log("Record counter successfully reset.");
        } catch (e) {
            console.error("Failed to reset record counter:", e);
            throw e; // Fail the test if reset fails
        }
    }
    
    async getSpecificRecords(userWallet: Keypair, id: number) {
        const program = this.getProgram(userWallet)
        
        // 1. Derive the PDA for the RecordCounter account
        const [recordCounterPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("record_counter"), this.adminWallet.publicKey.toBuffer()], // Seeds must match your on-chain definition
            this.programId
        );

        // 2. Fetch the RecordCounter account to get the total number of records
        let recordCounterAccount;
        try {
            recordCounterAccount = await program.account.recordCounter.fetch(recordCounterPda);
        } catch (e) {
            console.error("Failed to fetch record counter:", e);
            return undefined
        }

        // 3. Loop through all possible record IDs
        try {
            // 4. Derive PDA for the current record ID
            // The ID 'i' needs to be converted to an 8-byte little-endian buffer
            const recordIdBytes = new BN(id).toArrayLike(Buffer, 'le', 8);
            
            const [recordPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("record"), 
                    this.adminWallet.publicKey.toBuffer(),
                    recordIdBytes         // The record ID as bytes
                ],
                this.programId
            );

            const recordData = await program.account.record.fetch(recordPda);
            return recordData
        } catch (error) {
            console.warn(`Could not fetch record with ID ${id}. It might not exist or there was an error:`, error.message);
            return undefined
        }
    }

    async getUnverifiedRecords(userWallet: Keypair) {
        const data = await this.fetchAllSymptomRecords(userWallet)

        const otherData = data.filter((value) =>
            !userWallet.publicKey.equals(value.submitter))
        if (otherData.length === 0)
            return true
        return otherData[Math.floor(Math.random() * otherData.length)]
    }

    // depreciated
    // async getAllRecords(userWallet: Keypair, maxResults: number = 10) {
    //     const program = this.getProgram(userWallet);
        
    //     // Derive PDAs
    //     const [statePda] = PublicKey.findProgramAddressSync(
    //         [Buffer.from("state"), this.adminWallet.publicKey.toBuffer()],
    //         this.programId
    //     );
        
    //     const [recordCounterPda] = PublicKey.findProgramAddressSync(
    //         [Buffer.from("record_counter"), this.adminWallet.publicKey.toBuffer()],
    //         this.programId
    //     );
        
    //     const [recordListPda] = PublicKey.findProgramAddressSync(
    //         [Buffer.from("record-list"), userWallet.publicKey.toBuffer()],
    //         this.programId
    //     );

    //     let recordListExists = true;
    //     try {
    //         await program.account.recordList.fetch(recordListPda);
    //     } catch (e) {
    //         recordListExists = false;
    //     }

    //     if (!recordListExists) {
    //         try {
    //             await program.methods
    //             .getAllRecords(new BN(maxResults))
    //             .accounts({
    //                 user: userWallet.publicKey,
    //                 state: statePda,
    //                 recordCounter: recordCounterPda,
    //                 recordList: recordListPda,
    //                 rent: web3.SYSVAR_RENT_PUBKEY,
    //                 systemProgram: web3.SystemProgram.programId,
    //             })
    //             .signers([userWallet])
    //             .rpc();
    //         } catch (error) {
    //             console.error("Error getting all records:", error);
    //             throw error;
    //         }
    //     }

    //     // Fetch the list
    //     // TODO: @Derek recordList is broken and always return 1 (not incrementing)
    //     // this is broken and i have no idea why
    //     // const recordList = await program.account.recordList.fetch(recordListPda);
    //     // const totalRecords = recordList.total.toNumber();
        
    //     // Now fetch all records - this requires knowing all record PDAs
    //     // We need to get the records by iterating through the counter
    //     const recordCounter = await program.account.recordCounter.fetch(recordCounterPda);
    //     const totalRecords = recordCounter.counter.toNumber();
    //     const allRecords = [];
        
    //     // This is a simplified approach, in production you'd need to handle which doctors submitted which records
    //     // TODO: Temporary set to 10 due to a bug, actual code Math.min(totalRecords, recordCounter.counter.toNumber())
    //     for (let i = 0; i < 10; i++) {
    //         try {
    //             // You'd need to find all doctors and check for records with each one
    //             // This is a demonstration with just one known doctor
    //             const [recordPda] = PublicKey.findProgramAddressSync(
    //                 [Buffer.from("record"), new Uint8Array(new BN(i).toArrayLike(Buffer, 'le', 8)), userWallet.publicKey.toBuffer()],
    //                 this.programId
    //             );
                
    //             try {
    //                 const record = await program.account.record.fetch(recordPda);
    //                 allRecords.push({
    //                     id: record.id.toNumber(),
    //                     sickness: record.sickness,
    //                     symptoms: record.symptoms,
    //                     submitter: record.submitter.toString(),
    //                     status: record.status,
    //                     verificationCount: record.verificationCount.toNumber()
    //                 });
    //             } catch (e) {
    //                 // Record might not exist for this combination
    //                 console.log(e.message)
    //                 continue;
    //             }
    //         } catch (e) {
    //             console.error(`Error fetching record ${i}:`, e);
    //         }
    //     }
        
    //     return allRecords;
    // }
}