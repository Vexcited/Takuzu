// @ts-check

import { useWS } from "../../../stores/ws.js";
import { ERRORS, TileValues } from "../../../takuzu/constants.js";
import { renderToBody, createElement, classNames } from "../../../utils/helpers.js";
import { createButtonComponent } from "../../components/button.js";
import { createButtonContentFrom, createTakuzuGridComponent } from "../../components/takuzu.js";
import { navigate, current } from "../../routes.js";

class RenderPageOnlineGame {
  /** @public */
  route = "/online/game";

  /** @type {HTMLElement} */
  container;

  /**
   * @type {{
   *   size: number,
   *   fillFactor: number,
   *   user1: { id: string, joined: boolean, grid: import("../../../takuzu/types.js").TakuzuGrid },
   *   user2: { id: string, joined: boolean, grid: import("../../../takuzu/types.js").TakuzuGrid },
   * }}
   */
  game_data;
  /** @type {string} */
  game_id;

  /** @type {"user1" | "user2"} */
  user_index;
  /** @type {"user1" | "user2"} */
  opponent_index;

  constructor () {
    const url = new URL(window.location.href);
    const game_id = url.searchParams.get("id");

    if (!game_id) {
      navigate("/online");
      throw new Error("[RenderPageOnlineGame] Pas d'ID de partie donné.");
    }

    this.game_id = game_id;

    const [ws] = useWS();
    const connection = ws();
    if (!connection) {
      window.location.replace("/");
      throw new Error("Pas de connexion au serveur.");
    }

    (async () => {
      try {
        const endpoint = "/api/games/" + this.game_id;

        const response = await fetch(endpoint)
        const data = await response.json();
  
        this.game_data = data;
        if (this.game_data.user1.id === connection.user.id) {
          this.user_index = "user1";
          this.opponent_index = "user2";
        }
        else {
          this.user_index = "user2";
          this.opponent_index = "user1";
        }
  
        this.make();
        renderToBody(this.container);
        
        connection.connectToGame(this.game_id, this.game_connection_handler);
      }
      catch (e) {
        navigate("/online");
        throw new Error("[RenderPageOnlineGame] L'ID de partie n'as pas été trouvée.");
      }
    })();
  }

  /**
   * @private
   * @param {string} command
   * @param {string} data
   */
  game_connection_handler = (command, data) => {
    console.log("got game cmd", command, data);

    switch (command) {
      case "joined": {
        const { is } = JSON.parse(data);
        if (is === this.opponent_index) {
          this.game_data[this.opponent_index].joined = true;
        }
        else if (is === this.user_index) {
          this.game_data[this.user_index].joined = true;
        }
        
        break;
      }

      case "game_action": {
        const { is, grid_change } = JSON.parse(data);
        if (is !== this.opponent_index) break;

        const grid = this.game_data[this.opponent_index].grid;
        grid[grid_change.rowIndex][grid_change.columnIndex] = grid_change.value;

        break;
      }
    }

    this.update();
  }

  /**
   * @param {import("../../../takuzu/types.js").TakuzuGrid} grid
   * @param {"user1" | "user2"} isForUser
   * @param {(rowIndex: number, columnIndex: number, value: "1" | "0" | ".") => unknown} action
   */
  createTakuzuGridElement = (grid, isForUser, action) => {
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
              "bg-[#EFF1F5] disabled:bg-gradient-to-t disabled:from-[#7287FD] disabled:to-[#8839EF]",
              this.user_index !== isForUser && "cursor-default"
            ),

            "data-row-index": rowIndex.toString(),
            "data-column-index": columnIndex.toString(), 
            "data-value": value,
            disabled: (value !== TileValues.EMPTY) ? "true" : undefined
          }
        );

        rowItemElement.innerHTML = value === TileValues.EMPTY ? "" : createButtonContentFrom(value);

        const updateContent = () => {
          if (this.user_index !== isForUser) return;

          const old_value = rowItemElement.dataset.value;
          const new_value = (old_value === TileValues.ZERO) ? TileValues.ONE : TileValues.ZERO;

          action(rowIndex, columnIndex, new_value);
          rowItemElement.innerHTML = createButtonContentFrom(new_value, true);
          rowItemElement.dataset.value = new_value;
        };

        /** Permet de supprimer le contenu d'une tuile. */
        const removeContent = () => {
          if (this.user_index !== isForUser) return;

          action(rowIndex, columnIndex, TileValues.EMPTY);
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
  
    return createElement("div", { id: "__grid_for_" + isForUser, class: "w-full sm:w-auto overflow-x-auto max-w-[70vh]"}, createElement("div", {
      class: "flex justify-start items-center w-full sm:h-full sm:w-auto aspect-square flex-shrink-1"
    }, mainGrid));
  }

  /**
   * @private
   */
  make = () => {
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

    this.container = createElement("section", {
      class: "flex flex-col items-center justify-between gap-4 w-full min-h-screen h-full p-8"
    }, [
      timerElement,
      createElement("div", {
        class: "flex gap-8"
      }, [
        this.createTakuzuGridElement(this.game_data[this.user_index].grid, this.user_index, (rowIndex, columnIndex, value) => {
          connection?.send("game_action", JSON.stringify({
            game_id: this.game_id,
            columnIndex,
            rowIndex,
            value
          }))
        }),
        this.createTakuzuGridElement(this.game_data[this.opponent_index].grid, this.opponent_index, () => void 0),
      ]),

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
  update = () => {
    // On met à jour uniquement la grille de l'opposant.
    // La notre est normalement déjà à jour avec celle du serveur.

    const opponent_grid_element = document.getElementById(`__grid_for_${this.opponent_index}`);
    const opponent_grid = this.game_data[this.opponent_index].grid;

    opponent_grid_element?.children[0].children[0].childNodes.forEach((rowElement) => {
      rowElement.childNodes.forEach((columnElement) => {
        const element = /** @type {HTMLButtonElement} */ (columnElement);
        const value = element.dataset.value;

        const rowIndex = /** @type {string} */ (element.dataset.rowIndex);
        const columnIndex = /** @type {string} */ (element.dataset.columnIndex);

        const valueInGrid = opponent_grid[parseInt(rowIndex)][parseInt(columnIndex)];
        if (value === valueInGrid) return;
        
        if (valueInGrid === TileValues.EMPTY) element.innerHTML = "";
        else element.innerHTML = createButtonContentFrom(valueInGrid, true);
        
        element.dataset.value = valueInGrid;
      })
    })

    for (let rowIndex = 0; rowIndex < opponent_grid.length; rowIndex++) {
      const row = opponent_grid[rowIndex];

      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const value = row[columnIndex];
        this.container.querySelector("button")
      }
    }
  };

  /** @public */
  destroy = () => {
    this.container && this.container.remove();
  }
}

export default RenderPageOnlineGame;
