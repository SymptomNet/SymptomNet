import { NextResponse } from "next/server";
import Blockchain from "../../../service/blockchain";
import { getCurrentWallet } from "../../../service/session";

export async function GET() {
    const bc = new Blockchain()
    const wallet = await getCurrentWallet()
    const result = await bc.getUnverifiedRecords(wallet)
    // const result = await bc.getAllRecords(wallet, 10)
    if (result === true) {
        return NextResponse.json({
            'all_done': true, 
            'data': {}
        })        
    }
    return NextResponse.json({
        'all_done': false,
        'data': result
    })
}
