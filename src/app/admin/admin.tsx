import prisma from "@/../prisma/client";
import React from "react";

type Tile = {
  color: string;
  authorName: string;
  index: number;
  canvasId: number;
};

export default async function Admin() {
  // Server side process
  const data: Tile[] = [];

  for (let i = 0; i < 255 * 255; i++)
    data.push({
      color: "#ffffff",
      authorName: "matiix310",
      index: i,
      canvasId: 1,
    });

  // const res = await prisma.tile.deleteMany();

  // const tiles = await prisma.tile.createMany({
  //   data,
  // });

  return (
    <>
      <h1>{0 + " pixels removed!"}</h1>
    </>
  );
}
