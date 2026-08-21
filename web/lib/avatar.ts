// Couleur d'avatar dérivée du nom — déterministe (le même nom donne toujours
// la même couleur) plutôt qu'aléatoire à chaque rendu. Partagé entre la page
// de profil du compte et la page publique d'un vendeur.
const COULEURS_AVATAR = ["#e2231a", "#0a5c36", "#1d4ed8", "#a3410b", "#6d28d9", "#0f766e"];

export function couleurAvatar(nom: string): string {
  const somme = [...nom].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COULEURS_AVATAR[somme % COULEURS_AVATAR.length];
}
