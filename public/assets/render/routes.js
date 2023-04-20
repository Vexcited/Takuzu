import RenderPageHome from "./pages/index.js";
import RenderPageSolo from "./pages/solo/index.js";
import RenderPageSoloGame from "./pages/solo/game.js";
import RenderPageOnline from "./pages/online/index.js";
import RenderPageOnlineGame from "./pages/online/game.js";

/** @type {InstanceType<router[keyof router]>} */
export let current = null;

/** Permet d'initialiser le router. */
export const initialize = () => {
  let route = window.location.pathname.trim();
  route = route.endsWith('/') ? route.substring(0, route.length - 1) : route;

  current = router[route] ? new router[route]() : null;

  // On redirige sur la page d'accueil pour les erreurs 404.
  if (current === null) navigate("/");
}

/**
 * Permet de naviguer vers une nouvelle route.
 * @param {keyof typeof router} route
 * @param {Record<string, string | number>} [state]
 * @param {Record<string, string>} [params]
 */
export const navigate = (route, state = {}, params = {}) => {
  if (current) current.destroy();

  const url = new URL(window.location.protocol + "//" + window.location.host);
  url.pathname = route;

  for (const key in params) {
    if (!params.hasOwnProperty(key)) continue;
    url.searchParams.set(key, params[key]);
  }

  window.history.pushState(state, "", url);
  current = new router[route]();
}

const router = /** @type {const} */ ({
  "/": RenderPageHome,
  "/solo": RenderPageSolo,
  "/solo/game": RenderPageSoloGame,
  "/online": RenderPageOnline,
  "/online/game": RenderPageOnlineGame
});
