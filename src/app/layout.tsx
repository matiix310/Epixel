import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: "./Minercraftory.ttf",
  display: "auto",
});

export const metadata: Metadata = {
  title: "Epixel",
  description: "A test website based on the famouse r/place event by Reddit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  );
}
