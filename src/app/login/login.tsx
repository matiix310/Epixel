"use client";

import LoginButton from "@/components/LoginButton/index";
import styles from "./page.module.css";
import SquareEffect from "@/components/SquareEffect";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login({ callbackUrl }: { callbackUrl: string }) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <>
      <div className={styles.body}>
        <span className={styles.background} />
        <div className={styles.popup}>
          <h1 className={styles.question}>
            Veuillez vous connecter pour accéder au site
          </h1>
          <div className={styles.loginContainer}>
            <LoginButton
              label={"Azure AD"}
              buttonClass={styles.azureLoginButton as string}
              onClick={() => signIn("azure-ad", { callbackUrl })}
            />
            <div className={styles.separator}>
              <img src="/left_separator.png" alt="" />
              <h1>OR</h1>
              <img
                src="/left_separator.png"
                alt=""
                style={{ transform: "rotate(180deg)" }}
              />
            </div>
            <form
              className={styles.credsForm}
              onSubmit={(e) => {
                e.preventDefault();
                signInWithCreds(username, password, callbackUrl);
              }}
            >
              <input
                type="text"
                name="username"
                placeholder="username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <LoginButton
                label="LOGIN"
                buttonClass={styles.credsLoginBtn}
                onClick={() => signInWithCreds(username, password, callbackUrl)}
              />
              <input id="credsSubmitBtn" type="submit" style={{ display: "none" }} />
            </form>
          </div>
          <SquareEffect
            foreground="var(--text)"
            background={"var(--background)"}
            width="15%"
          />
        </div>
      </div>
    </>
  );
}

function signInWithCreds(username: string, password: string, callbackUrl: string) {
  let _ = signIn("credentials", { username, password, callbackUrl });
}
