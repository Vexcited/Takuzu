const uuid = require("uuid");
const users = {};

const createUser = () => {
  const id = uuid.v4();
  users[id] = {
    name: "Player " + Object.keys(users).length,
    pings: 0
  };
  
  return id;
};

module.exports = {
  createUser,
  users
};
