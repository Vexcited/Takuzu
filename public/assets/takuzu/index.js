// @ts-check

import { OUT_OF_RANGE } from "./constants.js";
import { generateGrid, prepareGrid } from "./generator.js";
import { checkFullGrid } from "./checker.js";

class Takuzu {
  /** @param {number} size - La taille de la grille de Takuzu. */
  constructor(size) {
    this.size = size;
  }

  /**
   * La taille de la grille générée.
   * @readonly
   * @type {number}
   */
  size;
  
  /**
   * La grille générée, complète.
   * @public
   * @type {import("./types").TakuzuGrid}
   */
  grid;

  /**
   * L'état actuel de la grille, sur laquelle on va jouer.
   * @public
   * @type {import("./types").TakuzuGrid}
   */
  task;
  
  /**
   * @public
   * @type {string[]}
   */
  cache = [];

  /**
   * Génère une grille de jeu.
   * 
   * @public
   */
  generate () {
    /** @type {import("./types").TakuzuGrid | null | undefined} */
    let grid;
    
    /** @type {import("./types").TakuzuCheckResult | undefined} */
    let check_result;

    while (!grid || (check_result && check_result.error)) {
      grid = generateGrid(this.size);
      if (grid) check_result = checkFullGrid(grid);
    }

    this.grid = grid;
    return grid;
  }

  /**
   * Prépare la grille à être jouable
   * en inserant des trous dans la grille, en fonction de `fillFactor`.
   * 
   * @public
   */
  prepare (fillFactor = 0.4) {
    // Si la grille n'a pas été générée, on le fait avant de préparer la grille.
    if (!this.grid) this.generate();
    this.task = prepareGrid(this.grid, fillFactor);
  }

  /**
   * Effectue un changement dans la grille en cours
   * d'utilisation.
   * 
   * Lors d'un changement, on va garder ce changement en cache
   * pour des fonctionnalités tel que le "undo".
   * 
   * @public
   * @param {number} row
   * @param {number} column
   * @param {import("./constants").TileValues} value
   */
  change = (row, column, value) => {
    if (row >= this.size || row < 0) throw new Error(OUT_OF_RANGE("row"));
    if (column >= this.size || column < 0) throw new Error(OUT_OF_RANGE("column"));

    this.caching(row, column);
    this.task[row][column] = value;
  };

  /**
   * @private
   * @param {number} row
   * @param {number} column
   */
  caching = (row, column) => {
    if (this.cache.length >= 100) this.cache = this.cache.slice(1, 100);
    this.cache.push(`${row}-${column}-${this.task[row][column]}`);
  };

  /** @public */
  undo = () => {
    if (!this.cache.length) return;
    const prevStep = this.cache[this.cache.length - 1].split("-");
    this.task[+prevStep[0]][+prevStep[1]] = /** @type {import("./types").TakuzuGrid[number][number]} */ (
      prevStep[2]
    );
    
    this.cache.pop();
  };

  /**
   * Permet de vérifier la grille.
   * 
   * @public
   * @returns {import("./types").TakuzuCheckResult}
   */
  check = () => checkFullGrid(this.task);
}

export default Takuzu;
