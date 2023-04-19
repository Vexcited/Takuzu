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
    // Si on a déjà été connecté avant, on prend le nom d'utilisateur sauvegardé.
    let saved_username = localStorage.getItem("username");
    saved_username = saved_username ? saved_username.trim() : null;

    /** @param {string} username  */
    const connect = async (username) => {
      form_button.innerHTML = "Connexion...";
      form_input.setAttribute("disabled", "true");

      if (!username) {
        alert("Vous devez entrer un nom d'utilisateur !");
        form_input.removeAttribute("disabled");
        form_button.innerHTML = "C'est parti !";
        return;
      }
      
      const ws = await Connection.create(username);
      const [, setWS] = useWS();
      setWS(ws);
  
      this.destroy();

      localStorage.setItem("username", username);
      router.initialize();
    }

    const form_input = createElement("input", {
      required: "true",
      type: "text",
      placeholder: "ProTakuzuPlayerDu87",
      class: "outline-none px-4 py-2 bg-[#dce0e8] bg-opacity-60 text-center",
      autocomplete: "off",
      value: saved_username ?? "",
      disabled: saved_username ? "true" : undefined
    });

    const form_button = createButtonComponent({
      type: "submit",
      color: "primary",
      children: "C'est parti !"
    })

    const form = createElement("form", {
      class: "flex flex-col gap-2 mt-4"
    }, [
      form_input,
      form_button
    ]);

    // Si on a déjà un nom d'utilisateur sauvegardé on se connecte automatiquement avec celui-là.
    if (saved_username) connect(saved_username);
    
    form.onsubmit = async (event) => {
      event.preventDefault();

      const username = form_input.value.trim();
      await connect(username);
    }

    const node = createElement(
      "div",
      { class: "z-[999] fixed inset-0 bg-[#9ca0b0] bg-opacity-70 flex justify-center items-center p-4" },
      createElement(
        "div",
        { class: "max-w-[400px] w-full p-6 bg-[#eff1f5] rounded-md text-center flex flex-col gap-1" },
        [
          createElement(
            "h2",
            { class: "text-2xl font-medium" },
            "Choisissez un nom d'utilisateur !"
          ),
          createElement(
            "p",
            { class: "text-sm opacity-80 text-[#5c5f77]" },
            "Ce nom d'utilisateur sera affiché pour les autres utilisateurs dans le mode en ligne et dans vos scores en mode solo."
          ),
          form
        ]
      )
    );

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
