import { generateJwt } from "@/lib/jwt";

import React from "react";
import StoreJwt from "./StoreJwt";
import Redirect from "@/components/Redirect";
import Script from "next/script";
import { getUser } from "@/lib/microsoftApi";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

async function Login(props: Props) {
  const code = props.searchParams.code?.toString();

  if (code) {
    // 2nd
    const tokenObj = await getToken(code);
    const userInfo = await getUser(tokenObj.access_token);
    if (tokenObj.error || !userInfo) {
      return <Redirect url="/login" />;
    }

    const jwt = generateJwt(
      {
        token: tokenObj.access_token,
        refreshToken: tokenObj.refresh_token ?? "No refresh token provided",
        username: userInfo.given_name + " " + userInfo.family_name.toUpperCase(),
      },
      24 * 60 * 60
    );
    return (
      <>
        <StoreJwt jwt={jwt} />
        <Redirect url="/play" />
      </>
    );
  } else {
    // 1st
    return (
      <>
        <span>You will be redirected, please wait...</span>
        <Script id="loginConstants">
          {`const TENANT = "${process.env.NEXT_PUBLIC_TENANT}";
          const CLIENT_ID = "${process.env.NEXT_PUBLIC_CLIENT_ID}";
          const REDIRECT_URI = "${
            (process.env.NEXT_PUBLIC_HOST ?? "http://localhost:3000") +
            process.env.NEXT_PUBLIC_REDIRECT_URI
          }";`}
        </Script>
        <Script src="/scripts/login.js" />
      </>
    );
  }

  return <div>Login page</div>;
}

type TokenRes = {
  error?: string;
  access_token: string;
  refresh_token: string;
  expires_in: string;
};

const getToken = async (code: string): Promise<TokenRes> => {
  const res = await fetch(
    `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_TENANT}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}
            &scope=offline_access%20openid%20email%20profile
      &code=${code}
      &redirect_uri=${
        (process.env.NEXT_PUBLIC_HOST ?? "http://localhost:3000") +
        process.env.NEXT_PUBLIC_HOST
      }
      &grant_type=authorization_code
      &client_secret=${process.env.CLIENT_SECRET}`,
    }
  ).then((response) => response.json());

  return res as TokenRes;
};

export default Login;
