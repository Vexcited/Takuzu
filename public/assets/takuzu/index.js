import { ERRORS, OUT_OF_RANGE } from "./constants.js";
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
   * @type {string[][]}
   */
  grid;

  /**
   * L'état actuel de la grille, sur laquelle on va jouer.
   * @public
   * @type {string[][]}
   */
  task;
  
  /**
   * @public
   * @type {string[]}
   */
  cache = [];

  /** @public */
  generate () {
    /** @type {string[][] | null | undefined} */
    let grid;
    
    /** @type {import("./types").TakuzuCheckResult | undefined} */
    let check_result;

    while (!grid || (check_result && check_result.error)) {
      grid = generateGrid(this.size);
      if (grid) check_result = checkFullGrid(grid);
    }

    this.grid = grid;
  }

  /** @public */
  prepare (fillFactor = 0.33) {
    if (!this.grid) throw new Error(ERRORS.GRID_NOT_GENERATED);
    if (fillFactor > 1 || fillFactor < 0.2) throw new Error(ERRORS.INVALID_FILL_FACTOR);

    this.task = prepareGrid(this.grid, fillFactor);
  }

  /**
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
    this.task[+prevStep[0]][+prevStep[1]] = prevStep[2];
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
