// @ts-check

import { useWS } from "../../stores/ws.js";
import { createElement, renderToBody } from "../../utils/helpers.js";
import { createButtonComponent } from "../components/button.js";
import { navigate } from "../routes.js";

class RenderOnlineConfigGameModal {
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

  /**
   * Le joueur sur lequel l'utilisateur à cliqué.
   * 
   * @private
   * @type {string}
   */
  user_id;

  /**
   * @private
   * @type {HTMLElement}
   */
  userTitleElement;

  constructor () {
    this.built_element = this.build();
  }

  /** @private */
  build = () => {
    this.userTitleElement = createElement(
      "h2", { class: "text-2xl font-medium w-full truncate" }
    );

    const form_size_input = createElement("input", {
      class: "outline-none border border-[#4C4F69] text-[#4C4F69] p-2 bg-[#dce0e8] bg-opacity-60 text-center w-[92px] appearance-none",
      required: "true",
      type: "text",
      pattern: "[0-9]*",
      inputmode: "numeric",
      placeholder: "4",
      value: "4",
      autocomplete: "off",
      disabled: "true"
    });

    let size_value = 4;
    let fill_factor_value = 0.5;

    const form_fill_factor_input = createElement("input", {
      type: "range",
      required: "true",
      step: "0.01",
      min: "0.2",
      max: "0.8",
      value: "0.5",
      autocomplete: "off",
      class: "w-full"
    });

    form_fill_factor_input.oninput = () => {
      const value = parseFloat(form_fill_factor_input.value);
      fill_factor_value = value;
      updateFillFactorText()
    }

    const form_fill_factor_text = createElement("p", {});

    const updateFillFactorText = () => {
      const total = size_value ** 2;
      const output = `${Math.round(fill_factor_value * 100)}% donc ${Math.floor(total * fill_factor_value)}/${total} tuiles remplies.`;
      form_fill_factor_text.innerText = output;
    }; updateFillFactorText();

    const form_size_add = createButtonComponent({
      children: "+",
      color: "text",
      type: "button"
    });

    form_size_add.onclick = () => {
      // On limite à 12x12 pour le maximum - à cause du temps de génération.
      if (size_value === 12) return;
      size_value += 2;
      
      form_size_input.value = size_value + "";
      updateFillFactorText();
    }

    const form_size_remove = createButtonComponent({
      children: "-",
      color: "text",
      type: "button"
    });

    form_size_remove.onclick = () => {
      // On limite à 4x4 pour le minimum.
      if (size_value === 4) return;
      size_value -= 2;

      form_size_input.value = size_value + "";
      updateFillFactorText();
    }

    const form_start_button = createButtonComponent({
      type: "submit",
      color: "primary",
      children: "Commencer !"
    });

    const form_cancel_button = createButtonComponent({
      type: "button",
      color: "text",
      children: "Annuler"
    });

    form_cancel_button.onclick = () => this.destroy();

    const form = createElement("form", {
      class: "flex flex-col items-center gap-2 mt-4"
    }, [
      createElement("h3", {
        class: "text-md font-medium mt-4"
      }, "Taille"),

      createElement("div", {
        class: "flex gap-1 items-center"
      }, [
        form_size_remove,
        form_size_input,
        form_size_add
      ]),

      createElement("h3", {
        class: "text-md font-medium mt-4",
      }, "Remplissage"),

      form_fill_factor_input,
      
      form_fill_factor_text,

      createElement("div", {
        class: "mt-8 flex flex-col sm:flex-row gap-2 w-full"
      }, [
        form_cancel_button,
        form_start_button
      ])
    ]);

    form.onsubmit = async (event) => {
      event.preventDefault();
      
      const [ws] = useWS();
      const connection = ws();
      if (!connection) return;
      
      const game_id = await connection.sendAndWait("invite", JSON.stringify({
        user_invited_id: this.user_id,
        game_config: {
          size: size_value,
          fillFactor: fill_factor_value
        }
      }));

      navigate("/online/game", {}, { id: game_id });
      this.destroy();
    }

    const modal_content = createElement(
      "div",
      { class: "max-w-[400px] w-full p-6 bg-[#eff1f5] rounded-md text-center flex flex-col gap-1" },
      [
        this.userTitleElement,
        createElement(
          "p",
          { class: "text-sm opacity-80 text-[#5c5f77]" },
          "Configurez votre duel de Takuzu."
        ),
        form
      ]
    );

    const node = createElement(
      "div",
      { class: "z-[999] fixed inset-0 bg-[#9ca0b0] bg-opacity-70 flex justify-center items-center p-4" },
      modal_content
    );

    node.onclick = (event) => {
      if (!event.target) return;
      if (!(event.target instanceof Element)) return;
      if (modal_content.contains(event.target)) return;

      // On ferme le modal si on clique en dehors.
      this.destroy();
    }

    return node;
  }

  /**
   * @public
   * @param {string} user_id
  */
  create = (user_id) => {
    const [ws] = useWS();
    const connection = ws();
    if (!connection) return;

    this.user_id = user_id;
    this.userTitleElement.innerHTML = connection.onlineUsers[this.user_id].name;

    this.current_element = renderToBody(this.built_element);
  }

  /** @public */
  destroy = () => {
    this.current_element.remove();
  }
}

const modal = new RenderOnlineConfigGameModal();
export const useOnlineConfigGameModal = () => [modal.create, modal.destroy];
