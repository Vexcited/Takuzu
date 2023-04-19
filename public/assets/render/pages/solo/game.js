// @ts-check

import { useWS } from "../../../stores/ws.js";
import { renderToBody, createElement } from "../../../utils/helpers.js";
import { createButtonComponent } from "../../components/button.js";
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

    console.log(state);

    this.container = createElement("div");
  }

  /** @public */
  update = () => void 0;

  /** @public */
  destroy = () => {
    this.container.remove();
  }
}

export default RenderPageSoloGame;
