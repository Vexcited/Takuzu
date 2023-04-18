// @ts-check

import { TileValues } from "./constants.js";

import {
  arrayFromLength,
  countSubstrInStr,
  takeRandomIndexFromArray,
  getRandomNumber,
} from "../utils/helpers.js";

/** @param {string[]} grid */
const splitGridIntoTiles = (grid) => {
  /** @type {string[][]} */  
  const splitted_grid = [];
  
  for (let i = 0; i < grid.length; i++) {
    /** @type {string[]} */
    const splitted_row = [];

    for (let j = 0; j < grid[i].length; j++) {
      splitted_row.push(grid[i][j]);
    }

    splitted_grid.push(splitted_row);
  }

  return splitted_grid;
}

/**
 * @param {number} size - La taille de la grille à générer.
 * @returns {string[][] | null}
 */
export const generateGrid = (size) => {
  /** @type {string[]} */  
  const grid = [];
  const columns = arrayFromLength(size);
  let rows = generateRows(size);

  /** @type {number} */
  let index;
  /** @type {string} */
  let row;

  for (let i = 0; i < size; i++) {
    if (i > 1) {
      let nextRowPattern = defineNextRow(columns);
      const filtered_rows = filteringRows(rows, nextRowPattern);
      
      index = getRandomNumber(filtered_rows.length - 1);
      row = filtered_rows[index];

      if (!row) return null;
      index = rows.indexOf(row);
    }
    else {
      index = getRandomNumber(rows.length - 1);
      row = rows[index];
    }

    grid.push(row);

    for (let j = 0; j < row.length; j++) {
      columns[j] += row[j];
    }

    switch (index) {
      case 0:
        rows = rows.splice(1);
        break;
      case rows.length - 1:
        rows.pop();
        break;
      default:
        rows = [...rows.slice(0, index), ...rows.slice(index + 1)];
        break;
    }
  }

  return splitGridIntoTiles(grid);
}

/** @param {number} size */
const generateRows = (size) => {
  /** @type {string[]} */  
  const rows = [];
  const max = 2 ** size;

  for (let i = 0; i < max; i++) {
    const str = i.toString(2).padStart(size, TileValues.ZERO).toString();

    if (
      str.includes(TileValues.ZERO.repeat(3)) ||
      str.includes(TileValues.ONE.repeat(3)) ||
      countSubstrInStr(str, TileValues.ZERO) > size / 2 ||
      countSubstrInStr(str, TileValues.ONE) > size / 2
    ) continue;

    rows.push(str);
  }

  return rows;
}

/**
 * @param {string[]} columns 
 */
const defineNextRow = (columns) => {
  let next_row = "";

  for (let i = 0; i < columns.length; i++) {
    if (columns[i].slice(-2) == TileValues.ZERO.repeat(2)) {
      next_row += TileValues.ONE;
    }
    else if (columns[i].slice(-2) == TileValues.ONE.repeat(2)) {
      next_row += TileValues.ZERO;
    }
    else if (countSubstrInStr(columns[i], TileValues.ZERO) == columns.length / 2) {
      next_row += TileValues.ONE;
    }
    else if (countSubstrInStr(columns[i], TileValues.ONE) == columns.length / 2) {
      next_row += TileValues.ZERO;
    }
    else {
      next_row += TileValues.EMPTY;
    }
  }

  return next_row;
}

/**
 * @param {string[]} rows 
 * @param {string} pattern 
 */
const filteringRows = (rows, pattern) => {
  const filtered_rows = rows.filter((row) => {
    let isNextRow = true;
    for (let i = 0; i < rows.length; i++) {
      if (pattern[i] === TileValues.EMPTY) continue;
      if (row.split("")[i] !== pattern[i]) {
        isNextRow = false;
        break;
      }
    }

    return isNextRow;
  });

  return filtered_rows;
}

/**
 * @param {string[][]} grid 
 * @param {number} fillFactor - Un facteur qui défini à combien de % la grille sera remplie. 
 */
export const prepareGrid = (grid, fillFactor) => {
  /** @type {string[][]} */
  const prepared_grid = [...grid];

  const gridSize = grid.length;
  const totalItemsInGrid = gridSize ** 2;
  // On calcule le nombre d'items qu'on doit remplir en fonction du `fillFactor`.
  const numberOfFilledItems = Math.floor(totalItemsInGrid * fillFactor);
  const numberOfEmptyItems = totalItemsInGrid - numberOfFilledItems;

  let currentNumberOfEmptyItems = 0;

  while (numberOfEmptyItems !== currentNumberOfEmptyItems) {
    const rowIndex = takeRandomIndexFromArray(prepared_grid);
    const columnIndex = takeRandomIndexFromArray(prepared_grid[rowIndex]);

    if (prepared_grid[rowIndex][columnIndex] === TileValues.EMPTY) continue;
    prepared_grid[rowIndex][columnIndex] = TileValues.EMPTY;
    currentNumberOfEmptyItems++;
  }

  return prepared_grid;
};
