import RenderPageHome from "./pages/index.js";
import RenderPageOnline from "./pages/online.js";

/** @type {InstanceType<router[keyof router]>} */
export let current = null;

/** Permet d'initialiser le router. */
export const initialize = () => {
  const route = window.location.pathname.trim();
  current = router[route] ? new router[route]() : null;

  // On redirige sur la page d'accueil pour les erreurs 404.
  if (current === null) navigate("/");
}

/**
 * Permet de naviguer vers une nouvelle route.
 * @param {keyof typeof router} route
 */
export const navigate = (route) => {
  current.destroy();

  window.history.pushState({}, "", route);
  current = new router[route]();
}

const router = /** @type {const} */ ({
  "/": RenderPageHome,
  "/online": RenderPageOnline
});
