import { readJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const jwtToken = data.jwt;

    if (!jwtToken)
        return NextResponse.json({
            error: true,
            message: "Invalid or missing JWT token in request body.",
        });

    const jwt = readJwt(jwtToken);

    if (!jwt) return NextResponse.json({ error: true, message: "Invalid JWT signature." });

    return NextResponse.json({ error: false, username: jwt.username });
}