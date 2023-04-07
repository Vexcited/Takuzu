import Takuzu from "../takuzu/index.js";
import { TileValues } from "../takuzu/constants.js";

/** @type {HTMLDivElement} */
const game_board = document.getElementById("__/game_board");
/** @type {HTMLDivElement} */
const game_hints = document.getElementById("__/game_hint");
/** @type {HTMLHeadingElement} */
const game_timer = document.getElementById("__/game_timer");

/** @type {Takuzu | null} */
let grid = null;

const cleanGameRoot = () => game_board.innerHTML = "";

/**
 * @param {keyof HTMLElementTagNameMap} tagName 
 * @param {Record<string, string>} attributes
 */
const createElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);

  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }

  return element;
};

/** @param {number} size */
export const createGame = (size) => {
  cleanGameRoot();

  grid = new Takuzu(size);
  grid.generate();
  grid.prepare(0.2);

  const mainGrid = createElement("div", {
    class: "flex flex-col gap-1"
  });

  for (let columnIndex = 0; columnIndex < grid.task.length; columnIndex++) {
    const column = grid.task[columnIndex];

    const columnElement = createElement("div", {
      class: "flex flex-row gap-1"
    });

    for (let rowItemIndex = 0; rowItemIndex < column.length; rowItemIndex++) {
      const row = column[rowItemIndex];
      
      const rowItemElement = createElement("button", {
        type: "button",
        class: "__game_grid_button flex items-center justify-center h-8 w-8 text-black border border-black bg-white disabled:bg-black disabled:text-white",
        "data-row-index": rowItemIndex.toString(),
        "data-column-index": columnIndex.toString(), 
      });

      if (row !== TileValues.EMPTY) {
        rowItemElement.setAttribute("disabled", true);
      }

      rowItemElement.innerText = row === TileValues.EMPTY ? "" : row;

      const updateContent = () => {
        let new_value = rowItemElement.innerText === "" ? TileValues.EMPTY : rowItemElement.innerText;
        
        if (new_value === TileValues.EMPTY) new_value = TileValues.ZERO;
        else if (new_value === TileValues.ZERO) new_value = TileValues.ONE;
        else if (new_value === TileValues.ONE) new_value = TileValues.EMPTY;

        grid.change(columnIndex, rowItemIndex, new_value);
        const check = grid.check();
        rowItemElement.innerText = new_value === TileValues.EMPTY ? "" : new_value;

        if (check.error) {
          game_hints.innerText = grid.check().message;
        } 
        else {
          clearInterval(__timer);
          game_hints.innerText = "Vous avez terminé!";

          
          document.querySelectorAll(".__game_grid_button").forEach(
            button => {
              button.onclick = () => null
            }
          );

          document.querySelectorAll(".__game_actions_ingame").forEach(
            button => {
              button.classList.add("hidden");
            }
          );
          
          document.querySelectorAll(".__game_actions_finish").forEach(
            button => {
              button.classList.remove("hidden");
            }
          );

        }
      }

      rowItemElement.onclick = (event) => {
        event.preventDefault();
        updateContent();
      }

      columnElement.appendChild(rowItemElement);
    }

    mainGrid.appendChild(columnElement);
  }

  game_board.appendChild(mainGrid);
  createTimer();
}

/** @type {NodeJS.Timer | null} */
let __timer = null;
let __timer_ms = 0;

const createTimer = () => {
  const updateEveryMS = 1000;
  
  __timer_ms = 0;
  __timer = setInterval(() => {
    __timer_ms += updateEveryMS;

    const date = new Date(0);
    date.setMilliseconds(__timer_ms);

    const formated = date.toISOString().substring(11, 19);
    game_timer.innerText = formated;
  }, updateEveryMS);
};

export const destroyGame = () => {
  grid = null;
  cleanGameRoot();
  
  document.querySelectorAll(".__game_actions_ingame").forEach(
    button => {
      button.classList.remove("hidden");
    }
  );
  
  document.querySelectorAll(".__game_actions_finish").forEach(
    button => {
      button.classList.add("hidden");
    }
  );

  clearInterval(__timer);
  __timer_ms = 0;

  game_timer.innerText = "00:00:00";
  game_hints.innerText = "";
}