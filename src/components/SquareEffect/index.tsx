import React from "react";
import styles from "./SquareEffect.module.css";

type Props = {
  foreground: string;
  background: string;
  width?: string;
  height?: string;
  hoverEffect?: boolean;
};

function SquareEffect({
  foreground,
  background,
  width = "unset",
  height = "unset",
  hoverEffect = false,
}: Props) {
  return (
    <>
      <div
        className={[styles.container, hoverEffect ? styles.hoverEffect : ""].join(" ")}
      >
        <div
          className={styles.borderContainer}
          style={{ background, borderColor: foreground, width, height }}
        >
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
        </div>
        <div
          className={styles.borderContainer}
          style={{ background, borderColor: foreground, width, height }}
        >
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
        </div>
        <div
          className={styles.borderContainer}
          style={{ background, borderColor: foreground, width, height }}
        >
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
        </div>
        <div
          className={styles.borderContainer}
          style={{ background, borderColor: foreground, width, height }}
        >
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
          <span style={{ background: foreground }}></span>
        </div>
      </div>
    </>
  );
}

export default SquareEffect;
