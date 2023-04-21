import path from "node:path";
import { fileURLToPath } from 'url';

import express from "express";
import expressWs from "express-ws";

import {
  users, createUser, getConnectedUsers, getConnectedUser,
  games, createGame, getGame
} from "./stores.js";

// import Takuzu from "../public/assets/takuzu/index.js";

// Source: <https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/>
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const expressWsInstance = expressWs(app);
const ws_api_client = expressWsInstance.getWss('/api/ws');

const public_folder_path = path.resolve(__dirname, "..", "public");
app.use(express.static(public_folder_path));

app.get("/api/connected_users", (_, res) => {
  return res.json(getConnectedUsers());
});

app.get("/api/games/:id", (req, res) => {
  const id = req.params.id;
  if (!games[id]) return res.status(404).json(null);

  return res.status(200).json(getGame(id));
});

app.ws("/api/games/:id", (req, res) => {
  const game_id = req.params.id;
  if (!games[id]) return;

  /**
   * ID de l'utilisateur.
   * @type {string | null}
   */
  let user_id = null;

  console.log("setup ws", game_id)

  ws.on('message', (msg) => {
    let [command, ...data] = msg.split(":");
    data = data.join(":");

    switch (command) {
      case "user":
        console.log("logged", users[user_id].name);
        user_id = data;
        break;
    }
  });
})

app.ws("/api/ws", (ws) => {
  /**
   * ID de l'utilisateur.
   * @type {string | null}
   */
  let user_id = null;

  ws.on("close", () => {
    // On notifie les autres utilisateurs du nouvel utilisateur.
    ws_api_client.clients.forEach((client) => {
      client.send(`disconnected_user:${user_id}`);
    });

    delete users[user_id];
  });

  ws.on('message', (msg) => {
    let [command, ...data] = msg.split(":");
    data = data.join(":");

    switch (command) {
      case "new_id": {
        /** @type {string} */
        const username = data;

        // On crée le nouvel utilisateur et on donne l'ID à l'utilisateur.
        user_id = createUser(username);
        ws.send(`new_id:${user_id}`);
        ws.user_id = user_id;

        // On notifie les autres utilisateurs du nouvel utilisateur.
        ws_api_client.clients.forEach((client) => {
          client.send(`new_connected_user:${JSON.stringify(getConnectedUser(user_id))}`);
        });
        
        break;
      }

      case "status": {
        const status = JSON.parse(data);
        
        if (!status.in_game) users[user_id].status = "idle";
        else users[user_id].status = `in-game-${status.online ? "online" : "solo"}`;
        
        // On notifie les autres utilisateurs du changement.
        ws_api_client.clients.forEach((client) => {
          client.send(`connected_user_update:${JSON.stringify(getConnectedUser(user_id))}`);
        });
        
        break;
      }

      case "invite": {
        const { user_invited_id, game_config } = JSON.parse(data);
        const user_to_invite_ws = Array.from(ws_api_client.clients).find(client => client.user_id === user_invited_id);
        if (!user_to_invite_ws) return;

        const game_id = createGame(
          user_id,
          user_invited_id,
          game_config.size,
          game_config.fillFactor
        )

        // On notifie le joueur qu'il a été invité.
        user_to_invite_ws.send(`invited:${JSON.stringify({
          user_id,
          game_id
        })}`);

        // On notifie le créateur de l'invitation que la partie a bien été créee.
        ws.send(`invite:${game_id}`);
      }
    }
  });
});

app.get("*", (_, res) => {
  res.sendFile(path.resolve(public_folder_path, "index.html"));
});

app.listen(8080, () => {
  console.clear();
  console.log("=> Serveur démarré.\n\n\t- http://localhost:8080\n");
});
