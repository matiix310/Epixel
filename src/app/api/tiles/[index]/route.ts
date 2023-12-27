import prisma from "@/../prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ApiResponse } from "../../page";
import { colorsHex } from "../route";

export type GetTileResponse = ApiResponse<{
  id: number;
  color: string;
  updatedAt: Date;
  index: number;
  authorName: string;
  canvasId: number;
}>;

export type SetTileResponse = ApiResponse<{
  id: number;
  color: string;
  updatedAt: Date;
  index: number;
  authorName: string;
  canvasId: number;
}>;

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

  // get the tile id
  const tile = await prisma.tile.findFirst({
    where: {
      index,
      canvasId: 1,
    },
    select: {
      id: true,
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
  const newTile = await prisma.tile.update({
    where: {
      id: tile.id,
    },
    data: {
      authorName: username,
      color: data.color,
    },
  });

  return NextResponse.json({
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

  const tile = await prisma.tile.findFirst({
    where: {
      index,
      canvasId: 1,
    },
  });

  if (!tile) {
    return NextResponse.json({
      error: true,
      message: "The requested tile doesn't exist: " + params.index + ".",
      data: {},
    });
  }

  return NextResponse.json({
    error: false,
    message: "",
    data: tile,
  });
};

export { setTile as POST, getTile as GET };
