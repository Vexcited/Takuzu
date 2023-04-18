import path from "node:path";
import { fileURLToPath } from 'url';

import express from "express";
import expressWs from "express-ws";

import { users, createUser, getConnectedUsers, getConnectedUser } from "./stores.js";

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

        // On notifie les autres utilisateurs du nouvel utilisateur.
        ws_client.clients.forEach((client) => {
          client.send(`new_connected_user:${JSON.stringify(getConnectedUser(user_id))}`);
        });
        
        break;
      }
    }
  });
});

app.listen(8080, () => console.log("started."));
