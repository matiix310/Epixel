-- CreateTable
CREATE TABLE "Pixel" (
    "id" SERIAL NOT NULL,
    "color" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "Pixel_pkey" PRIMARY KEY ("id")
);
