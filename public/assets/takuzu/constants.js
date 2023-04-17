/**
 * Définition des erreurs qui seront réutilisés
 * à travers le jeu. 
 */
export const ERRORS = /** @type {const} */ ({
  GRID_NOT_GENERATED: "Pour appeler cette méthode, une grille doit être généré.",
  DUPLICATION: "Toutes les colonnes et les lignes doivent être uniques.",
  BALANCE: "Les tuiles doivent être en quantité égale sur chaque ligne et colonne.",
  TRIPLE: "Pas plus de deux tuiles consécutives de la même couleur sont autorisées.",
  INVALID_FILL_FACTOR: "Invalid fill factor. Allowable filling range is 0.2 to 0.5"
});

/** @param {"row" | "column"} line */
export const OUT_OF_RANGE = (line) =>
  `Invalid ${line} index. Going out of range`;

/**
 * Définition des valeurs qui peuvent être insérés
 * dans la grille.
 * 
 * `null` est une façon de dire que la tuille est vide.
 */
export const TileValues = /** @type {const} */ ({
  "ZERO": "0",
  "ONE": "1",
  "EMPTY": "."
});
