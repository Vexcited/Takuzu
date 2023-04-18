// @ts-check

// import { createGame, destroyGame } from "./render/game.js";

import { useUsernameSelectionModal } from "./render/modals/username.js";
const [openUsernameSelectionModal] = useUsernameSelectionModal();

// On affiche le modal de séléction de nom d'utilisateur au chargement de la page.
document.body.onload = () => openUsernameSelectionModal();

// let __size = 0;

// // On récupère les boutons qui permettent de démarrer une partie de Takuzu.
// const startGameButtons = document.querySelectorAll(".__start-takuzu");
// startGameButtons.forEach((node) => {
//   const button = /** @type {HTMLButtonElement} */ (node);

//   button.onclick = () => {
//     const size = parseInt(button.dataset.size ?? "4");
//     // On change l'interface.
//     selectActiveRoute("/game");
//     // On crée la grille pour l'interface.
//     createGame(size);
//     __size = size;
//   }
// });

// [ // Les buttons retour à l'accueil pendant une partie.
//   document.getElementById("__/game_action_back_home1"),
//   document.getElementById("__/game_action_back_home2")
// ].forEach(button => {
//   if (button) button.onclick = () => {
//     selectActiveRoute("/");
//     destroyGame();
//     __size = 0;
//   } 
// });

// // Le button nouvelle grille pendant une partie.
// const gameNewGrid = document.getElementById("__/game_action_back_reset");
// if (gameNewGrid) gameNewGrid.onclick = () => {
//   destroyGame();
//   createGame(__size);
// };

// const startTakuzuOnlineButton = document.getElementById("__/move-to-online");
// if (startTakuzuOnlineButton) startTakuzuOnlineButton.onclick = () => {
//   // rerenderUsersList();
//   // On change l'interface.
//   // selectActiveRoute("/online");
//   navigate("/online");
// }
