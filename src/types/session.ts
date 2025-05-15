import { Keypair } from "@solana/web3.js";
import { SessionOptions } from "iron-session";

export type SessionData = {
    id: string
    log_in: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: process.env.SESSION_NAME!,
  cookieOptions: {
    // secure only works in `https` environments
    secure: process.env.NODE_ENV === "production",
  },
};