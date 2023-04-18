/**
 * - `balance` (règle 1): autant de 1 que de 0 sur chaque ligne et sur chaque colonne.
 * - `triple` (règle 2): pas plus de 2 chiffres identiques côte à côte.
 * - `duplicate` (règle 3): 2 lignes ou 2 colonnes ne peuvent être identiques.
 */
export type TakuzuCheckErrorType = "balance" | "triple" | "duplicate";

export type TakuzuCheckResult = (
  | { // Aucune erreur.
    error: false;
  }
  | { // Une ou plusieurs erreur(s).
    error: true;
    type: TakuzuCheckErrorType;
    message: string;
    position: string[];
  }
);
