const path = require("path");

const express = require("express");
const app = express();

// Import de WS
const expressWs = require("express-ws")(app);

const { users, createUser, getConnectedUsers, getConnectedUser } = require("./stores");

const public_folder_path = path.resolve(__dirname, "..", "public");
app.use(express.static(public_folder_path));

app.get("/api/connected_users", (_, res) => {
  return res.json(getConnectedUsers());
});

const ws_client = expressWs.getWss('/api/ws');
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
