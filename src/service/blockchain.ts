import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor/dist/cjs";
import { Connection, Keypair, PublicKey } from "@solana/web3.js/lib";
import idl from "@/idl/symptom_net.json"
import { SymptomNet } from "@/types/symptomNet"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "bn.js";

const SYMPTOM_NET_ADDRESS = process.env.CONTRACT_ADDRESS
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
        this.adminWallet = Keypair.fromSecretKey(Buffer.from(ADMIN_WALLET))
    }

    getProgram(wallet) {
        const provider = new AnchorProvider(
            this.connection,
            new Wallet(wallet),
            { commitment: "confirmed" }
        )
        return new Program<SymptomNet>(idl, provider)
    }
    
    async submitRecord(doctorWallet, sickness, symptoms) {
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
                new Uint8Array(recordCounter.counter.toArrayLike(Buffer, 'le', 8)),
                doctorWallet.publicKey.toBuffer()
            ],
            this.programId
        );

        try {
        await program.methods
            .submitRecord(sickness, symptoms)
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

    async verifyRecord(doctorWallet, submitterPublicKey, recordPda) {
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

    // woah pagination
    async getAllRecords(userWallet, maxResults = 10) {
        const program = this.getProgram(userWallet);
        
        // Derive PDAs
        const [statePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("state"), this.adminWallet.publicKey.toBuffer()],
            this.programId
        );
        
        const [recordCounterPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("record_counter"), this.adminWallet.publicKey.toBuffer()],
            this.programId
        );
        
        const [recordListPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("record-list"), userWallet.publicKey.toBuffer()],
            this.programId
        );
        
        try {
            await program.methods
            .getAllRecords(new BN(maxResults))
            .accounts({
                user: userWallet.publicKey,
                state: statePda,
                recordCounter: recordCounterPda,
                recordList: recordListPda,
                rent: web3.SYSVAR_RENT_PUBKEY,
                systemProgram: web3.SystemProgram.programId,
            })
            .signers([userWallet])
            .rpc();
            
            // Fetch the list
            const recordList = await program.account.recordList.fetch(recordListPda);
            const totalRecords = recordList.total.toNumber();
            
            // Now fetch all records - this requires knowing all record PDAs
            // We need to get the records by iterating through the counter
            const recordCounter = await program.account.recordCounter.fetch(recordCounterPda);
            const allRecords = [];
            
            // This is a simplified approach, in production you'd need to handle which doctors submitted which records
            for (let i = 0; i < Math.min(totalRecords, recordCounter.counter.toNumber()); i++) {
                try {
                    // You'd need to find all doctors and check for records with each one
                    // This is a demonstration with just one known doctor
                    const [recordPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("record"), new Uint8Array(new BN(i).toArrayLike(Buffer, 'le', 8)), userWallet.publicKey.toBuffer()],
                        this.programId
                    );
                    
                    try {
                    const record = await program.account.record.fetch(recordPda);
                    allRecords.push({
                        id: record.id.toNumber(),
                        sickness: record.sickness,
                        symptoms: record.symptoms,
                        submitter: record.submitter.toString(),
                        status: record.status,
                        verificationCount: record.verificationCount.toNumber()
                    });
                    } catch (e) {
                        // Record might not exist for this combination
                        continue;
                    }
                } catch (e) {
                    console.error(`Error fetching record ${i}:`, e);
                }
            }
            
            return allRecords;
        } catch (error) {
            console.error("Error getting all records:", error);
            throw error;
        }
    }


}