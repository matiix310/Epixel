import React, { PropsWithChildren } from "react";
import SquareEffect from "../SquareEffect";
import styles from "./Button.module.css";

type Props = {
  primary: boolean;
  className?: string;
  onClick?: () => void;
  submit?: boolean;
};

function Button({
  primary,
  className = "",
  onClick = () => {},
  children,
  submit = false
}: PropsWithChildren<Props>) {
  return (
    <>
      <div
        className={[styles.container, className].join(" ")}
        style={{ background: primary ? "var(--primary)" : "var(--secondary)" }}
        onClick={onClick}
      >
        <SquareEffect
          background="var(--text)"
          foreground="var(--primary)"
          height="40%"
          hoverEffect={true}
        />
        <h1>{children}</h1>
      </div>
    </>
  );
}

export default Button;
