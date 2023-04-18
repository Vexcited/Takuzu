// @ts-check

import { createElement, renderToBody } from "../../utils/helpers.js";
import { createButtonComponent } from "../components/button.js";
import { navigate } from "../routes.js";

const createExternalLinkComponent = ({ children = "", href = "" }) => createElement("a", {
  class: "text-[#7287fd] border-b border-dotted hover:border-solid border-[#7287fd]",
  target: "_blank",
  href, children
});

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
      content: "Jouer en solo",
      color: "text"
    });

    const play_multiplayer_button = createButtonComponent({
      content: "Jouer contre un adversaire!",
      color: "primary"
    });

    play_multiplayer_button.onclick = () => navigate("/online");

    this.container = createElement("section", {
      class: "flex flex-col h-screen justify-between gap-4 p-4",
      children: [
        createElement("div", {
          class: "flex flex-col items-center justify-center gap-8 h-full",
          children: [
            createElement("header", {
              class: "flex flex-col gap-2 items-center",
              children: [
                createElement("h1", {
                  class: "font-medium text-3xl",
                  children: "Takuzu"
                }),
                createElement("p", {
                  class: "font-normal text-md text-center",
                  children: [
                    "Implémentation du jeu de réflexion ",
                    createExternalLinkComponent({
                      href: "https://fr.wikipedia.org/wiki/Takuzu",
                      children: "Takuzu, aussi connu sous le nom de Binairo"
                    }),
                    "."
                  ]
                })
              ]
            }),

            createElement("main", {
              class: "flex flex-col items-center gap-8",
              children: [
                createElement("div", {
                  class: "flex flex-col gap-2 w-full max-w-[250px]",
                  children: [
                    play_solo_button,
                    createElement("p", {
                      class: "border-[#4C4F69] opacity-50 text-center",
                      children: "ou..."
                    }),
                    play_multiplayer_button
                  ]
                }),

                createElement("div", {
                  class: "flex flex-col gap-2 p-2 text-center",
                  children: [
                    createElement("h2", {
                      class: "font-medium text-xl",
                      children: "Règles"
                    }),

                    createElement("p", {
                      children: "- Autant de 1 que de 0 sur chaque ligne et sur chaque colonne."
                    }),
                    createElement("p", {
                      children: "- 2 lignes ou 2 colonnes ne peuvent être identiques."
                    }),
                    createElement("p", {
                      children: "- Pas plus de 2 tuiles identiques côte à côte."
                    })
                  ]
                })
              ]
            })
          ]
        }),
        createElement("footer", {
          class: "p-4 flex-shrink-0 flex-col justify-center text-center",
          children: [
            createElement("p", {
              class: "font-medium text-md mb-2",
              children: [
                "Projet réalisé pour les ",
                createExternalLinkComponent({
                  href: "https://trophees-nsi.fr/",
                  children: "Trophées NSI"
                }),
                " 2023."
              ]
            }),

            createExternalLinkComponent({
              href: "https://github.com/Vexcited/takuzu",
              children: "Voir le code source"
            })
          ]
        })
      ]
    });
  }

  /** @public */
  update = () => void 0;

  /** @public */
  destroy = () => {
    this.container.remove();
  }
}

export default RenderPageHome;
