import { NextResponse } from "next/server";
import Blockchain from "../../../../service/blockchain";

export async function GET() {
    const bs = new Blockchain()
    await bs.resetRecordCounter()
    return NextResponse.json({'msg': 'resetted'})
}