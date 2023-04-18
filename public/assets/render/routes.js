export const ROUTES_ID = {
  "/": "__route_/",
  "/game": "__route_/game",
  "/online": "__route_/online"
};

/** @type {keyof typeof ROUTES_ID} */
export let currentRoute = "/";

/** @param {keyof typeof ROUTES_ID} id */
export const selectActiveRoute = (id) => {
  const active = document.getElementById(ROUTES_ID[id]);
  active.classList.remove("hidden");
  
  for (const route_id_key in ROUTES_ID) {
    if (id === route_id_key) continue;
    
    const route = document.getElementById(ROUTES_ID[route_id_key]);
    route.classList.add("hidden");
  }

  currentRoute = id;
}