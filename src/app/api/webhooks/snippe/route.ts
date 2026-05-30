import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Example Payload format from Snippe (assuming typical structure):
    // { event: "payment.completed", data: { status: "success", metadata: { customer_id: "uid123" } } }
    
    if (payload.event === "payment.completed" && payload.data?.status === "success") {
      const userId = payload.data.metadata?.customer_id;
      
      if (!userId) {
        return NextResponse.json({ error: "Missing customer_id in metadata" }, { status: 400 });
      }

      const premiumUntil = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days from now

      // Update Firestore
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        isPremium: true,
        premiumUntil,
        lastPaymentEvent: payload.event,
        updatedAt: Date.now()
      }, { merge: true });

      return NextResponse.json({ success: true, message: "User upgraded to premium" });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Snippe Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
