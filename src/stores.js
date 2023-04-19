// @ts-check

import { v4 as uuid } from "uuid";
export const users = {};

/** @param {string} username - Nom du nouvel utilisateur. */
export const createUser = (username) => {
  const id = uuid();
  users[id] = {
    name: username,
    status: "idle"
  };

  return id;
};

export const getConnectedUsers = () => Object.keys(users)
  .map((id) => getConnectedUser(id));

/** @param {string} id */
export const getConnectedUser = (id) => {
  const user = users[id];

  return {
    id,
    ...user
  };
};
