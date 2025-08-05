import { inngest } from "@/lib/inngest";

export async function POST(req) {
    try {
        const body = await req.json();
        const eventType = body.type;

        console.log("📩 Clerk Webhook Received:", eventType);

        if (eventType === "user.created") {
            await inngest.send({
                name: "clerk/user.created",
                data: body.data,
            });
        } else if (eventType === "user.updated") {
            await inngest.send({
                name: "clerk/user.updated",
                data: body.data,
            });
        } else if (eventType === "user.deleted") {
            await inngest.send({
                name: "clerk/user.deleted",
                data: body.data,
            });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error("❌ Error in /api/clerk/webhook:", err);
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
