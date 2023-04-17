const path = require("path");

const express = require("express");
const app = express();

// Import de WS
const expressWs = require("express-ws")(app);

const { users, createUser, getConnectedUsers } = require("./stores");
const ws_client = expressWs.getWss('/api');

const public_folder_path = path.resolve(__dirname, "..", "public");
app.use(express.static(public_folder_path));

app.ws("/api", (ws) => {
  ws.on('message', (msg) => {
    let [command, ...data] = msg.split(":");
    data = data.join(":");

    switch (command) {
      case "new_id": {
        const user_id = createUser(ws_client);
        ws.send(`id:${user_id}`);
        break;
      }

      case "ping": {
        const user_id = data;
        const user = users[user_id];
        if (!user) break;

        user.lastPingTime = new Date();
        break;
      }

      case "connectedUsers": {
        const connectedUsers = getConnectedUsers();
        ws.send(`connectedUsers:${JSON.stringify(connectedUsers)}`);
        break;
      }
    }
  });
});

app.listen(8080, () => console.log("started."));
