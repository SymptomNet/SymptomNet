import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "../types/session";
import { cookies } from "next/headers";
import connectDB from "./database";
import user from "../model/user";
import { Keypair } from "@solana/web3.js";

export async function getCurrentWallet(): Promise<Keypair> {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    await connectDB()

    const userData = await user.findOne({
        worldID: session.id
    }).exec()
    const walletRAW = userData.wallet
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(walletRAW)))
}

export async function isLoggedIn() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    return session.log_in
}

export async function setSession(worldID: string) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    session.id = worldID
    session.log_in = true
    await session.save()
}

export async function destroySession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    session.destroy()
}

export async function getSessionID() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    return session.id 
}
