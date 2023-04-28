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

