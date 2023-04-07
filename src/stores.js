const uuid = require("uuid");
const users = {};

const createUser = () => {
  const id = uuid.v4();
  users[id] = {
    name: "Player " + Object.keys(users).length,
    pingTimerTimeout: setInterval(() => {
      const user = users[id];
      const lastDate = user.lastPingTime.getTime();
      const currentDate = new Date().getTime()
      const timeoutDate = currentDate - 10_000;

      if (lastDate > timeoutDate) return;
      clearInterval(user.pingTimerTimeout);
      delete users[id];
    }, 5_000),
    lastPingTime: new Date()
  };
  
  return id;
};

module.exports = {
  createUser,
  users
};
