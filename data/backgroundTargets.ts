import type { TrackId } from "@/engine/model";

export type BackgroundTarget = {
  track: TrackId;
  artKey: string;
  path: string;
  overlay: "sea" | "dawn" | "dusk" | "night" | "industrial" | "road";
  direction: string;
};

export const BACKGROUND_TARGETS: Record<TrackId, BackgroundTarget> = {
  "sea-of-information": {
    track: "sea-of-information",
    artKey: "sea",
    path: "/art/production/sea/sea-background.webp",
    overlay: "sea",
    direction: "情報の海。深い青、記憶の光、静かな水面感。"
  },
  "city-of-dawn": {
    track: "city-of-dawn",
    artKey: "city",
    path: "/art/production/city/city-morning.webp",
    overlay: "dawn",
    direction: "8:42の朝。時計塔・駅・パン屋が調査位置と一致する生活感のある街。"
  },
  "load-road": {
    track: "load-road",
    artKey: "load-road",
    path: "/art/production/load-road/load-road-background.webp",
    overlay: "road",
    direction: "記憶世界間の移動路。中央へ伸びる奥行きと流れる情報。"
  },
  "gadget-area": {
    track: "gadget-area",
    artKey: "gadget-entry",
    path: "/art/production/gadget/gadget-entry.webp",
    overlay: "industrial",
    direction: "停止した工業区画。巨大機械と搬送路、黄系の作業灯。"
  },
  wish: {
    track: "wish",
    artKey: "wish",
    path: "/art/production/wish/wish-background.webp",
    overlay: "sea",
    direction: "個人的なメッセージ保管領域。静かで親密、漂う記録片。"
  },
  fantasy: {
    track: "fantasy",
    artKey: "fantasy",
    path: "/art/production/fantasy/fantasy-background.webp",
    overlay: "sea",
    direction: "既知の材料からできた未知の景色。逆向きの雲、戻る橋、変わる花。"
  },
  beautiful: {
    track: "beautiful",
    artKey: "beautiful",
    path: "/art/production/beautiful/beautiful-background.webp",
    overlay: "dusk",
    direction: "保存できない変化そのものが美しい景色。柔らかな色と移ろい。"
  },
  break: {
    track: "break",
    artKey: "break",
    path: "/art/production/break/break-background.webp",
    overlay: "night",
    direction: "書き込み停止された世界。凍結・走査線は控えめに、過剰グリッチ禁止。"
  },
  blavery: {
    track: "blavery",
    artKey: "blavery",
    path: "/art/production/blavery/blavery-background.webp",
    overlay: "industrial",
    direction: "保守経路を抜ける工業的な逃走路。前進感を重視。"
  },
  naked: {
    track: "naked",
    artKey: "naked",
    path: "/art/production/naked/naked-background.webp",
    overlay: "night",
    direction: "管理者ラベルを剥がす最小限の識別空間。情報量を抑える。"
  },
  signal: {
    track: "signal",
    artKey: "signal",
    path: "/art/production/signal/signal-background.webp",
    overlay: "sea",
    direction: "地球外から届くライブ信号。深宇宙と受信波、遠方の光点。"
  },
  spacecraft: {
    track: "spacecraft",
    artKey: "spacecraft",
    path: "/art/production/spacecraft/spacecraft-background.webp",
    overlay: "night",
    direction: "地球圏を離れた居住船団の航路。軍艦ではなく避難・生活船。"
  },
  "new-create": {
    track: "new-create",
    artKey: "new-create",
    path: "/art/production/new-create/new-create-background.webp",
    overlay: "sea",
    direction: "生成継続実験の中枢。情報ノードが新しい形を組み上げる。"
  },
  thundercloud: {
    track: "thundercloud",
    artKey: "thundercloud",
    path: "/art/production/thundercloud/thundercloud-background.webp",
    overlay: "night",
    direction: "最終対話の暗雲。悪役ボス部屋にはせず、重い空気と控えめな稲光。"
  },
  "space-home": {
    track: "space-home",
    artKey: "space-home",
    path: "/art/production/space-home/space-home-background.webp",
    overlay: "dawn",
    direction: "CREATE後の新しい地平線。完成ではなく、開かれた未知の明日。"
  }
};
