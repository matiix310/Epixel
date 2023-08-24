"use client";

import React from "react";
import Button from "../Button";
import styles from "./UserButton.module.css";

type Props = {
  userName: string;
};

function UserButton(props: Props) {
  return (
    <Button primary={true} className={styles.userButton} onClick={action}>
      {props.userName}
    </Button>
  );
}

const action = () => {
  window.location.href = `/play`;
};

export default UserButton;
