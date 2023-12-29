"use client";

import styles from "./page.module.css";
import GameCanvas from "@/components/Play/GameCanvas";
import ColorAndCountdown from "@/components/Play/ColorAndCountdown";
import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { Tile } from "@/app/api/tiles/route";

type PlayProps = {
  username: string;
  pusherKey: string;
  pusherCluster: string;
};

export default function Play({ username, pusherKey, pusherCluster }: PlayProps) {
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
        pusherKey={pusherKey}
        pusherCluster={pusherCluster}
        selectedPixel={selectedPixel}
        onCanvasLoaded={() => setCanvasLoaded(true)}
        canvasSize={canvasSize}
      />
      <div className={styles.leftContainer}>
        <span className={styles.topTitle}>EPIXEL</span>
        <ColorAndCountdown onPlacePixel={handlePlacePixel} canvasLoaded={canvasLoaded} />
      </div>
    </>
  );
}
