const uuid = require("uuid");
const users = {};

/** @param {string} username - Nom du nouvel utilisateur. */
const createUser = (username) => {
  const id = uuid.v4();
  users[id] = {
    name: username
  };

  return id;
};

const getConnectedUsers = () => Object.entries(users).map(([id, user]) => ({
  id,
  name: user.name
}));

/** @param {string} id */
const getConnectedUser = (id) => {
  const user = users[id];

  return {
    id,
    name: user.name
  };
} ;

module.exports = {
  getConnectedUsers,
  getConnectedUser,
  createUser,
  users
};
