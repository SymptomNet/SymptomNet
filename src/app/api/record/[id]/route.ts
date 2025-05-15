import { NextResponse } from "next/server";
import Blockchain from "../../../../service/blockchain";
import { getCurrentWallet } from "../../../../service/session";

export async function GET(
    _: Request, 
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params

    const bc = new Blockchain()
    const wallet = await getCurrentWallet()
    const result = await bc.getSpecificRecords(wallet, Number(id))
    if (!result) {
        return NextResponse.json({'msg': 'not found'}, {'status': 404})
    }
    // const result = await bc.getAllRecords(wallet, 10)
    return NextResponse.json(result)
}