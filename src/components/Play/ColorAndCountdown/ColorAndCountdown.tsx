"use client";

import React, { MouseEventHandler, useRef, useState } from "react";
import styles from "./ColorAndCountdown.module.css";
import Image from "next/image";

function ColorAndCountdown() {
  var colorPalette = useRef<HTMLDivElement>(null);

  const colorsHex = [
    "#000000",
    "#ff4538",
    "#ffa938",
    "#f2ff38",
    "#8fff38",
    "#38ff45",
    "#38ffa9",
    "#38f2ff",
    "#388fff",
    "#4538ff",
    "#a838ff",
    "#ff38f2",
    "#ff388e",
    "#ffffff",
  ];

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
    const span = e.target as HTMLSpanElement;
    console.log(`placing pixel\nColor: ${selectedColor}`);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.buttonContainer}>
            <span className={styles.placePixel} onClick={placePixel}>
              <Image alt="" src="/paintbrush.svg" width="10" height="10" />
            </span>
            <span
              style={{ backgroundColor: selectedColor }}
              className={styles.selectedColor}
              onClick={handleColorSelectorClick}
            ></span>
          </div>
          <span className={styles.countdown}>4:15</span>
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
