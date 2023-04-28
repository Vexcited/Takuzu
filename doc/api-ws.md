## Documentation de l'API du serveur WS - sur `/api/ws`

La communication se fait sous genre de messages `nomCommand:donnéesCommande`.

Par exemple, si l'on veut appeler la commande `hello` avec la donnée `world`, on va envoyer au serveur `hello:world`.

Ainsi, la donnée envoyée ne peut contenir qu'un string.
Donc si on veut envoyer une donnée en JSON au serveur, il faudra
le `JSON.stringify`.

Par exemple, si l'on veut envoyer `{ hello: "world" }` sur la commande 
`ping` au serveur, on utilisera `ping:${JSON.stringify({ hello: "world" })}` qui résultera en `ping:{"hello":"world"}`.

### `new_id` - Initialiser une nouvelle session

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

### `status` - Changer le status de l'utilisateur

#### Requête

> `status:{DONNEES_JSON_ApiWsStatusRequest}`

Les données à envoyer sont sous forme JSON, voici son interface :

```typescript
interface ApiWsStatusRequest {
  /** Si l'utilisateur est dans une partie ou non. */
  in_game: boolean;
  /** Si l'utilisateur est en partie en ligne ou non. */
  online: boolean;
}
```

Cette commande permet de mettre à jour le status de l'utilisateur actuellement connecté.

#### Réponse

Cette commande ne donne pas de réponse, elle va seulement émettre
un [événement `connected_user_update`](#connected_user_update---quand-un-utilisateur-est-mis-à-jour).

### `connected_user_update` - Quand un utilisateur est mis à jour

> `connected_user_update:{DONNEES_JSON_ApiWsConnectedUserUpdateResponse}`

Les données reçus sont sous forme JSON, voici son interface :

```typescript
interface ApiWsConnectedUserUpdateResponse {
  id: string;
  name: string;
  status: "idle" | "in-game-solo" | "in-game-online";
  current_online_game_id: null | string;
}
```

Événement envoyé par le serveur lorsqu'un utilisateur est mis à jour.

### `invite` - Inviter un joueur dans un duel en ligne

#### Requête

> `invite:{DONNEES_JSON_ApiWsInviteRequest}`

Les données à envoyer sont sous forme JSON, voici son interface :

```typescript
interface ApiWsInviteRequest {
  /** L'ID de l'utilisateur à inviter. */
  user_invited_id: string;
  /** Configuration de la partie. */
  game_config: {
    size: number;
    fillFactor: number;
  };
}
```

Cette commande va déclencher un [événement `invited`](#invited---quand-lutilisateur-a-été-invité-dans-un-duel-en-ligne) chez l'utilisateur invité.

#### Réponse

> `invite:GAME_ID`

Le serveur répondra avec `GAME_ID`, de type `string`, UUID qui corespondra à l'ID de la partie créée.
On peut s'en servir pour ainsi rejoindre celle-ci et recupérer ses informations
en utilisant l'API REST: `GET /api/games/:id`.

### `invited` - Quand l'utilisateur a été invité dans un duel en ligne

> `invited:{DONNEES_JSON_ApiWsInvitedResponse}`

Les données reçus sont sous forme JSON, voici son interface :

```typescript
interface ApiWsInvitedResponse {
  /** ID de l'utilisateur qui vous a invité. */
  user_id: string;
  /** ID de la partie où l'utilisateur a été invité. */
  game_id: string;
}
```

### `join` - Rejoindre un duel en ligne où l'on a été invité

#### Requête

> `join:GAME_ID`

Où `GAME_ID`, de type `string`, est l'ID de la partie à rejoindre.

#### Réponse

Cette commande ne donne pas de réponse, elle va seulement émettre
un [événement `joined`](#joined---quand-lutilisateur-a-rejoint-une-partie).

### `joined` - Quand l'utilisateur a rejoint une partie

#### Response

> `joined:{DONNEES_JSON_ApiWsJoinedResponse}`

Les données reçus sont sous forme JSON, voici son interface :

```typescript
interface ApiWsJoinedResponse {
  user_id: string;
  is: "user1" | "user2" | "spectator";
}
```

### `game_action` - Émettre ou recevoir une action de la partie en cours

#### Requête

> `game_action:{DONNEES_JSON_ApiWsGameActionRequest}`

```typescript
interface ApiWsGameActionRequest {
  game_id: string;
  rowIndex: number;
  columnIndex: number;
  value: "1" | "0" | ".";
}
```

Cette commande va dire au serveur d'effectuer cette action sur la grille de l'utilisateur.

#### Réponse

> `game_action:{DONNEES_JSON_ApiWsGameActionResponse}`

```typescript
interface ApiWsGameActionResponse {
  /** L'ID de l'utilisateur qui a effectué l'action. */
  user_id: string;
  is: "user1" | "user2";
  /** Le changement effectué sur la grille. */
  grid_change: {
    rowIndex: number;
    columnIndex: number;
    value: "1" | "0" | ".";
  }
}
```

### `game_win` - Quand un utilisateur a gagné la partie

#### Response

> `joined:{DONNEES_JSON_ApiWsGameWinResponse}`

Les données reçus sont sous forme JSON, voici son interface :

```typescript
interface ApiWsGameWinResponse {
  user_id: string;
  is: "user1" | "user2";
}
```