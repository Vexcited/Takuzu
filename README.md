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
- (règle de non-duplication) 2 lignes ou 2 colonnes ne peuvent être identiques.

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

La communication se fait avec du JSON.

### GET `/api/connected_users` - Récupérer les utilisateurs connectés.

Il n'y a pas de paramètres à passer, on fait tout simplement une requête GET
et on reçoit les données.

```typescript
interface UserConnected {
  id: string;
  /** Pseudonyme de l'utilisateur. */
  name: string;
}

type ApiConnectedUsersResponse = Array<UserConnected>;

const response = await fetch("/api/connected_users");
const connected_users = await response.json() as ApiConnectedUsersResponse;
```

## Documentation de l'API du serveur WS - sur `/api/ws`

La communication se fait sous genre de messages `nomCommand:donnéesCommande`.

Par exemple, si l'on veut appeler la commande `hello` avec la donnée `world`, on va envoyer au serveur `hello:world`.

Ainsi, la donnée envoyée ne peut contenir qu'un string.
Donc si on veut envoyer une donnée en JSON au serveur, il faudra
le `JSON.stringify`.

Par exemple, si l'on veut envoyer `{ hello: "world" }` sur la commande 
`ping` au serveur, on utilisera `ping:${JSON.stringify({ hello: "world" })}` qui résultera en `ping:{"hello":"world"}`.

### `new_id` - Initialiser une nouvelle session

Commande que l'on envoit au serveur.

#### Requête

> `new_id:NOM_D_UTILISATEUR`

Cette commande permet de créer un nouvel utilisateur avec le nom d'utilisateur `NOM_D_UTILISATEUR`.

#### Réponse

> `new_id:UUID`

Le serveur répondra avec un uuid qui corespondra à l'ID de l'utilisateur côté serveur.
On peut s'en servir pour plus tard permettre les autres utilisateurs de communiquer avec celui-ci.

### `new_connected_user` - Quand un nouvel utilisateur se connecte

> `new_connected_user:{"name":"..","id":".."}`

Événement envoyé par le serveur lorsqu'un nouvel utilisateur est connecté
au serveur.

### `disconnected_user` - Quand un utilisateur se déconnecte

> `disconnected_user:UUID`

Événement envoyé par le serveur lorsqu'un utilisateur est déconnecté du serveur.
