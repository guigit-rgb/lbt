"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { feedback } from "@/lib/db/schema";

export async function soumettreFeedback(contexte: string, reponse: string): Promise<{ success: true }> {
  const session = await auth();

  await db.insert(feedback).values({
    userId: session?.user.id,
    contexte,
    reponse,
  });

  return { success: true };
}
