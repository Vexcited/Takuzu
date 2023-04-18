// @ts-check

import { navigate } from "../routes.js";
import { useWS } from "../../stores/ws.js";
import { createElement, renderToBody } from "../../utils/helpers.js";

/** @param {import("../../types.js").UserConnected} user */
const createOnlineUserComponent = (user) => createElement(
  "div",
  {
    class: "w-full flex flex-col gap-1",
    children: [
      createElement(
        "h3",
        {
          class: "text-md font-medium",
          children: user.name
        }
      ),

      createElement(
        "p",
        {
          class: "text-sm",
          children: user.id
        }
      )
    ]
  }
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
      children: "Takuzu en ligne"
    })

    this.online_users_list = createElement("div", {
      class: "flex flex-col gap-4"
    });

    const go_home_button = createElement("button", {
      type: "button",
      class: "border border-[#4C4F69] text-[#4C4F69] hover:bg-[#4C4F69] hover:text-[#EFF1F5] hover:font-medium px-4 py-2 hover:scale-105 transition-[transform,background]",
      children: "Revenir à la page d'accueil"
    });

    go_home_button.onclick = () => {
      // On change l'interface.
      navigate("/");
    };

    this.container = createElement("section", {
      class: "flex flex-col items-center justify-between gap-4 w-full min-h-screen h-full p-8",
      children: [title, this.online_users_list, go_home_button]
    });
  }

  /** @public */
  update = () => {
    const [ws] = useWS();

    // On vide le contenu de la liste.
    this.online_users_list.innerHTML = "";

    for (const user of ws.onlineUsers) {
      if (user.id === ws.user.id) continue;
  
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
