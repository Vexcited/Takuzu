// @ts-check

import { useWS } from "../../../stores/ws.js";
import { ERRORS } from "../../../takuzu/constants.js";
import { renderToBody, createElement } from "../../../utils/helpers.js";
import { createButtonComponent } from "../../components/button.js";
import { createTakuzuGridComponent } from "../../components/takuzu.js";
import { navigate, current } from "../../routes.js";

class RenderPageSoloGame {
  /** @public */
  route = "/solo/game";

  /** @type {HTMLElement} */
  container;

  constructor () {
    this.make();
    this.update();

    renderToBody(this.container);
  }

  /** @private */
  make = () => {
    const state = window.history.state;
    if (!state || !("size" in state) || !("fillFactor" in state)) {
      navigate("/solo");
      throw new Error("[RenderPageSoloGame] Pas de state ou `size` et/ou `fillFactor` manquant/s dans le state.");
    }

    const [ws] = useWS();
    const connection = ws();
    if (connection) connection.send("status", JSON.stringify({
      online: false,
      in_game: true,

      mode: "zen",
      size: state.size,
      fillFactor: state.fillFactor
    }));

    const hintsElement = createElement("p", { class: "text-center"}, ERRORS.FILL_GRID_FIRST);
    const timerElement = createElement("h2", { class: "font-medium text-xl" }, "00:00:00");

    this.container = createElement("section", {
      class: "flex flex-col items-center justify-between gap-4 w-full min-h-screen h-full p-8"
    }, [
      timerElement,
      createTakuzuGridComponent({
        size: state.size,
        fillFactor: state.fillFactor,
        hintsElement,
        timerElement
      }),

      createElement("div", {
        class: "flex flex-col gap-3 w-full max-w-[600px] items-center justify-center"
      }, [
        hintsElement,

        createElement("div", {
          class: "w-full flex gap-2 flex-col-reverse sm:flex-row items-center justify-center"
        }, [
          createButtonComponent({
            type: "button",
            color: "text",
            children: "Quitter"
          }),
          createButtonComponent({
            type: "button",
            color: "primary",
            children: "Nouvelle grille"
          })
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

export default RenderPageSoloGame;
