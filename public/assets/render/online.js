// @ts-check

import { ws } from "../index.js";
import { createElement } from "../utils/helpers.js";
import { selectActiveRoute } from "./routes.js";

const goBackHomeButton = document.getElementById("__/online_action_back_home");
if (goBackHomeButton) goBackHomeButton.onclick = () => {
  // On change l'interface.
  selectActiveRoute("/");
}

const listRootElement = /** @type {HTMLElement} */ (document.getElementById("__/online_users_list"));

/** @param {import("../types").UserConnected} user */
const createListElement = (user) => createElement(
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

export const rerenderUsersList = () => {
  listRootElement.innerHTML = "";
  if (!ws) return;

  for (const user of ws.onlineUsers) {
    if (user.id === ws.user.id) continue;

    const element = createListElement(user);
    listRootElement.appendChild(element);
  }
};
