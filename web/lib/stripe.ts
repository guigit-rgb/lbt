import Stripe from "stripe";

// Un seul prestataire au lancement (cahier des charges §5, décision du
// 2026-08-22) : Stripe couvre CB + prélèvement SEPA pour tout ce que LBT
// encaisse pour son propre compte (modification payante, annonce urgente,
// plus tard l'abonnement pro). Ne sert jamais à faire transiter un paiement
// entre acheteur et vendeur du véhicule (hors MVP, §6.6 Résultat n°7c).
//
// Instancié à la première utilisation, pas au chargement du module : sans
// STRIPE_SECRET_KEY (avant que le compte Stripe n'existe), `next build`
// évalue quand même ce module pour collecter les routes API, et un `new
// Stripe(...)` au niveau module ferait échouer le build entier pour une
// fonctionnalité que personne n'a encore déclenchée.
let _stripe: Stripe | undefined;
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return _stripe;
}
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripe(), prop, receiver);
  },
});

export const PRIX_MODIFICATION_CENTS = 400; // 4 €, cf. §5 Résultat n°6
export const PRIX_URGENT_CENTS = 299; // 2,99 €, milieu de la fourchette 0,99-4,99 € du §5.2, à tester
export const DUREE_URGENT_HEURES = 48;
