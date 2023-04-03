import Takuzu from "../takuzu/index.js";
import { TileValues } from "../takuzu/constants.js";

/** @type {HTMLDivElement} */
export const game_root = document.getElementById("game-root");

// Shared variables.
/** @type {Takuzu | null} */
let grid = null;
/** @type {number} */
let size = 6;

const cleanGameRoot = () => game_root.innerHTML = "";

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

export const createGame = () => {
  cleanGameRoot();

  grid = new Takuzu(size);
  grid.generate();
  grid.prepare(0.8);

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
        class: "flex items-center justify-center h-8 w-8 text-black border border-black bg-white disabled:bg-black disabled:text-white",
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
        console.log(grid.task, grid.check(), new_value);
        rowItemElement.innerText = new_value === TileValues.EMPTY ? "" : new_value;
      }

      rowItemElement.onclick = (event) => {
        event.preventDefault();
        updateContent();
      }

      columnElement.appendChild(rowItemElement);
    }

    mainGrid.appendChild(columnElement);
  }

  return mainGrid
}
