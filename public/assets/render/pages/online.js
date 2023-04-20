// @ts-check

import { navigate } from "../routes.js";
import { useWS } from "../../stores/ws.js";
import { createElement, renderToBody } from "../../utils/helpers.js";

import { createButtonComponent } from "../components/button.js";

/** @type {Record<import("../../types.js").UserConnected["status"], string>} */
const STATUS_TEXT = /** @type {const} */ ({
  idle: "Dans les menus",
  "in-game-online": "En partie en ligne",
  "in-game-solo": "En partie solo"
});

/** @param {import("../../types.js").UserConnected} user */
const createOnlineUserComponent = (user) => createElement(
  "div",
  { class: "w-full flex flex-col gap-1" },
  [
    createElement(
      "h3",
      { class: "text-md font-medium" },
      user.name
    ),

    createElement(
      "p",
      { class: "text-sm" },
      STATUS_TEXT[user.status]
    )
  ]
);

class RenderPageOnline {
  /** @public */
  route = "/online";

  /** @type {HTMLElement} */
  container;
  /** @type {HTMLElement} */
  online_users_list;

  constructor () {
    this.make();
    this.update();

    renderToBody(this.container);
  }

  /** @private */
  make = () => {
    const title = createElement("h1", {
      class: "text-3xl font-medium",
    }, "Takuzu en ligne")

    this.online_users_list = createElement("div", {
      class: "flex flex-col gap-4"
    });

    const go_home_button = createButtonComponent({
      children: "Revenir à la page d'accueil",
      color: "text",
      type: "button"
    });

    go_home_button.onclick = () => {
      // On change l'interface.
      navigate("/");
    };

    this.container = createElement("section", {
      class: "flex flex-col items-center justify-between gap-4 w-full min-h-screen h-full p-8",
    }, [title, this.online_users_list, go_home_button]);
  }

  /** @public */
  update = () => {
    const [ws] = useWS();
    const connection = ws();

    // On vide le contenu de la liste.
    this.online_users_list.innerHTML = "";
    if (!connection) return;

    const users = Object.values(connection.onlineUsers);

    // On retire 1 car on ne veut pas compter nous même.
    if (users.length - 1 > 0) {
      for (const user of users) {
        if (user.id === connection.user.id) continue;
    
        const element = createOnlineUserComponent(user);
        this.online_users_list.appendChild(element);
      }
    }
    else {
      this.online_users_list.appendChild(
        createElement("div", {
          class: "flex flex-col items-center justify-center gap-2"
        }, [
          createElement("h2", {
            class: "text-xl font-medium"
          }, "Personne est en ligne !"),
          createElement("p", {
            class: "text-md"
          }, "Revenez plus tard...")
        ])
      )
    }
  }

  /** @public */
  destroy = () => {
    this.container.remove();
  }
}

export default RenderPageOnline;
