// @ts-check

import { useUsernameSelectionModal } from "./render/modals/username.js";
const [openUsernameSelectionModal] = useUsernameSelectionModal();

// On affiche le modal de séléction de nom d'utilisateur au chargement de la page.
// C'est ce modal - après confirmation - qui va initialiser les pages, la connexion au serveur, etc...
document.body.onload = () => openUsernameSelectionModal();
