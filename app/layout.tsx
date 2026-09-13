import type { Metadata } from "next";
import { GameProgressHUD } from "@/components/GameProgressHUD";
import { GlobalUX } from "@/components/GlobalUX";
import "./globals.css";
import "./v05.css";
import "./v06.css";
import "./qa-fixes.css";
import "./visual-fixes.css";
import "./v08-gamefeel.css";
import "./gameplay-hud.css";
import "./v09-player-transition.css";
import "./art-production.css";
import "./v10-ux-polish.css";

export const metadata: Metadata = {
  title: "SEA OF INFORMATION",
  description: "A cinematic music-driven exploration adventure."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <GameProgressHUD />
        <GlobalUX />
      </body>
    </html>
  );
}
