// @ts-check

import { createElement, renderToBody } from "../../utils/helpers.js";
import { createButtonComponent } from "../components/button.js";
import { navigate } from "../routes.js";

const createExternalLinkComponent = ({ content = "", href = "" }) => createElement("a", {
  class: "text-[#7287fd] border-b border-dotted hover:border-solid border-[#7287fd]",
  target: "_blank",
  href
}, content);

class RenderPageHome {
  /** @public */
  route = "/";
  
  /** @type {HTMLElement} */
  container;

  constructor () {
    this.make();
    this.update();

    renderToBody(this.container);
  }

  /** @private */
  make = () => {
    const play_solo_button = createButtonComponent({
      children: "Jouer en solo",
      color: "text"
    });

    play_solo_button.onclick = () => navigate("/solo");

    const play_multiplayer_button = createButtonComponent({
      children: "Jouer contre un adversaire!",
      color: "primary"
    });

    play_multiplayer_button.onclick = () => navigate("/online");

    this.container = createElement("section", {
      class: "flex flex-col h-screen justify-between gap-4 p-4",
    }, [
      createElement("div", {
        class: "flex flex-col items-center justify-center gap-8 h-full",
      }, [
        createElement("header", {
          class: "flex flex-col gap-2 items-center",
        }, [
          createElement("h1", {
            class: "font-medium text-3xl",
          }, "Takuzu"),
          createElement("p", {
            class: "font-normal text-md text-center",
          }, [
              "Implémentation du jeu de réflexion ",
              createExternalLinkComponent({
                href: "https://fr.wikipedia.org/wiki/Takuzu",
                content: "Takuzu, aussi connu sous le nom de Binairo"
              }),
              "."
            ]
          )
        ]),

        createElement("main", {
          class: "flex flex-col items-center gap-8"
        }, [
          createElement("div", {
            class: "flex flex-col gap-2 w-full max-w-[250px]",
          }, [
            play_solo_button,
            createElement("p", {
              class: "border-[#4C4F69] opacity-50 text-center",
            }, "ou..."),
            play_multiplayer_button
          ]),

          createElement("div", {
            class: "flex flex-col gap-2 p-2 text-center"
          }, [
            createElement("h2", { class: "font-medium text-xl" }, "Règles"),

            createElement("p", {}, "- Autant de 1 que de 0 sur chaque ligne et sur chaque colonne."),
            createElement("p", {}, "- 2 lignes ou 2 colonnes ne peuvent être identiques."),
            createElement("p", {}, "- Pas plus de 2 tuiles identiques côte à côte.")
          ])
        ])
      ]),
      createElement("footer", {
        class: "p-4 flex-shrink-0 flex-col justify-center text-center",
      }, [
        createElement("p", {
          class: "font-medium text-md mb-2",
        }, [
          "Projet réalisé pour les ",
          createExternalLinkComponent({
            href: "https://trophees-nsi.fr/",
            content: "Trophées NSI"
          }),
          " 2023."
        ]),

        createExternalLinkComponent({
          href: "https://github.com/Vexcited/takuzu",
          content: "Voir le code source"
        })
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

export default RenderPageHome;
