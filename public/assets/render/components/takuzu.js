// @ts-check

import { ERRORS, TileValues } from "../../takuzu/constants.js";

import Takuzu from "../../takuzu/index.js";
import { classNames, createElement } from "../../utils/helpers.js";

const createZeroSVG = (gradientInside = false) => {
  if (gradientInside) return `
    <svg width="100%" height="100%" viewBox="0 0 75 119" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 119L75 119V1.20005e-05L1.04033e-05 0L0 119ZM25 25L25 94H50L50 25H25Z" fill="url(#paint0_linear_12_10)"/>
      <defs>
        <linearGradient id="paint0_linear_12_10" x1="37.5" y1="0" x2="37.5" y2="119" gradientUnits="userSpaceOnUse">
          <stop stop-color="#8839EF"/>
          <stop offset="1" stop-color="#7287FD"/>
        </linearGradient>
      </defs>
    </svg>
  `;

  return `
    <svg width="100%" height="100%" viewBox="0 0 75 119" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 119L75 119V-3.25826e-06L1.04033e-05 -1.52588e-05L0 119ZM25 25L25 94H50L50 25H25Z" fill="#EFF1F5"/>
    </svg>
  `;
};

const createOneSVG = (gradientInside = false) => {
  if (gradientInside) return `
    <svg width="100%" height="100%" viewBox="0 0 50 119" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 0L50 0V119H25L25 25H0L0 0L25 0Z" fill="url(#paint0_linear_12_9)"/>
      <defs>
        <linearGradient id="paint0_linear_12_9" x1="25" y1="0" x2="25" y2="119" gradientUnits="userSpaceOnUse">
          <stop stop-color="#8839EF"/>
          <stop offset="1" stop-color="#7287FD"/>
        </linearGradient>
      </defs>
    </svg>
  `;

  return `
    <svg width="100%" height="100%" viewBox="0 0 50 119" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 0L50 0V119H25L25 25H0L0 0L25 0Z" fill="#EFF1F5"/>
    </svg>
  `;
};

/** @param {"0" | "1"} value */
const createButtonContentFrom = (value, gradientInside = false) => {
  if (value === "0") return createZeroSVG(gradientInside);
  else return createOneSVG(gradientInside);
};

/**
 * @param {Object} props
 * @param {number} props.size
 * @param {number} [props.fillFactor]
 * @param {HTMLElement} props.timerElement
 * @param {HTMLElement} props.hintsElement
 * @returns {HTMLDivElement}
 */
export const createTakuzuGridComponent = (props) => {
  const grid = new Takuzu(props.size);
  grid.generate();
  grid.prepare();

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
      props.timerElement.innerText = formated;
    }, updateEveryMS);
  };

  const mainGrid = createElement("div", {
    class: "flex flex-col items-center justify-center gap-1 w-full"
  });

  for (let rowIndex = 0; rowIndex < grid.task.length; rowIndex++) {
    const row = grid.task[rowIndex];

    const rowContainerElement = createElement("div", {
      class: "flex flex-row gap-1 w-full h-auto justify-center"
    });

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const value = row[columnIndex];
      
      const rowItemElement = createElement("button",
        {
          type: "button",
          class: classNames(
            "__game_grid_button",
            "flex items-center justify-center aspect-square max-w-[64px] max-h-[64px] min-w-[24px] min-h-[24px] w-full h-full p-2",
            "border-4 border-[#4C4F69]",
            "bg-[#EFF1F5] disabled:bg-gradient-to-t disabled:from-[#7287FD] disabled:to-[#8839EF]"
          ),

          "data-row-index": rowIndex.toString(),
          "data-column-index": columnIndex.toString(), 
          "data-value": value,
          disabled: (value !== TileValues.EMPTY) ? "true" : undefined
        }
      );

      rowItemElement.innerHTML = value === TileValues.EMPTY ? "" : createButtonContentFrom(value);

      const updateContent = () => {
        const old_value = rowItemElement.dataset.value;
        const new_value = (old_value === TileValues.ZERO) ? TileValues.ONE : TileValues.ZERO;

        grid.change(rowIndex, columnIndex, new_value);
        rowItemElement.innerHTML = createButtonContentFrom(new_value, true);
        rowItemElement.dataset.value = new_value;
        
        let isFull = true;
        for (const row of grid.task) {
          for (const column_item of row) {
            if (column_item === TileValues.EMPTY) {
              isFull = false;
              break;
            }
          }
        }

        props.hintsElement.innerText = ERRORS.FILL_GRID_FIRST;
        if (!isFull) return;

        const check = grid.check();
        if (check.error) {
          props.hintsElement.innerText = check.message;
          return;
        }

        if (__timer) clearInterval(__timer);
        props.hintsElement.innerText = "Vous avez terminé!";
        
        document.querySelectorAll(".__game_grid_button").forEach(
          (raw_button) => {
            const button = /** @type {HTMLElement} */ (raw_button);
            // On désactive les events sur les boutons.
            button.onclick = () => null;
            button.oncontextmenu = () => null;
            // On montre le curseur par défaut au survol des boutons
            // pour ne pas donner l'impression qu'on peut cliquer dessus.
            button.classList.add("cursor-default");
          }
        );

        // On cache les actions qui ne sont sensé
        // être disponible qu'en jeu.
        document.querySelectorAll(".__game_actions_ingame").forEach(
          button => {
            button.classList.add("hidden");
          }
        );
          
        // On montre les actions qui sont
        // disponible dès que la partie est terminée.
        document.querySelectorAll(".__game_actions_finish").forEach(
          button => {
            button.classList.remove("hidden");
          }
        );
      };

      /** Permet de supprimer le contenu d'une tuile. */
      const removeContent = () => {
        grid.change(rowIndex, columnIndex, TileValues.EMPTY);
        rowItemElement.dataset.value = TileValues.EMPTY;
        rowItemElement.innerHTML = "";
        props.hintsElement.innerText = ERRORS.FILL_GRID_FIRST;
      }

      rowItemElement.onclick = (event) => {
        event.preventDefault();

        // Clique-gauche.
        if (event.button === 0) updateContent();
        // Clique-droit.
        else if (event.button === 2) removeContent();
      };

      // Clique-droit.
      rowItemElement.oncontextmenu = (event) => {
        event.preventDefault();
        removeContent();
      };

      rowContainerElement.appendChild(rowItemElement);
    }

    mainGrid.appendChild(rowContainerElement);
  }

  createTimer();
  
  return createElement("div", {
    class: "w-full"
  },  mainGrid);
}
