# Takuzu

> Implémentation JS du jeu de réflexion [Takuzu, ou Binairo](https://fr.wikipedia.org/wiki/Takuzu).

## Principe du Takuzu - en résumé

C'est un jeu qui consiste à remplir une grille avec les chiffres `0` et `1` par déduction logique.

Cette grille peut aller de 6x6 à 14x14 en général, mais peut très bien avoir un nombre de colonnes et de lignes différent - *voire différents entre eux pourvu qu'ils soient pairs*.

Chaque grille ne contient que des éléments d’une paire quelconque - le cas le plus courant étant des 0 et des 1 -, et doit être complétée en respectant trois règles:

- autant de 1 que de 0 sur chaque ligne et sur chaque colonne ;
- pas plus de 2 chiffres identiques côte à côte ;
- (règle de non-duplication) 2 lignes ou 2 colonnes ne peuvent être identiques.

## Notre implémentation

- Configuration des pairs : "`0` et `1`" (celui par défaut), "`#FFFFFF` et `#`" par exemple, ...
- On peut choisir d'activer la 3ème règle ou non.
