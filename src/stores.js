// @ts-check

import Takuzu from "../public/assets/takuzu/index.js";
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

export const games = {};

/**
 * @param {string} user1_id 
 * @param {string} user2_id
 * @param {number} [gridSize]
 * @param {number} [gridFillFactor]
 */
export const createGame = (user1_id, user2_id, gridSize = 4, gridFillFactor = 0.4) => {
  const id = uuid();

  const grid = new Takuzu(gridSize);
  grid.generate();
  grid.prepare(gridFillFactor);

  games[id] = {
    size: gridSize,
    fillFactor: gridFillFactor,

    user1: {
      id: user1_id,
      ws: null,
      grid: grid.clone()
    },
    
    user2: {
      id: user2_id,
      ws: null,
      grid: grid.clone()
    }
  };

  return id;
};

/** @param {string} id */
export const getGame = (id) => {
  const game = games[id];
  if (!game) return;

  return {
    size: game.size,
    fillFactor: game.fillFactor,

    user1: {
      id: game.user1.id,
      joined: game.user1.ws !== null,
      grid: game.user1.grid.task
    },
    
    user2: {
      id: game.user2.id,
      joined: game.user2.ws !== null,
      grid: game.user2.grid.task
    }
  }
}