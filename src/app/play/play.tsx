"use client";

import styles from "./page.module.css";
import GameCanvas from "@/components/Play/GameCanvas";
import ColorAndCountdown from "@/components/Play/ColorAndCountdown";
import { useRef } from "react";

type PlayProps = {
  username: string;
};

export default function Play({ username }: PlayProps) {
  var selectedPixel = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePlacePixel = (colorHex: string) => {
    console.log(
      `Color:    ${colorHex}\nPosition: (${selectedPixel.current.x}, ${selectedPixel.current.y})`
    );
  };

  return (
    <>
      <span className={styles.background} />
      <GameCanvas selectedPixel={selectedPixel} />
      <div className={styles.leftContainer}>
        <span className={styles.topTitle}>EPIXEL</span>
        <ColorAndCountdown onPlacePixel={handlePlacePixel} />
      </div>
    </>
  );
}
