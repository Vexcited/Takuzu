import { v4 as uuid} from "uuid";
export const users = {};

/** @param {string} username - Nom du nouvel utilisateur. */
export const createUser = (username) => {
  const id = uuid();
  users[id] = {
    name: username
  };

  return id;
};

export const getConnectedUsers = () => Object.entries(users).map(([id, user]) => ({
  id,
  name: user.name
}));

/** @param {string} id */
export const getConnectedUser = (id) => {
  const user = users[id];

  return {
    id,
    name: user.name
  };
};
