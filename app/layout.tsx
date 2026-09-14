import type { Metadata } from "next";
import { GameProgressHUD } from "@/components/GameProgressHUD";
import { GlobalUX } from "@/components/GlobalUX";
import { LoadRoadShootingStage } from "@/components/stg/LoadRoadShootingStage";
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
import "./v11-novel-ui.css";
import "./v12-music-cinematic.css";
import "./v13-pv-amplified.css";
import "./v15-micro-polish.css";
import "./v16-track-visualizers.css";
import "./v17-performance.css";
import "./v18-qa-polish.css";
import "./v19-debug-playback.css";
import "./v20-full-track-visuals.css";
import "./v21-load-road-stg.css";

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
        <LoadRoadShootingStage />
      </body>
    </html>
  );
}
