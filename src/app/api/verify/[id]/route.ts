import { NextResponse } from "next/server"
import Blockchain from "../../../../service/blockchain"
import { getCurrentWallet } from "../../../../service/session"


export async function POST(
    _: Request, 
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params

    const bc = new Blockchain()
    const wallet = await getCurrentWallet()
    const result = await bc.verifyRecord(wallet, Number(id))
    if (!result.ok) {
        return NextResponse.json({ msg: result.msg }, { status: result.code })
    }
    return NextResponse.json({ msg: `Succesfully verified record ${id}`})
}