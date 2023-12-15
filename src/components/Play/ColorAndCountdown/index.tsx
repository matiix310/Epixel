import React from "react";
import styles from "./ColorAndCountdown.module.css";

function ColorAndCountdown() {
  return (
    <>
      <div className={styles.container}>
        <span className={styles.selectedColor}></span>
        <span className={styles.countdown}>4:15</span>
      </div>
    </>
  );
}

export default ColorAndCountdown;
