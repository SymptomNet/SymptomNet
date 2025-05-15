import { NextResponse } from "next/server";
import connectDB from "../../../service/database";
import User from "../../../model/user";
import { destroySession, getSessionID, isLoggedIn, setSession } from "../../../service/session";

// destroy session aka log out
export async function DELETE() {
    await destroySession()
    return NextResponse.json({ 'msg': 'sign out' })
}

// get a session aka log in
export async function POST(request: Request) {
    await connectDB()

    const data = await request.json()
    console.log(data)

    // check db timeee
    const user = await User.findOne({
        worldID: data.nullifier_hash
    }).exec()

    if (user !== null) {
        // set session
        await setSession(data.nullifier_hash);
        return NextResponse.json({ 'msg': 'ok' })
    }

    return NextResponse.json({ 'msg': 'user not found' }, { status: 404 });
}

export async function GET(request: Request) {
    if (!(await isLoggedIn())) {
        return NextResponse.json({
            'msg': 'not logged in'
        }, { status: 404 })
    }
    return NextResponse.json({
        'id': await getSessionID()
    })
}
