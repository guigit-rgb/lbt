import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { appliquerPaiementConfirme } from "@/lib/actions/paiements";

// Source de vérité du paiement : jamais la redirection `success_url` (fermée
// par l'utilisateur, rejouable, non signée), toujours cet événement signé par
// Stripe. À configurer dans le dashboard Stripe sur .../api/stripe/webhook
// avec l'événement "checkout.session.completed", et STRIPE_WEBHOOK_SECRET
// dans .env.local.
export async function POST(req: Request): Promise<Response> {
  const corps = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let evenement;
  try {
    evenement = stripe.webhooks.constructEvent(corps, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (erreur) {
    return NextResponse.json({ error: `Signature invalide : ${erreur}` }, { status: 400 });
  }

  if (evenement.type === "checkout.session.completed") {
    const session = evenement.data.object;
    await appliquerPaiementConfirme(session.id);
  }

  return NextResponse.json({ received: true });
}
