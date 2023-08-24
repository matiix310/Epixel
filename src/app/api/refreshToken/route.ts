import { generateJwt, readJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const jwtToken = data.jwt;

  if (!jwtToken)
    return NextResponse.json({
      error: true,
      message: "Invalid or missing JWT token in request body.",
    });

  // read the jwtToken and verify the signature
  const jwt = readJwt(jwtToken);

  if (!jwt) return NextResponse.json({ error: true, message: "Invalid JWT signature." });

  // generate a new JWT with the new token
  const token = await getToken(jwt.refreshToken);
  const newJwt = generateJwt({
    refreshToken: jwt.refreshToken,
    token: token.access_token,
    username: jwt.username,
    iat: jwt.iat,
    exp: jwt.exp, // keep the same expiration date
  });

  // send the new JWT
  return NextResponse.json({ error: false, jwt: newJwt });
}

type RefreshTokenRes = {
  error: boolean;
  message?: string;
  jwt?: string;
};

type TokenRes = {
  access_token: string;
  expires_in: string;
};

const getToken = async (refresh_token: string): Promise<TokenRes> => {
  const res = await fetch(
    `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_TENANT}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}
      &scope=openid%20email%20profile
      &refresh_token=${refresh_token}
      &grant_type=refresh_token
      &client_secret=${process.env.CLIENT_SECRET}`,
    }
  ).then((response) => response.json());

  return res as TokenRes;
};

export type { RefreshTokenRes };
