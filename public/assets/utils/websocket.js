import { rerenderUsersList } from "../render/online.js";

export class Connection {
  currentOnlineUsers = [];

  constructor () {
    const url = new URL(window.location.href);
    url.pathname = "/api";
    url.protocol = "ws:";
  
    this.ws = new WebSocket(url);
    this.ws.addEventListener("open", () => {
      this.ws.send("new_id:true");
    });
  
    this.ws.addEventListener("message", (event) => this.handler(event.data));
    
    setInterval(() => {
      if (!this.id) return;
      this.send("ping:" + this.id);
    }, 5_000);
  }

  send = (data) => this.ws.send(data);
  handler = (msg) => {
    let [command, ...data] = msg.split(":");
    data = data.join(":");

    switch (command) {
      case "id":
        this.id = data;
        this.send("connectedUsers:true");
        break;

      case "connectedUsers": 
        this.currentOnlineUsers = JSON.parse(data);
        rerenderUsersList(); // On refait le rendu de la liste dans la route `/online`.
        break;
    }
  }
};
