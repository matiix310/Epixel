import prisma from "@/clients/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ApiResponse } from "../../page";
import { Tile, colorsHex } from "../route";
import pusher from "@/clients/pusher";

export type GetTileResponse = ApiResponse<Tile>;

export type SetTileResponse = ApiResponse<Tile>;

export const delay = 10;

const lastTilePlaced: { [key: string]: number } = {};

const setTile = async (request: Request, { params }: { params: { index: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      error: true,
      message: "Your session is not valid. You can't request this api endpoint",
      data: {},
    });
  }

  const username = session.user!.name!;

  if (lastTilePlaced[username] && Date.now() - lastTilePlaced[username] < delay * 1000) {
    return NextResponse.json({
      error: true,
      message: "You must wait " + delay + " seconds between two tiles.",
      data: {},
    });
  }

  lastTilePlaced[username] = Date.now();

  const data = await request.json();

  if (!data.color) {
    return NextResponse.json({
      error: true,
      message: "The body of your request is invalid. It must contain a color (string).",
      data: {},
    });
  }

  const index = parseInt(params.index);

  if (isNaN(index)) {
    return NextResponse.json({
      error: true,
      message: "The provided index must be a number: " + params.index + ".",
      data: {},
    });
  }

  if (!colorsHex.includes(data.color)) {
    return NextResponse.json({
      error: true,
      message: "The color is not valid: " + data.color + ".",
      data: {},
    });
  }

  const pusherData: Tile = {
    authorName: username,
    color: data.color,
    index: index,
    updatedAt: new Date(),
  };

  pusher.trigger("epixel", "tile-placed", pusherData);

  // get the tile id
  const tile = await prisma.tile.findFirst({
    where: {
      index,
      canvasId: 1,
    },
    select: {
      id: true,
      index: true,
    },
  });

  if (!tile) {
    return NextResponse.json({
      error: true,
      message: "The requested tile doesn't exist: " + params.index + ".",
      data: {},
    });
  }

  // update the tile
  const newTile = (await prisma.tile.update({
    where: {
      id: tile.id,
    },
    data: {
      authorName: username,
      color: data.color,
    },
    select: {
      authorName: true,
      color: true,
      index: true,
      updatedAt: true,
    },
  })) as Tile;

  return NextResponse.json<SetTileResponse>({
    error: false,
    message: "",
    data: newTile,
  });
};

const getTile = async (request: Request, { params }: { params: { index: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      error: true,
      message: "Your session is not valid. You can't request this api endpoint",
      data: {},
    });
  }

  const index = parseInt(params.index);

  if (isNaN(index)) {
    return NextResponse.json({
      error: true,
      message: "The provided index must be a number: " + params.index + ".",
      data: {},
    });
  }

  const tile = (await prisma.tile.findFirst({
    where: {
      index,
      canvasId: 1,
    },
    select: {
      authorName: true,
      color: true,
      index: true,
      updatedAt: true,
    },
  })) as Tile;

  if (!tile) {
    return NextResponse.json({
      error: true,
      message: "The requested tile doesn't exist: " + params.index + ".",
      data: {},
    });
  }

  return NextResponse.json<GetTileResponse>({
    error: false,
    message: "",
    data: tile,
  });
};

export { setTile as POST, getTile as GET };
