import { Webhook } from "@creem_io/nextjs";
import { adminDb } from "@/lib/firebase-admin";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onGrantAccess: async ({ customer, metadata }) => {
    const userId = metadata?.referenceId as string | undefined;
    if (!userId || !adminDb) return;
    const userRef = adminDb.collection("users").doc(userId);
    await userRef.set(
      {
        membershipTier: "paid",
        creemCustomerId: customer.id,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  },
  onRevokeAccess: async ({ metadata }) => {
    const userId = metadata?.referenceId as string | undefined;
    if (!userId || !adminDb) return;
    const userRef = adminDb.collection("users").doc(userId);
    await userRef.set(
      {
        membershipTier: "free",
        creemCustomerId: null,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  },
});
