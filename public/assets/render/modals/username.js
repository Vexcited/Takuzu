// @ts-check

import { Connection } from "../../utils/websocket.js";
import { useWS } from "../../stores/ws.js";

import * as router from "../../render/routes.js";
import { createElement, renderToBody } from "../../utils/helpers.js";
import { createButtonComponent } from "../components/button.js";

class RenderUsernameSelectionModal {
  /**
   * @private
   * @type {HTMLElement}
   */
  built_element;

  /**
   * @private
   * @type {HTMLElement}
   */
  current_element;

  constructor () {
    this.built_element = this.build();
  }

  /** @private */
  build = () => {
    const form_input = /** @type {HTMLInputElement} */ (
      createElement("input", {
        required: true,
        type: "text",
        placeholder: "ProTakuzuPlayerDu87",
        class: "outline-none px-4 py-2 bg-[#dce0e8] bg-opacity-60 text-center",
        autocomplete: "off"
      })
    );

    const form = createElement("form", {
      class: "flex flex-col gap-2 mt-4",
      children: [
        form_input,
        createButtonComponent({
          type: "submit",
          color: "primary",
          content: "C'est parti !"
        })
      ]
    });

    form.onsubmit = async (event) => {
      event.preventDefault();
      const [, setWS] = useWS();
  
      const username = form_input.value.trim();

      if (!username) {
        alert("Vous devez entrer un nom d'utilisateur !");
        return;
      }
    
      const ws = await Connection.create(username);
      setWS(ws);
  
      this.destroy();
      router.initialize();
    }

    const node = createElement("div", {
      class: "z-[999] fixed inset-0 bg-[#9ca0b0] bg-opacity-70 flex justify-center items-center p-4",
      children: createElement("div", {
        class: "max-w-[400px] w-full p-6 bg-[#eff1f5] rounded-md text-center flex flex-col gap-1",
        children: [
          createElement("h2", {
            class: "text-2xl font-medium",
            children: "Choisissez un nom d'utilisateur !"
          }),
          createElement("p", {
            class: "text-sm opacity-80 text-[#5c5f77]",
            children: "Ce nom d'utilisateur sera affiché pour les autres utilisateurs dans le mode en ligne et dans vos scores en mode solo."
          }),
          
          form
        ]
      })
    });

    return node;
  }

  /** @public */
  create = () => {
    this.current_element = renderToBody(this.built_element);
  }

  /** @public */
  destroy = () => {
    this.current_element.remove();
  }
}

const modal = new RenderUsernameSelectionModal();
export const useUsernameSelectionModal = () => [modal.create, modal.destroy];
