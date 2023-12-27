"use client";

import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import styles from "./GameCanvas.module.css";
import LoadingIcon from "@/components/LoadingIcon";
import moment from "moment";
import "moment/locale/fr";

// types for the api requests
import { Tile, TilesResponse } from "@/app/api/tiles/route";

moment().locale("fr");

type GameCanvasProps = {
  selectedPixel: MutableRefObject<{ x: number; y: number }>;
  onCanvasLoaded: () => void;
  canvasSize: MutableRefObject<{ width: number; height: number }>;
};

export default function GameCanvas({
  selectedPixel,
  onCanvasLoaded,
  canvasSize,
}: GameCanvasProps) {
  const [canvasLoaded, setCanvasLoaded] = useState<boolean>(false);

  var identifierName = useRef<HTMLHeadingElement>(null);
  var identifierDate = useRef<HTMLHeadingElement>(null);
  var identifierHour = useRef<HTMLHeadingElement>(null);
  var identifierPosition = useRef<HTMLHeadingElement>(null);

  var requestRef = useRef<number>(0);

  var canvas = useRef<HTMLCanvasElement>(null);
  var tiles = useRef<Tile[]>([]);

  var squareSize = useRef<number>(5);
  var origin = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  var oldOrigin = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  var clicking = useRef(false);
  var clickedAt = useRef(0);

  const updateCanvas = useCallback(() => {
    if (requestRef.current) {
      window.cancelAnimationFrame(requestRef.current);
    }

    const animate = () => {
      if (!canvas.current || tiles.current.length == 0) return;

      const cCanvas = canvas.current;

      // Draw the tiles
      const ctx = cCanvas.getContext("2d");

      if (!ctx) return;

      const transform = ctx.getTransform();
      ctx.resetTransform();
      ctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
      ctx.setTransform(transform);

      if (oldOrigin.current != origin.current) {
        ctx.translate(
          origin.current.x - oldOrigin.current.x,
          origin.current.y - oldOrigin.current.y
        );
        oldOrigin.current = origin.current;
      }

      // draw only the visible pixels
      const x_min = Math.floor(-origin.current.x / squareSize.current);
      const y_min = Math.floor(-origin.current.y / squareSize.current);
      const x_max = Math.ceil(
        (window.innerWidth - origin.current.x) / squareSize.current
      );
      const y_max = Math.ceil(
        (window.innerHeight - origin.current.y) / squareSize.current
      );

      for (
        let x = x_min < 0 ? 0 : x_min;
        x < (x_max > canvasSize.current.width ? canvasSize.current.width : x_max);
        x++
      ) {
        for (
          let y = y_min < 0 ? 0 : y_min;
          y < (y_max > canvasSize.current.height ? canvasSize.current.height : y_max);
          y++
        ) {
          const tile = tiles.current[y * canvasSize.current.width + x];
          ctx.fillStyle = tile.color;
          ctx.fillRect(
            x * squareSize.current,
            y * squareSize.current,
            squareSize.current + 1,
            squareSize.current + 1
          );
        }
      }

      const crosshair_pos = {
        x: window.innerWidth / 2 - origin.current.x,
        y: window.innerHeight / 2 - origin.current.y,
      };

      // draw the box for the selected pixel
      if (
        crosshair_pos.x >= 0 &&
        crosshair_pos.x < canvasSize.current.width * squareSize.current &&
        crosshair_pos.y >= 0 &&
        crosshair_pos.y < canvasSize.current.height * squareSize.current
      ) {
        // get the selected pixel
        const pixel = {
          x: Math.floor(crosshair_pos.x / squareSize.current),
          y: Math.floor(crosshair_pos.y / squareSize.current),
        };

        // set the new selectedPixel
        selectedPixel.current = {
          x: pixel.x,
          y: pixel.y,
        };

        // draw the box
        ctx.fillStyle = "#0e1425";
        const margin = squareSize.current / 10;
        ctx.fillRect(
          pixel.x * squareSize.current - margin / 2,
          pixel.y * squareSize.current - margin / 2,
          squareSize.current + margin,
          squareSize.current + margin
        );

        ctx.fillStyle = tiles.current[pixel.y * canvasSize.current.width + pixel.x].color;
        ctx.fillRect(
          pixel.x * squareSize.current,
          pixel.y * squareSize.current,
          squareSize.current,
          squareSize.current
        );

        // fill the identifiers
        if (
          identifierName.current &&
          identifierDate.current &&
          identifierHour.current &&
          identifierPosition.current
        ) {
          const selectedTile =
            tiles.current[pixel.y * canvasSize.current.width + pixel.x];
          identifierName.current.textContent = selectedTile.authorName;
          const placedAt = moment(selectedTile.updatedAt);
          identifierDate.current.textContent = placedAt.format("D MMMM YYYY");
          identifierHour.current.textContent = placedAt.format("HH:mm:ss");
          identifierPosition.current.textContent = `(${pixel.x}, ${pixel.y})`;
        }
      } else {
        // remove the identifiers
        if (
          identifierDate.current &&
          identifierHour.current &&
          identifierName.current &&
          identifierPosition.current
        ) {
          identifierDate.current.textContent = "";
          identifierHour.current.textContent = "";
          identifierName.current.textContent = "";
          identifierPosition.current.textContent = "";
        }
      }

      // draw the crosshair
      const crosshairWidth =
        window.innerWidth > window.innerHeight
          ? window.innerWidth / 80
          : window.innerHeight / 80;

      ctx.strokeStyle = "#0e1425";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(crosshair_pos.x - crosshairWidth / 2 - 1, crosshair_pos.y);
      ctx.lineTo(crosshair_pos.x + crosshairWidth / 2 + 1, crosshair_pos.y);
      ctx.moveTo(crosshair_pos.x, crosshair_pos.y + crosshairWidth / 2 + 1);
      ctx.lineTo(crosshair_pos.x, crosshair_pos.y - crosshairWidth / 2 - 1);
      ctx.stroke();
      ctx.closePath();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(crosshair_pos.x - crosshairWidth / 2, crosshair_pos.y);
      ctx.lineTo(crosshair_pos.x + crosshairWidth / 2, crosshair_pos.y);
      ctx.moveTo(crosshair_pos.x, crosshair_pos.y + crosshairWidth / 2);
      ctx.lineTo(crosshair_pos.x, crosshair_pos.y - crosshairWidth / 2);
      ctx.stroke();
      ctx.closePath();
    };

    requestRef.current = window.requestAnimationFrame(animate);
  }, [selectedPixel, canvasSize]);

  // Update the canvas after the window is resized
  useEffect(() => {
    squareSize.current =
      Math.min(window.innerHeight, window.innerWidth) /
      Math.max(canvasSize.current.width, canvasSize.current.height);

    const resizeCanvas = () => {
      if (canvas.current) {
        const ctx = canvas.current.getContext("2d")!;
        const transform = ctx.getTransform();
        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;
        ctx.setTransform(transform);
        updateCanvas();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasLoaded, updateCanvas, canvasSize]);

  // Set the canvas listeners and update the tiles
  // when the canvas is loaded
  useEffect(() => {
    // when the canvas is loaded
    if (!canvas.current) return;

    const mouseDown = (e: MouseEvent) => {
      e.preventDefault();
      clicking.current = true;
      clickedAt.current = Date.now();
    };
    const mouseUp = (e: MouseEvent) => {
      e.preventDefault();
      if (!clicking.current) return;

      clicking.current = false;

      if (Date.now() - clickedAt.current < 200) {
        // click
        // get the pixel coordinates
        const pixel = {
          x: Math.floor((e.clientX - origin.current.x) / squareSize.current),
          y: Math.floor((e.clientY - origin.current.y) / squareSize.current),
        };

        if (
          pixel.x < 0 ||
          pixel.x >= canvasSize.current.width ||
          pixel.y < 0 ||
          pixel.y >= canvasSize.current.height
        )
          return;

        // focus the selected pixel
        origin.current = {
          x: (window.innerWidth - squareSize.current) / 2 - squareSize.current * pixel.x,
          y: (window.innerHeight - squareSize.current) / 2 - squareSize.current * pixel.y,
        };

        updateCanvas();
      }
    };

    const mouseMove = (e: MouseEvent) => {
      if (!clicking.current) return;

      e.preventDefault();
      origin.current = {
        x: origin.current.x + e.movementX,
        y: origin.current.y + e.movementY,
      };
      updateCanvas();
    };

    const wheel = (e: WheelEvent) => {
      e.preventDefault();

      const dy = -e.deltaY / canvasSize.current.width;
      if (
        dy < 0 &&
        ((squareSize.current + dy) * canvasSize.current.width <= window.innerWidth / 3 ||
          (squareSize.current + dy) * canvasSize.current.height <= window.innerHeight / 3)
      )
        return;

      if (
        dy > 0 &&
        (squareSize.current + dy >= window.innerWidth / 3 ||
          squareSize.current + dy >= window.innerHeight / 3)
      )
        return;

      squareSize.current += dy;

      const r = (dy + squareSize.current) / squareSize.current;

      const screen_center = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      const u_c = {
        x: origin.current.x - screen_center.x,
        y: origin.current.y - screen_center.y,
      };

      origin.current = {
        x: screen_center.x + r * u_c.x,
        y: screen_center.y + r * u_c.y,
      };

      updateCanvas();
    };

    const cCanvas = canvas.current;

    // set its default origin
    origin.current = {
      x:
        window.innerHeight < window.innerWidth
          ? (window.innerWidth - window.innerHeight) / 2
          : 0,
      y:
        window.innerHeight < window.innerWidth
          ? 0
          : (window.innerHeight - window.innerWidth) / 2,
    };

    cCanvas.addEventListener("mousedown", mouseDown);
    cCanvas.addEventListener("mouseup", mouseUp);
    cCanvas.addEventListener("mouseout", mouseUp);
    cCanvas.addEventListener("mousemove", mouseMove);

    cCanvas.addEventListener("wheel", wheel);

    return () => {
      cCanvas.removeEventListener("mousedown", mouseDown);
      cCanvas.removeEventListener("mouseup", mouseUp);
      cCanvas.removeEventListener("mouseout", mouseUp);
      cCanvas.removeEventListener("mousemove", mouseMove);

      cCanvas.removeEventListener("wheel", wheel);
    };
  }, [canvasLoaded, updateCanvas, canvasSize]);

  useEffect(() => {
    if (canvasLoaded) return;
    fetch("/api/tiles").then(async (res) => {
      const json: TilesResponse = await res.json();

      if (json.error) {
        alert(
          "Can't laod the tiles from the server! Please verify your internet connection or contact an administator."
        );
        return;
      }

      tiles.current = json.data.tiles;
      canvasSize.current = {
        width: json.data.width,
        height: json.data.height,
      };
      setCanvasLoaded(true);
      onCanvasLoaded();
    });
  }, [onCanvasLoaded, canvasSize, canvasLoaded]);

  if (!canvasLoaded) {
    return (
      <>
        <span className={styles.background}></span>
        <div className={styles.loadingCanvas}>
          <LoadingIcon />
          <h1>Fetching tiles</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <span className={styles.background}></span>
      <canvas ref={canvas} className={styles.gameCanvas} />
      <div className={styles.pixelIdentifier}>
        <h1 ref={identifierName}></h1>
        <h1 ref={identifierDate}></h1>
        <h1 ref={identifierHour}></h1>
        <h1 ref={identifierPosition}></h1>
      </div>
    </>
  );
}
