# Takuzu

> Implémentation JS du jeu de réflexion [Takuzu, ou Binairo](https://fr.wikipedia.org/wiki/Takuzu).

## Principe du Takuzu - en résumé

C'est un jeu qui consiste à remplir une grille avec les chiffres `0` et `1` par déduction logique.

Cette grille peut aller de 6x6 à 14x14 en général, mais peut très bien avoir un
nombre de colonnes et de lignes différent - *voire différents entre eux pourvu
qu'ils soient pairs*.

Chaque grille ne contient que des éléments d’une paire quelconque - le cas le plus courant étant des 0 et des 1 -, et doit être complétée en respectant trois règles:

- autant de 1 que de 0 sur chaque ligne et sur chaque colonne ;
- pas plus de 2 chiffres identiques côte à côte ;
- 2 lignes ou 2 colonnes ne peuvent être identiques.

## Usage

### StackBlitz

Vous pouvez directement cloner et démarrer ce projet en local
dans votre navigateur en utilisant le lien ci-dessous.

[![Ouvrir dans StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Vexcited/takuzu?embed=1&hideExplorer=1&theme=dark&view=preview&startScript=start&title=Takuzu)

### Local

Pour une utilisation en local sur votre PC, vous pouvez cloner ce répertoire,
installer les dépendances et démarrer le serveur Takuzu vous même.

```bash
git clone https://github.com/Vexcited/takuzu
cd takuzu

# Utilisation de pnpm pour installer les dépendances (`npm i -g pnpm`)
pnpm install

# Démarrage du serveur Takuzu.
pnpm start
```

## Développement

> Effectuez les mêmes étapes que [Usage#Local](#local) avec la petite
> recommandation ci-dessous.

Pour une utilisation en mode développement, optez pour `pnpm dev` à la place de
`pnpm start` pour avoir un redémarrage automatique du serveur lors de
modifications.

Le code du serveur est disponible dans [`./src`](./src/) et le code
du client (interface web) est disponible dans [`./public`](./public/).

## Documentation de l'API du serveur REST - sur `/api`

Voir [la documentation](./doc/api-rest.md).

## Documentation de l'API du serveur WS - sur `/api/ws`

Voir [la documentation](./doc/api-ws.md).
