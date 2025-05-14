import mongoose from "mongoose";

export type User = {
    _id: string,
    worldID: string,
    wallet: string
}

const userSchema = new mongoose.Schema({
    worldID: String,
    wallet: String,
})

export default mongoose.models.User || mongoose.model('User', userSchema)