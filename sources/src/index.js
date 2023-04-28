import path from "node:path";
import { fileURLToPath } from 'url';

import express from "express";
import expressWs from "express-ws";

import {
  users, createUser, getConnectedUsers, getConnectedUser,
  games, createGame, getGame
} from "./stores.js";

import { TileValues } from "../public/assets/takuzu/constants.js";

// Source: <https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/>
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const expressWsInstance = expressWs(app);
const ws_client = expressWsInstance.getWss('/api/ws');

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

app.ws("/api/ws", (ws) => {
  /**
   * ID de l'utilisateur.
   * @type {string | null}
   */
  let user_id = null;

  ws.on("close", () => {
    // On notifie les autres utilisateurs du nouvel utilisateur.
    ws_client.clients.forEach((client) => {
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
        ws_client.clients.forEach((client) => {
          client.send(`new_connected_user:${JSON.stringify(getConnectedUser(user_id))}`);
        });
        
        break;
      }

      case "status": {
        const status = JSON.parse(data);
        
        if (!status.in_game) users[user_id].status = "idle";
        else users[user_id].status = `in-game-${status.online ? "online" : "solo"}`;
        
        // On notifie les autres utilisateurs du changement.
        ws_client.clients.forEach((client) => {
          client.send(`connected_user_update:${JSON.stringify(getConnectedUser(user_id))}`);
        });
        
        break;
      }

      case "invite": {
        const { user_invited_id, game_config } = JSON.parse(data);
        const user_to_invite_ws = Array.from(ws_client.clients).find(client => client.user_id === user_invited_id);
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

      case "join": {
        const game_id = data;

        const game = games[game_id];
        if (!game) break;

        /** @type {"user1" | "user2" | "spectator"} */
        let user_index;
        
        // On vérifie si l'ID correspond bien.
        if (game.user1.id === user_id) {
          game.user1.ws = ws;
          user_index = "user1";
        }
        else if (game.user2.id === user_id) {
          game.user2.ws = ws;
          user_index = "user2";
        }
        else {
          user_index = "spectator";
        }

        users[user_id].current_online_game_id = game_id;

        // On notifie les participants à la partie d'une connexion.
        [game.user1.ws, game.user2.ws].filter(Boolean)
          .forEach(client => client.send(`joined:${JSON.stringify({
            user_id,
            is: user_index
          })}`));

        break;
      }

      case "game_action": {
        const { game_id, rowIndex, columnIndex, value } = JSON.parse(data);
        const game = games[game_id];
        if (!game) break;

        /** @type {"user1" | "user2" | "spectator"} */
        let user_index;
        
        // On vérifie si l'ID correspond bien.
        if (game.user1.id === user_id) {
          game.user1.ws = ws;
          user_index = "user1";
        }
        else if (game.user2.id === user_id) {
          game.user2.ws = ws;
          user_index = "user2";
        }
        else break;

        const user_grid = game[user_index].grid;

        // On effectue la modification dans la grille.
        user_grid.change(rowIndex, columnIndex, value);

        // Les participants à la partie.
        const game_users_ws = [game.user1.ws, game.user2.ws]
          
        // On notifie les participants d'un changement de grille.
        game_users_ws
          .filter(
            // On n'averti pas l'utilisateur qui a effectué le changement - inutile.
            client => client && client.user_id !== user_id
          )
          .forEach(client => client.send(`game_action:${JSON.stringify({
            user_id,
            is: user_index,
            grid_change: { rowIndex, columnIndex, value }
          })}`));

        // On vérifie si la grille est remplie avant de lancer une vérification.
        let isFull = true;
        for (const row of user_grid.task) {
          if (!isFull) break;
          for (const column_item of row) {
            if (column_item === TileValues.EMPTY) {
              isFull = false;
              break;
            }
          }
        }

        if (!isFull) return;
        const check = user_grid.check();
        if (check.error) return;

        // S'il n'y a pas d'erreur, celà signifie que le joueur à gagné.
        game_users_ws.forEach(client => {
          client.send(`game_win:${JSON.stringify({
            user_id,
            is: user_index
          })}`);

          users[client.user_id].current_online_game_id = null;
        });

        delete games[game_id];
        break;
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
