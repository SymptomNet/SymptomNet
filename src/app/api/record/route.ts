import { NextResponse } from "next/server";
import Blockchain from "../../../service/blockchain";
import { getCurrentWallet } from "../../../service/session";
import { RecordType } from "../../../types/record";

export async function GET() {
    const bc = new Blockchain()
    const wallet = await getCurrentWallet()
    const result = await bc.fetchAllSymptomRecords(wallet)
    // const result = await bc.getAllRecords(wallet, 10)
    return NextResponse.json(result)
}

export async function POST(request: Request) {
    const bc = new Blockchain()
    const wallet = await getCurrentWallet()
    const body: RecordType = await request.json()
    if (body.sickness === undefined || body.symptoms === undefined || body.treatment === undefined) {
        return NextResponse.json({
            'msg': 'Incomplete Response'
        }, { status: 400 })
    }
    await bc.submitRecord(wallet, body.sickness, body.symptoms, body.treatment)
    return NextResponse.json({'msg': 'ok'})
}
