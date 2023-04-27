// @ts-check

import { useWS } from "../../../stores/ws.js";
import { renderToBody, createElement, classNames } from "../../../utils/helpers.js";
import { createButtonComponent } from "../../components/button.js";
import { navigate } from "../../routes.js";

import { useSoloStartZenGameModal } from "../../modals/soloStartZenGame.js";

/**
 * @param {Object} props
 * @param {string} props.title 
 * @param {string} props.description
 * @param {string} props.highscore
 * @param {() => unknown} props.action 
 * @param {"text" | "primary"} props.color 
 */
const createModeButtonComponent = (props) => {
  const mode_informations = createElement("div", {
    class: "flex flex-col text-left pr-2",
  }, [
    createElement("h2", { class: "text-xl font-medium" }, props.title),
    createElement("p", { class: "text-base font-normal" }, props.description),
  ]);

  const mode_personal_highscore = createElement("div", {
    class: classNames(
      "flex-shrink-0 flex flex-col group-hover:border-[#EFF1F5] pl-2",
      props.color === "text" && "border-[#4C4F69]",
      props.color === "primary" && "border-[#7287fd]"
    )
  }, [
    createElement("h4", { class: "text-sm"}, "Record perso."),
    createElement("p", { class: "text-base font-medium"}, props.highscore)
  ])

  const button = createButtonComponent({
    children: createElement("div", {
      class: "flex justify-between divide-x-2 items-center"
    }, [
      mode_informations,
      mode_personal_highscore
    ]),
    color: props.color,
    type: "button"
  });

  button.onclick = props.action;
  return button;
}

class RenderPageSolo {
  /** @public */
  route = "/solo";

  /** @type {HTMLElement} */
  container;

  constructor () {
    this.make();
    this.update();

    renderToBody(this.container);
  }

  /** @private */
  make = () => {
    const [openZenGameConfig] = useSoloStartZenGameModal()
    const [ws] = useWS();

    this.online_users_list = createElement("div", {
      class: "flex flex-col gap-4"
    });

    const go_home_button = createButtonComponent({
      children: "Revenir à la page d'accueil",
      color: "text",
      type: "button"
    });

    go_home_button.onclick = () => {
      // On change l'interface.
      navigate("/");
    };

    const connected_as_button = createButtonComponent({
      color: "text",
      maxWidth: "350px",
      children: `Connecté en tant que ${ws()?.user.name}`
    });

    connected_as_button.onclick = () => {
      localStorage.removeItem("username");
      window.location.reload();
    }

    this.container = createElement("section", {
      class: "flex flex-col items-center justify-between gap-8 w-full min-h-screen h-full p-8",
    }, [
      createElement("div", {
        class: "flex flex-col gap-2 text-center w-full"
      }, [
        createElement("h1", {
          class: "text-3xl font-medium",
        }, "Takuzu en solo"),
        connected_as_button
      ]),
      createElement("div", {
        class: "flex flex-col gap-2 max-w-[450px] w-full"
      }, [
        createModeButtonComponent({
          title: "Zen",
          color: "text",
          description: "Complétez autant de grilles que vous voulez sans limite de temps.",
          highscore: "/",
          action: openZenGameConfig
        }),
        createModeButtonComponent({
          title: "Blitz",
          color: "primary",
          description: "Complétez autant de grilles que vous pouvez en moins de 2 minutes!",
          highscore: "69",
          action: () => void 0
        }),
        createModeButtonComponent({
          title: "Gridz",
          color: "primary",
          description: "Complétez un certain nombre de grilles le plus rapidement possible!",
          highscore: "23s",
          action: () => void 0
        })
      ]),
      createElement("div", { class: "w-full max-w-[600px]" }, go_home_button)
    ]);
  }

  /** @public */
  update = () => void 0;

  /** @public */
  destroy = () => {
    this.container.remove();
  }
}

export default RenderPageSolo;
