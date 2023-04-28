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

### GET `/api/games/:id` - Récupérer les informations sur une partie.

Le paramètre `id` dans l'URL correspond à l'identifiant de la partie
dont on veut avoir les informations.

```typescript
interface GameDataUser {
  /** Identifiant de l'utilisateur. */
  id: string;
  /** Permet de svoir si l'utilisateur est actuellement dans la partie ou non. */
  joined: boolean;
  /** La grille actuelle de l'utilisateur. */
  grid: Array<Array<"1" | "0" | ".">>;
}

interface GameData {
  /** Taille de la grille en cours. */
  size: number;
  /** Pourcentage, en nombre flotant, de remplissage de la grille en cours. */
  fillFactor: number;

  user1: GameDataUser;
  user2: GameDataUser;
}

const request = async (id: string): Promise<GameData> => {
  const response = await fetch(`/api/games/${id}`);
  const game_data = await response.json() as GameData;
  return game_data
};
```