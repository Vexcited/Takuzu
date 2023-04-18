/**
 * La connexion au serveur WebSocket.
 * `null` si la connexion n'est pas encore établie.
 * 
 * @type {Connection | null}
 */
let ws = null;
/** @param {Connection | null} */
let setWS = (value) => (ws = value); 

export const useWS = () => [ws, setWS];
