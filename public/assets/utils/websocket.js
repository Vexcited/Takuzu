// @ts-check

// import { rerenderUsersList } from "../render/pages/online.js";
import { getConnectedUsers } from "./rest.js";
import * as router from "../render/routes.js";

export class Connection {
  /**
   * Instance de la connexion au serveur.
   * 
   * @private
   * @type {WebSocket}
   */
  ws;

  
  /**
   * L'utilisateur connecté au serveur.
   * 
   * @public
   * @type {import("../types.js").UserConnected}
   */
  user;

  /**
   * Cache des utilisateurs connectés au serveur. \
   * Mis à jour à chaque fois que le client reçoit un message de type `connectedUsers`. \
   * On peut forcer la mise à jour en envoyant `connectedUsers:true` au serveur.
   * 
   * @public
   * @type {Record<string, import("../types.js").UserConnected>}
   */
  onlineUsers = {};

  /**
   * @param {WebSocket} ws - Connexion au serveur WS.
   * @param {import("../types.js").UserConnected} user - Utilisateur connecté au serveur.
   * @param {Record<string, import("../types.js").UserConnected>} onlineUsers - Utilisateurs connectés au serveur.
   */
  constructor (ws, user, onlineUsers) {
    this.ws = ws;
    this.user = user;
    this.onlineUsers = onlineUsers;

    this.ws.addEventListener("message", this.handler);
  }

  /**
   * Crée une nouvelle connexion au serveur WS.
   * @param {string} username - Pseudonyme de l'utilisateur. 
   * @returns {Promise<Connection>}
   */
  static create = async (username) => {
    const url = new URL(window.location.href);
    url.pathname = "/api/ws";
    url.protocol = url.protocol.replace("http", "ws");
  
    const ws = new WebSocket(url);

    // On attend que le serveur nous crée un nouveau profil.
    const user = await new Promise((resolve) => {
      ws.onopen = () => ws.send(`new_id:${username}`);
      /** @type {null | string} */
      let user_id = null;

      /** @param {MessageEvent} event */
      const messageListenerHandler = (event) => {
        /** @type {string} */
        const raw_msg = event.data;
        const msg = Connection.parse(raw_msg);

        switch (msg.command) {
          // On récupère notre identifiant.
          case "new_id":
            user_id = msg.data;
            break;
          
          // On attend que le serveur envoie à tout les clients
          // que l'on est connecté avant de continuer.
          // Lorsque c'est le cas, on en profite pour récupèrer
          // nos données d'utilisateur et on les renvoie. 
          case "new_connected_user": {
            const new_user_data = JSON.parse(msg.data);
            if (new_user_data.id !== user_id) break;

            ws.removeEventListener("message", messageListenerHandler)
            resolve(new_user_data);
          }
        }
      };

      ws.addEventListener("message", messageListenerHandler);
    });

    // On récupère les utilisateurs actuellement connectés.
    const onlineUsers = await getConnectedUsers();

    return new Connection(ws, user, onlineUsers);
  }

  /**
   * Permet de récupérer le nom
   * et les données d'un événement envoyés par le serveur.
   * 
   * @public
   * @param {string} msg
   */
  static parse = (msg) => {
    let [command, ...data_raw] = msg.split(":");
    const data = data_raw.join(":");

    return { command, data };
  }

  /**
   * Envoyer la commande `name` au serveur avec les données `data`.
   * 
   * @public
   * @param {string} name 
   * @param {string} data 
   */
  send = (name, data) => this.ws.send(`${name}:${data}`);

  /**
   * @private
   * @param {MessageEvent} event
   */
  handler = (event) => {
    /** @type {string} */
    const raw_msg = event.data;
    const msg = Connection.parse(raw_msg);

    switch (msg.command) {
      case "connected_user_update":
      case "new_connected_user": {
        const user = JSON.parse(msg.data);
        this.onlineUsers[user.id] = user;

        // On refait le rendu de la liste dans la route `/online`.
        if (router.current.route === "/online") router.current.update();
        break;
      }

      case "disconnected_user": {
        delete this.onlineUsers[msg.data];

        // On refait le rendu de la liste dans la route `/online`.
        if (router.current.route === "/online") router.current.update();
        break;
      }
    }
  }
};
