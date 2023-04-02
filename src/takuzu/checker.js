import { TileValues, ERRORS } from "./constants.js";
import { countSubstrInStr } from "../utils/helpers.js";

/**
 * Permet de vérifier l'entièreté de la grille
 * sur l'ensemble des règles définies.
 * 
 * @param {string[][]} grid 
 * @returns {import("./types").TakuzuCheckResult}
 */
export const checkFullGrid = (grid) => {
  /** @type {string[]} */
  const rows = [];
  /** @type {string[]} */
  const columns = [];

  // On transforme les lignes et colonnes en `string`s.
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i].join("");
    let column = "";
    
    for (let j = 0; j < grid.length; j++) {
      column += grid[j][i];
    }

    rows.push(row);
    columns.push(column);
  }

  // Règle 3: On vérifie que 2 lignes ne peuvent être identiques.
  const duplicated_rows = checkDuplication(rows, "row");
  if (duplicated_rows.length > 0) {
    return createCheckerError("duplicate", ERRORS.DUPLICATION, duplicated_rows);
  }
  
  // Règle 3: On vérifie que 2 colonnes ne peuvent être identiques.
  const duplicated_columns = checkDuplication(columns, "col");
  if (duplicated_columns.length > 0) {
    return createCheckerError("duplicate", ERRORS.DUPLICATION, duplicated_columns);
  }

  // On vérifie la règle 1 et 2 sur les colonnes.
  for (let i = 0; i < columns.length; i++) {
    const isNotTripled = checkNotTriple(columns[i]);
    if (!isNotTripled) return createCheckerError("triple", ERRORS.RIPLE_ERROR, [`col-${i}`]);
    
    const isBalanced = checkBalance(columns[i]);
    if (!isBalanced) return createCheckerError("balance", ERRORS.BALANCE_ERROR, [`col-${i}`]);
  }

  // On vérifie la règle 1 et 2 sur les rangées.
  for (let i = 0; i < rows.length; i++) {
    const isNotTripled = checkNotTriple(rows[i]);
    if (!isNotTripled) return createCheckerError("triple", ERRORS.TRIPLE_ERROR, [`row-${i}`]);

    const isBalanced = checkBalance(rows[i]);
    if (!isBalanced) return createCheckerError("balance", ERRORS.BALANCE_ERROR, [`row-${i}`]);
  }

  // Aucune erreur !
  return { error: false };
}

/**
 * Permet de vérifier la règle 1:
 * autant de 1 que de 0 sur chaque ligne et sur chaque colonne.
 * 
 * @param {string} line - La ligne/colonne à vérifier.
 * @returns {boolean} `true` si la règle est validée.
 */
const checkBalance = (line) => {
  // On compte les occurrences de 0 et 1 sur la ligne, `line`.
  const zeros = countSubstrInStr(line, TileValues.ZERO);
  const ones = countSubstrInStr(line, TileValues.ONE);
  
  // S'il y a autant de 0 que de 1, la règle est validée.
  const balanced = zeros === ones;
  return balanced;
};

/**
 * Permet de vérifier la règle 2:
 * pas plus de 2 chiffres identiques côte à côte.
 * 
 * @param {string} line - La ligne/colonne à vérifier. 
 * @returns {boolean} `true` si la règle est validée.
 */
const checkNotTriple = (line) => {
  // On vérifie s'il existe au moins une occurence de 3x"0".
  const zeroes_tripled = line.includes(TileValues.ZERO.repeat(3));
  // On vérifie s'il existe au moins une occurence de 3x"1".
  const ones_tripled = line.includes(TileValues.ONE.repeat(3));

  // Si l'une des deux conditions est vraie, alors la règle n'est pas vérifiée.
  const tripled = zeroes_tripled || ones_tripled;
  return !tripled;
};

/**
 * Permet de vérifier la règle 3:
 * 2 lignes ou 2 colonnes ne peuvent être identiques.
 * 
 * @param {string[]} lines 
 * @param {"row" | "col"} type 
 * 
 * @returns {string[]} Contient un array de position quand on a au moins 1 erreur.
 */
const checkDuplication = (lines, type) => {
  /** @type {string[]} */
  let position = [];

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[i] === lines[j]) {
        position.push(`${type}-${i}`, `${type}-${j}`);
      }
    }

    if (position.length) break;
  }

  return position;
};

/**
 * Crée un objet d'erreur.
 * 
 * @param {import("./types").TakuzuCheckErrorType} type 
 * @param {string} message 
 * @param {string[]} position 
 * 
 * @returns {import("./types").TakuzuCheckResult}
 */
const createCheckerError = (type, message, position) => ({
  error: true,
  type,
  message,
  position
});