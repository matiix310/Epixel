"use client";

import React, { MouseEventHandler, useRef, useState } from "react";
import styles from "./ColorAndCountdown.module.css";
import Image from "next/image";
import moment from "moment";
import { colorsHex } from "@/app/api/tiles/route";
import { delay } from "@/app/api/tiles/[index]/route";

type ColorAndCountdownProps = {
  onPlacePixel: (colorHex: string) => void;
  canvasLoaded: boolean;
};

function ColorAndCountdown({ onPlacePixel, canvasLoaded }: ColorAndCountdownProps) {
  var colorPalette = useRef<HTMLDivElement>(null);
  var lastPlace = useRef<number>(0);
  var [countdown, setCountdown] = useState<string>(delay + ":00");

  var [selectedColor, setSelectedColor] = useState<string>(colorsHex[0]);

  const handleColorSelectorClick = () => {
    if (!colorPalette.current) return;

    if (colorPalette.current.classList.contains(styles.visible)) {
      // hide
      colorPalette.current.classList.remove(styles.visible);
    } else {
      // show
      colorPalette.current.classList.add(styles.visible);
    }
  };

  const handleColorClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    colorHex: string
  ) => {
    const span = e.target as HTMLSpanElement;

    // reset all the selected element
    for (let i = 0; i < colorPalette.current!.children.length; i++) {
      colorPalette
        .current!.children.item(i)!
        .children.item(0)!
        .classList.remove(styles.selected);
    }

    // give the selected class to the selected color
    span.classList.add(styles.selected);

    // set the new current color
    setSelectedColor(colorHex);

    // remove the color palette;
    handleColorSelectorClick();
  };

  const placePixel: MouseEventHandler<HTMLSpanElement> = (e) => {
    // TODO

    if (!canvasLoaded) return;

    const now = Date.now();

    if (now - lastPlace.current < 1000 * delay) return;
    lastPlace.current = now;

    const span = e.currentTarget as HTMLSpanElement;

    if (!span.classList.contains(styles.disabled)) span.classList.add(styles.disabled);

    setTimeout(() => {
      if (span.classList.contains(styles.disabled))
        span.classList.remove(styles.disabled);
    }, 1000 * delay);

    const displayCountdown = () => {
      const realNow = Date.now();
      if (now + delay * 1000 <= realNow) {
        setCountdown(delay + ":00");
        return;
      }

      setCountdown(moment(delay * 1000 - (realNow - now)).format("s:S0"));
      requestAnimationFrame(displayCountdown);
    };

    requestAnimationFrame(displayCountdown);

    onPlacePixel(selectedColor);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.buttonContainer}>
            <span
              className={[styles.placePixel, canvasLoaded ? "" : styles.disabled].join(
                " "
              )}
              onClick={placePixel}
            >
              <Image alt="" src="/paintbrush.svg" width="10" height="10" />
            </span>
            <span
              style={{ backgroundColor: selectedColor }}
              className={styles.selectedColor}
              onClick={handleColorSelectorClick}
            ></span>
          </div>
          <span className={styles.countdown}>{countdown}</span>
        </div>
        <div ref={colorPalette} className={styles.colorPalette}>
          {colorsHex.map((colorHex, index) => (
            <div key={index} className={styles.gridItem}>
              <span
                className={index == 0 ? styles.selected : ""}
                onClick={(e) => handleColorClick(e, colorHex)}
                style={{ backgroundColor: colorHex }}
              ></span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ColorAndCountdown;
