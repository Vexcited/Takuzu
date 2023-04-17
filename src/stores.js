const uuid = require("uuid");
const users = {};

/**
 * On passe l'instance du serveur WS pour notifier les utilisateurs plus tard.
 */
const createUser = (ws_client) => {
  const id = uuid.v4();
  users[id] = {
    name: "Player " + id.split("-")[0],
    pingTimerTimeout: setInterval(() => {
      const user = users[id];
      const lastDate = user.lastPingTime.getTime();
      const currentDate = new Date().getTime()
      const timeoutDate = currentDate - 10_000;

      if (lastDate > timeoutDate) return;
      clearInterval(user.pingTimerTimeout);
      delete users[id];
      
      // On notifie tout les autres clients qu'un utilisateur est parti.
      const connectedUsers = getConnectedUsers();
      ws_client.clients.forEach((client) => {
        client.send(`connectedUsers:${JSON.stringify(connectedUsers)}`);
      });
    }, 5_000),
    lastPingTime: new Date()
  };

  // On notifie tout les autres clients qu'il y a un nouvel utilisateur.
  const connectedUsers = getConnectedUsers();
  ws_client.clients.forEach((client) => {
    client.send(`connectedUsers:${JSON.stringify(connectedUsers)}`);
  });
  
  return id;
};

const getConnectedUsers = () => Object.entries(users).map(([id, user]) => ({
  id,
  name: user.name
}));

module.exports = {
  getConnectedUsers,
  createUser,
  users
};
