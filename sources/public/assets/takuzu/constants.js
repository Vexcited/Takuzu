/**
 * Définition des erreurs qui seront réutilisés
 * à travers le jeu. 
 */
export const ERRORS = /** @type {const} */ ({
  DUPLICATION: "Toutes les colonnes et les lignes doivent être uniques.",
  BALANCE: "Les tuiles doivent être en quantité égale sur chaque ligne et colonne.",
  TRIPLE: "Pas plus de deux tuiles consécutives de la même couleur sont autorisées.",
  FILL_GRID_FIRST: "Complétez la grille en premier pour avoir des indices de résolution."
});

/** @param {"row" | "column"} line */
export const OUT_OF_RANGE = (line) => `Hors de porté: ${line} (index)`;

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
