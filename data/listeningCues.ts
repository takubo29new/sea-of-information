import type { TrackId } from "@/engine/model";

export type ListeningCue = {
  at: number;
  text?: string;
  mood?: "calm" | "memory" | "glitch" | "reveal" | "warm" | "industrial";
  camera?: "still" | "slow-in" | "slow-out" | "drift-left" | "drift-right";
};

export type ListeningTimeline = {
  track: TrackId;
  artKey: string;
  introText: string;
  cues: ListeningCue[];
};

export const LISTENING_TIMELINES: Record<TrackId, ListeningTimeline> = {
  "sea-of-information": { track: "sea-of-information", artKey: "sea", introText: "ここには、誰かの記憶が波のように流れている。", cues: [
    { at: 0, mood: "calm", camera: "slow-in" }, { at: 38, text: "名前のない声が、遠くで重なる。", mood: "memory", camera: "drift-right" },
    { at: 82, text: "知らないはずの景色を、なぜか懐かしいと思った。", mood: "memory", camera: "slow-out" }, { at: 112, text: "この海の向こうに、何かがある。", mood: "reveal", camera: "slow-in" }
  ]},
  "city-of-dawn": { track: "city-of-dawn", artKey: "noa", introText: "この朝は、美しいまま止まっている。", cues: [
    { at: 0, mood: "warm", camera: "slow-in" }, { at: 75, text: "鳥が飛ぶ。列車が着く。パン屋が開く。", mood: "warm", camera: "drift-left" },
    { at: 155, text: "――同じ順番で。何度でも。", mood: "glitch", camera: "still" }, { at: 185, text: "違うのは、こちらが気づいてしまったことだけ。", mood: "memory", camera: "drift-right" },
    { at: 235, text: "この朝を、終わらせる。", mood: "reveal", camera: "slow-in" }, { at: 320, text: "次の一分は、まだ誰も保存していない。", mood: "warm", camera: "slow-out" }
  ]},
  "load-road": { track: "load-road", artKey: "load-road", introText: "次の記憶へ向かうあいだ、道だけが続いている。", cues: [
    { at: 0, mood: "calm", camera: "drift-right" }, { at: 42, text: "街の光が、少しずつ遠ざかる。", mood: "memory", camera: "slow-out" },
    { at: 92, text: "行き先は表示されない。", mood: "calm", camera: "drift-left" }, { at: 125, text: "それでも、道は先へ伸びている。", mood: "reveal", camera: "slow-in" }
  ]},
  "gadget-area": { track: "gadget-area", artKey: "gadget", introText: "止まった機械は、まだ何かを待っている。", cues: [
    { at: 0, mood: "industrial", camera: "slow-in" }, { at: 34, text: "電源系統――応答なし。", mood: "industrial", camera: "drift-left" },
    { at: 70, text: "歯車が、一つだけ逆向きに回っている。", mood: "industrial", camera: "drift-right" }, { at: 108, text: "小さな機械音。誰かがこちらを見ている。", mood: "memory", camera: "slow-in" },
    { at: 146, text: "IDENTITY MATCH …… 99.7%", mood: "reveal", camera: "still" }
  ]},
  wish: { track: "wish", artKey: "wish", introText: "ここには、まだ起きていないことを待つ声が残っている。", cues: [
    { at: 0, mood: "calm", camera: "slow-in" }, { at: 47, text: "誰かが、次の日を待っていた。", mood: "memory", camera: "drift-right" },
    { at: 126, text: "その先の記録は、ない。", mood: "calm", camera: "slow-out" }, { at: 194, text: "残っているのは、こうなってほしいという声だけ。", mood: "memory", camera: "still" },
    { at: 227, text: "それでも、その声は消えなかった。", mood: "reveal", camera: "slow-in" }, { at: 302, mood: "calm", camera: "slow-out" }
  ]},
  fantasy: { track: "fantasy", artKey: "fantasy", introText: "記録にないのに、景色は確かにここにある。", cues: [
    { at: 0, mood: "calm", camera: "slow-in" }, { at: 54, text: "見覚えのある材料だけで、見たことのない景色ができている。", mood: "memory", camera: "drift-right" },
    { at: 252, text: "保存元は見つからない。", mood: "calm", camera: "still" }, { at: 286, text: "それでも、ここは消えない。", mood: "reveal", camera: "slow-in" },
    { at: 412, mood: "calm", camera: "slow-out" }
  ]},
  beautiful: { track: "beautiful", artKey: "beautiful", introText: "同じ景色なのに、少しずつ形を変えている。", cues: [
    { at: 0, mood: "warm", camera: "slow-in" }, { at: 38, text: "一度だけの色が、目の前を通り過ぎる。", mood: "warm", camera: "drift-left" },
    { at: 120, text: "保存した瞬間と、今はもう同じではない。", mood: "memory", camera: "still" }, { at: 270, text: "戻せないから、見ていたくなる。", mood: "reveal", camera: "slow-out" },
    { at: 298, mood: "calm", camera: "slow-out" }
  ]},
  break: { track: "break", artKey: "break", introText: "管理信号が、動いていた世界を止めていく。", cues: [
    { at: 0, mood: "glitch", camera: "still" }, { at: 64, text: "書き込みが止められた。", mood: "glitch", camera: "drift-left" },
    { at: 172, text: "戻せば、新しく生まれた差分は消える。", mood: "memory", camera: "still" }, { at: 256, text: "BITが命令の外に経路を作る。", mood: "reveal", camera: "slow-in" },
    { at: 294, mood: "calm", camera: "slow-out" }
  ]},
  blavery: { track: "blavery", artKey: "blavery", introText: "戻れという命令だけが、後ろから追ってくる。", cues: [
    { at: 0, mood: "industrial", camera: "slow-in" }, { at: 84, text: "BITは命令を受信した。けれど、止まらなかった。", mood: "reveal", camera: "drift-right" },
    { at: 246, text: "管理者ではないReiの記録へ。", mood: "calm", camera: "slow-out" }, { at: 258, mood: "calm", camera: "slow-out" }
  ]},
  naked: { track: "naked", artKey: "naked", introText: "管理者というラベルを外して、Reiの記録だけを見る。", cues: [
    { at: 0, mood: "calm", camera: "slow-in" }, { at: 56, text: "99.7%の照合先が表示される。", mood: "memory", camera: "still" },
    { at: 218, text: "REIは、DR. REI本人ではない。", mood: "reveal", camera: "slow-in" }, { at: 316, text: "名前だけは、自分で持っていく。", mood: "warm", camera: "slow-out" },
    { at: 334, mood: "calm", camera: "slow-out" }
  ]},
  signal: { track: "signal", artKey: "signal", introText: "保存された海の外から、更新され続ける信号が届いている。", cues: [
    { at: 0, mood: "calm", camera: "slow-in" }, { at: 62, text: "送信元は、地球の外。", mood: "reveal", camera: "drift-right" },
    { at: 222, text: "ノイズの奥に、人の声がある。", mood: "memory", camera: "slow-in" }, { at: 506, text: "時刻は、今も進んでいる。", mood: "reveal", camera: "still" },
    { at: 548, mood: "calm", camera: "slow-out" }
  ]},
  spacecraft: { track: "spacecraft", artKey: "spacecraft", introText: "地球を離れた船の記録が、信号の道に残っている。", cues: [
    { at: 0, mood: "calm", camera: "slow-in" }, { at: 32, text: "居住船団は、地球圏を離れた。", mood: "memory", camera: "drift-left" },
    { at: 60, text: "終わったのは、地球の文明。", mood: "reveal", camera: "still" }, { at: 90, text: "記録は、未来へ渡すために残された。", mood: "warm", camera: "slow-in" },
    { at: 172, mood: "calm", camera: "slow-out" }
  ]},
  "new-create": { track: "new-create", artKey: "new-create", introText: "SEAを管理してきたDr. Reiの声が、初めてこちらへ届く。", cues: [
    { at: 0, mood: "calm", camera: "slow-in" }, { at: 64, text: "REIとDR. REIは、同じではない。", mood: "reveal", camera: "still" },
    { at: 232, text: "保存した記録から、新しいものを生む実験。", mood: "memory", camera: "drift-right" }, { at: 312, mood: "calm", camera: "slow-out" }
  ]},
  thundercloud: { track: "thundercloud", artKey: "thundercloud", introText: "未来を作ることの代償を、Dr. Reiは知っている。", cues: [
    { at: 0, mood: "glitch", camera: "slow-in" }, { at: 114, text: "新しい未来は、新しい苦しみも生む。", mood: "memory", camera: "still" },
    { at: 126, text: "RESTORE / DELETE / RESET", mood: "glitch", camera: "still" }, { at: 218, text: "どれでもない答え。", mood: "reveal", camera: "slow-in" },
    { at: 246, mood: "warm", camera: "slow-out" }
  ]},
  "space-home": { track: "space-home", artKey: "space-home", introText: "保存されたものから、まだ保存できない明日が始まる。", cues: [
    { at: 0, mood: "warm", camera: "slow-in" }, { at: 50, text: "外から届く人類の信号は、まだ点滅している。", mood: "warm", camera: "drift-right" },
    { at: 182, text: "WORLD COMPLETION 99.99%", mood: "reveal", camera: "still" }, { at: 282, mood: "calm", camera: "slow-out" },
    { at: 294, mood: "calm", camera: "slow-out" }
  ]}
};

export function getActiveListeningCue(track: TrackId, position: number) {
  const timeline = LISTENING_TIMELINES[track];
  let active: ListeningCue | undefined;
  for (const cue of timeline.cues) {
    if (position < cue.at) break;
    active = cue;
  }
  return active;
}
