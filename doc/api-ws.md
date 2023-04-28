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
