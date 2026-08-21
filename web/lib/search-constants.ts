// Fichier à part (pas dans lib/annonce-search.ts) car cette constante est lue
// par <SiteHeader>, un composant client : importer `annonce-search` depuis le
// client embarquerait Drizzle et le schéma complet dans le bundle du
// navigateur, pour un seul nombre.
//
// Longueur maximale d'une requête de recherche. Le champ de l'en-tête la fait
// respecter côté navigateur, `motsRecherche()` la refait respecter côté
// serveur — l'attribut `maxLength` d'un input n'engage personne.
export const MAX_LONGUEUR_REQUETE = 120;
