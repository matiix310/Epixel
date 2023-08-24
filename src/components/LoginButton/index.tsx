"use client";

import React from "react";
import Button from "../Button";
import styles from "./LoginButton.module.css";

function LoginButton() {
  return (
    <Button primary={true} className={styles.loginButton} onClick={login}>
      SE CONNECTER
    </Button>
  );
}

const login = () => {
  window.location.href = `/login`;
};

export default LoginButton;
