// @ts-check

/**
 * La connexion au serveur WebSocket.
 * `null` si la connexion n'est pas encore établie.
 * 
 * @type {import("../utils/websocket").Connection | null}
 */
let ws = null;
/** @param {import("../utils/websocket").Connection | null} value */
const setWS = (value) => (ws = value); 

export const useWS = () => /** @type {const} */ ([() => ws, setWS]);
