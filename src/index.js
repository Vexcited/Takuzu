const path = require("path");

const express = require("express");
const app = express();

// Import de WS
require("express-ws")(app);

const { users, createUser } = require("./stores");

const public_folder_path = path.resolve(__dirname, "..", "public");
app.use(express.static(public_folder_path));

app.ws("/api", (ws) => {
  ws.on('message', (msg) => {
    if (msg === "new_id") {
      const user_id = createUser();
      ws.send(`id:${user_id}`);
      return;
    }

    let [command, ...data] = msg.split(":");
    data = data.join(":");

    switch (command) {
      case "ping": {
        const user_id = data;
        const user = users[user_id];
        if (!user) break;

        user.lastPingTime = new Date();
        break;
      }
    }
  });
});


app.listen(8080, () => console.log("started."));
