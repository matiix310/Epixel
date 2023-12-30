"use client";

import styles from "./page.module.css";
import GameCanvas from "@/components/Play/GameCanvas";
import ColorAndCountdown from "@/components/Play/ColorAndCountdown";
import { useRef, useState } from "react";

type PlayProps = {
  username: string;
  pusherKey: string;
  pusherCluster: string;
  isMobileDevice: boolean;
};

export default function Play({
  username,
  pusherKey,
  pusherCluster,
  isMobileDevice,
}: PlayProps) {
  var selectedPixel = useRef({ x: 0, y: 0 });
  var canvasSize = useRef({ width: 0, height: 0 });
  var [canvasLoaded, setCanvasLoaded] = useState<boolean>(false);

  const handlePlacePixel = (colorHex: string) => {
    // console.log(
    //   `Color:    ${colorHex}\nPosition: (${selectedPixel.current.x}, ${selectedPixel.current.y})`
    // );

    fetch(
      `/api/tiles/${
        selectedPixel.current.x + selectedPixel.current.y * canvasSize.current.width
      }`,
      {
        method: "post",
        body: JSON.stringify({
          color: colorHex,
        }),
      }
    );
  };

  return (
    <>
      <span className={styles.background} />
      <GameCanvas
        isMobileDevice={isMobileDevice}
        pusherKey={pusherKey}
        pusherCluster={pusherCluster}
        selectedPixel={selectedPixel}
        onCanvasLoaded={() => setCanvasLoaded(true)}
        canvasSize={canvasSize}
      />
      <div className={styles.leftContainer}>
        <span
          className={[styles.topTitle, isMobileDevice ? styles.mobileTopTitle : ""].join(
            " "
          )}
        >
          EPIXEL
        </span>
        <ColorAndCountdown
          isMobileDevice={isMobileDevice}
          onPlacePixel={handlePlacePixel}
          canvasLoaded={canvasLoaded}
        />
      </div>
    </>
  );
}
