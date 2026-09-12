import type { Metadata } from "next";
import "./globals.css";
import "./v05.css";

export const metadata: Metadata = {
  title: "SEA OF INFORMATION",
  description: "A cinematic music-driven exploration adventure."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
