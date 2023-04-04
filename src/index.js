import { createGame, destroyGame } from "./render/game.js";
import { selectActiveRoute } from "./render/routes.js";

// On récupère les boutons qui permettent de démarrer une partie de Takuzu.
const startGameButtons = document.querySelectorAll(".__start-takuzu");
startGameButtons.forEach(
  /** @param {HTMLButtonElement} button */
  (button) => {
    button.onclick = () => {
      const size = parseInt(button.dataset.size ?? 2);
      // On change l'interface.
      selectActiveRoute("/game");
      // On crée la grille pour l'interface.
      createGame(size);
    }
  }
);

document.getElementById("__/game_action_back_home1")
  .onclick = () => {
    selectActiveRoute("/");
    destroyGame();
  }

document.getElementById("__/game_action_back_home2")
  .onclick = () => {
    selectActiveRoute("/");
    destroyGame();
  }