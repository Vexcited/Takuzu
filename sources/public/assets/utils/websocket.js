// @ts-check

// import { rerenderUsersList } from "../render/pages/online.js";
import { getConnectedUsers } from "./rest.js";
import * as router from "../render/routes.js";
import { navigate } from "../render/routes.js";

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
   * @private
   * @type {string | undefined}
   */
  waitingCommandName = undefined;
  
  /**
   * @private
   * @type {((data: string) => unknown) | undefined}
   */
  waitingCommandNameCallback = undefined;

  /**
   * @private
   * @type {((command: string, message: string) => unknown) | undefined}
   */
  gameCommandCallback = undefined;

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
    this.ws.addEventListener("close", () => window.location.reload());
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
    const onlineUsers = (await getConnectedUsers())
      // On transforme la liste d'utilisateurs en un objet d'utilisateurs, + simple pour les mutations plus tard.
      .reduce((a, v) => ({ ...a, [v.id]: v}), {}) 

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
   * Envoyer la commande `name` au serveur avec les données `data`
   * et attend la réponse du serveur pour la retourner.
   * 
   * @public
   * @param {string} name 
   * @param {string} data 
   * @param {string} [responseName] - Le nom de la commande à attendre si différente de `name`. 
   */
  sendAndWait = async (name, data, responseName = name) => {
    this.waitingCommandName = responseName;

    const received_data = await new Promise((resolve) => {
      this.send(name, data);
      
      this.waitingCommandNameCallback = (data) => {
        resolve(data);
      }
    });

    return received_data;
  }

  /**
   * @param {string} game_id
   * @param {(command: string, message: string) => unknown} handler
   */
  connectToGame = (game_id, handler) => {
    this.send("join", game_id);
    this.gameCommandCallback = handler;
  }

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

      case "invited": {
        const invitation = JSON.parse(msg.data);
        const should_join = confirm(`Vous avez invité à faire un duel avec ${this.onlineUsers[invitation.user_id].name} ! Rejoindre ?`);

        if (!should_join) break;
        navigate("/online/game", {}, { id: invitation.game_id });

        break;
      }

      case "joined":
      case "game_action":
      case "game_win": {
        this.gameCommandCallback && this.gameCommandCallback(msg.command, msg.data);
        break;
      }

      default: {
        if (msg.command === this.waitingCommandName) {
          this.waitingCommandNameCallback && this.waitingCommandNameCallback(msg.data);
          break;
        }
      }
    }
  }
};
