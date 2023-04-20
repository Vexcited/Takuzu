// @ts-check

import { useWS } from "../../../stores/ws.js";
import { ERRORS, TileValues } from "../../../takuzu/constants.js";
import { renderToBody, createElement, classNames } from "../../../utils/helpers.js";
import { createButtonComponent } from "../../components/button.js";
import { createButtonContentFrom, createTakuzuGridComponent } from "../../components/takuzu.js";
import { navigate, current } from "../../routes.js";

class RenderPageOnlineGame {
  /** @public */
  route = "/solo/game";

  /** @type {HTMLElement} */
  container;

  /** @type {WebSocket} */
  game_ws;

  constructor () {
    const url = new URL(window.location.href);
    const game_id = url.searchParams.get("id");

    if (!game_id) {
      navigate("/online");
      throw new Error("[RenderPageOnlineGame] Pas d'ID de partie donné.");
    }

    (async () => {
      const endpoint = "/api/games/" + game_id;

      const response = await fetch(endpoint)
      const data = await response.json();

      this.make(data);

      const url = new URL(window.location.href);
      url.pathname = endpoint;
      url.protocol = url.protocol.replace("http", "ws");
    
      this.game_ws = new WebSocket(url);

      const [ws] = useWS();
      const connection = ws();
      if (!connection) throw new Error("Pas de connexion au serveur WS établie.");

      this.game_ws.onopen = () => this.game_ws.send(`join:${connection.user.id}`);
      renderToBody(this.container);
    })();
  }

  /** @param {import("../../../takuzu/types.js").TakuzuGrid} grid */
  createTakuzuGridElement = (grid) => {
    // /** @type {NodeJS.Timer | null} */
    // let __timer = null;
    // let __timer_ms = 0;

    // const createTimer = () => {
    //   const updateEveryMS = 1000;
      
    //   __timer_ms = 0;
    //   __timer = setInterval(() => {
    //     __timer_ms += updateEveryMS;

    //     const date = new Date(0);
    //     date.setMilliseconds(__timer_ms);

    //     const formated = date.toISOString().substring(11, 19);
    //     props.timerElement.innerText = formated;
    //   }, updateEveryMS);
    // };

    const mainGrid = createElement("div", {
      class: "flex flex-col items-stretch justify-center gap-1"
    });

    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      const row = grid[rowIndex];

      const rowContainerElement = createElement("div", {
        class: "flex flex-row gap-1 h-auto justify-center"
      });

      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const value = row[columnIndex];
        
        const rowItemElement = createElement("button",
          {
            type: "button",
            class: classNames(
              "__game_grid_button",
              "flex items-center justify-center aspect-square w-full h-full min-h-[32px] min-w-[32px] p-1 sm:p-2",
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

          console.log(rowIndex, columnIndex, new_value);
          rowItemElement.innerHTML = createButtonContentFrom(new_value, true);
          rowItemElement.dataset.value = new_value;
          
          let isFull = true;
          for (const row of grid) {
            for (const column_item of row) {
              if (column_item === TileValues.EMPTY) {
                isFull = false;
                break;
              }
            }
          }
        };

        /** Permet de supprimer le contenu d'une tuile. */
        const removeContent = () => {
          console.log(rowIndex, columnIndex, TileValues.EMPTY);
          rowItemElement.dataset.value = TileValues.EMPTY;
          rowItemElement.innerHTML = "";
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

    // createTimer();
  
    return createElement("div", { class: "w-full sm:w-auto overflow-x-auto max-w-[70vh]"}, createElement("div", {
      class: "flex justify-start items-center w-full sm:h-full sm:w-auto aspect-square flex-shrink-1"
    }, mainGrid));
  }

  /**
   * @private
   * @param {{
   *   size: number,
   *   fillFactor: number,
   *   user1: { id: string, grid: import("../../../takuzu/types.js").TakuzuGrid },
   *   user2: { id: string, grid: import("../../../takuzu/types.js").TakuzuGrid },
   * }} data
   */
  make = (data) => {
    const [ws] = useWS();
    const connection = ws();
    if (connection) connection.send("status", JSON.stringify({
      online: true,
      in_game: true
    }));

    const timerElement = createElement("h2", { class: "font-medium text-xl" }, "00:00:00");

    const actionQuitElement = createButtonComponent({
      type: "button",
      color: "text",
      children: "Quitter"
    });

    actionQuitElement.onclick = () => {
      if (connection) connection.send("status", JSON.stringify({
        in_game: false,
      }));
      navigate("/online")
    }

    const userGrid = data.user1.id === connection?.user.id ? data.user1.grid : data.user2.grid;

    this.container = createElement("section", {
      class: "flex flex-col items-center justify-between gap-4 w-full min-h-screen h-full p-8"
    }, [
      timerElement,
      this.createTakuzuGridElement(userGrid),

      createElement("div", {
        class: "flex flex-col gap-3 w-full max-w-[400px] items-center justify-center"
      }, [
        createElement("div", {
          class: "w-full flex gap-2 flex-col-reverse sm:flex-row items-center justify-center"
        }, [
          actionQuitElement
        ])
      ])
    ]);
  }

  /** @public */
  update = () => void 0;

  /** @public */
  destroy = () => {
    this.container.remove();
  }
}

export default RenderPageOnlineGame;
