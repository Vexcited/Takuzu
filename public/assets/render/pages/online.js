// @ts-check

import { navigate } from "../routes.js";
import { useWS } from "../../stores/ws.js";
import { createElement, renderToBody } from "../../utils/helpers.js";

import { createButtonComponent } from "../components/button.js";

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
      user.id
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
      content: "Revenir à la page d'accueil",
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

    for (const user of connection.onlineUsers) {
      if (user.id === connection.user.id) continue;
  
      const element = createOnlineUserComponent(user);
      this.online_users_list.appendChild(element);
    }
  }

  /** @public */
  destroy = () => {
    this.container.remove();
  }
}

export default RenderPageOnline;
