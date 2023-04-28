export interface UserConnected {
  name: string,
  id: string,

  status: "idle" | "in-game-solo" | "in-game-online";
}
