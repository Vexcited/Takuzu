import { ws } from "../index.js";

const listRootElement = document.getElementById("__/online_users_list");

const createListElement = (user) => {
  const element = document.createElement("div");
  element.setAttribute("class", "w-full flex flex-col gap-1");

  element.innerHTML = `
    <h3 class="text-md font-medium">${user.name}</h3>
    <p class="text-sm">${user.id}</p>
  `;

  return element;
}

export const rerenderUsersList = () => {
  listRootElement.innerHTML = "";

  for (const user of ws.currentOnlineUsers) {
    if (user.id === ws.id) continue;

    const element = createListElement(user);
    listRootElement.appendChild(element);
  }
};

