import prisma from "@/clients/prisma";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { ApiResponse } from "../page";

export const colorsHex = [
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
] as const;

export type Tile = {
  authorName: string;
  color: (typeof colorsHex)[number];
  updatedAt: Date;
  index: number;
};

export type TilesResponse = ApiResponse<{
  tiles: Tile[];
  width: number;
  height: number;
}>;

let fetchInterval = 5; // in minutes
const cache: {
  lastFetch: number;
  cachedTiles: Tile[];
  canvasWidth: number;
  canvasHeight: number;
} = {
  lastFetch: 0,
  cachedTiles: [],
  canvasWidth: 0,
  canvasHeight: 0,
};

const getTiles = async (request: Request) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      error: true,
      message: "Your session is not valid. You can't request this api endpoint",
      data: {},
    });
  }

  if (Date.now() - cache.lastFetch < fetchInterval * 1000 * 60) {
    return NextResponse.json<TilesResponse>({
      error: false,
      message: "",
      data: {
        tiles: cache.cachedTiles,
        width: cache.canvasWidth,
        height: cache.canvasHeight,
      },
    });
  }

  const canvasId = 1;

  const canvas = await prisma.canvas.findUnique({
    where: {
      id: canvasId,
    },
  });

  if (!canvas) {
    return NextResponse.json({
      error: true,
      message: "There is no availible canvas to select a tile from.",
      data: {},
    });
  }

  const tiles = (await prisma.tile.findMany({
    where: {
      canvasId: 1,
    },
    select: {
      authorName: true,
      color: true,
      updatedAt: true,
      index: true,
    },
  })) as Tile[];

  cache.cachedTiles = tiles;
  cache.canvasWidth = canvas.width;
  cache.canvasHeight = canvas.height;
  cache.lastFetch = Date.now();

  return NextResponse.json({
    error: false,
    message: "",
    data: {
      tiles,
      width: canvas.width,
      height: canvas.height,
    },
  });
};

export { getTiles as GET, cache };
