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

const getTiles = async (request: Request) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      error: true,
      message: "Your session is not valid. You can't request this api endpoint",
      data: {},
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

  const tiles = await prisma.tile.findMany({
    where: {
      canvasId: 1,
    },
    select: {
      authorName: true,
      color: true,
      updatedAt: true,
    },
  });

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

export { getTiles as GET };
