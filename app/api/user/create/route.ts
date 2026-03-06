import { NextResponse } from "next/server"

export async function POST( request : Request ){
    const { name , email , id } = await request.json()

    return NextResponse.json({
        status : 200,
        success : true,
        payload : `${name} with email ${email} and id ${id} created successfully`	
    })
}