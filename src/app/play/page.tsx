"use client";

import styles from "./page.module.css";
import { RefreshTokenRes } from "../api/refreshToken/route";
import UserButton from "@/components/UserButton";
import { useEffect, useState } from "react";
import { UserRes } from "../api/username/route";
import ColorAndCountdown from "@/components/Play/ColorAndCountdown";

function Play() {
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    getUser().then((user) => setUser(user.username!));
  }, []);

  return (
    <>
      <span className={styles.background} />
      <span className={styles.topTitle}>EPIXEL</span>
      <div className={styles.rightContainer}>
        {user == "" ? "" : <UserButton userName={user} />}
        <ColorAndCountdown />
      </div>
    </>
  );
}

const getUser = async (): Promise<UserRes> => {
  const res: UserRes = await fetch("http://localhost:3000/api/username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jwt: window.localStorage.getItem("jwt"),
    }),
  }).then((response) => response.json());

  if (res.error) window.location.href = "/login";

  return res;
};

const refreshToken = async () => {
  const res: RefreshTokenRes = await fetch("http://localhost:3000/api/refreshToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jwt: window.localStorage.getItem("jwt"),
    }),
  }).then((response) => response.json());

  if (res.error) window.location.href = "/login";

  window.localStorage.setItem("jwt", res.jwt!);
};

export default Play;
