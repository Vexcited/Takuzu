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

    console.log(command, data, users);
  });
})


app.listen(8080, () => console.log("start: server"));
