export class Connection {
  constructor () {
    const url = new URL(window.location.href);
    url.pathname = "/api";
    url.protocol = "ws:";
  
    this.ws = new WebSocket(url);
    this.ws.addEventListener("open", () => {
      this.ws.send("new_id");
    });
  
    this.ws.addEventListener("message", (event) => {
      if (event.data.startsWith("id:")) this.id = event.data.replace("id:", "");
      console.log(event.data);
    });
    
    setInterval(() => {
      if (!this.id) return;
  
      console.log("send ping");
      this.send("ping:" + this.id);
    }, 2_000);
  }

  send = (data) => this.ws.send(data)
};
