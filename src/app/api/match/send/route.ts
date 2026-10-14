import { respond } from "@/server/http";
import { sendBody } from "@/server/schemas";
import { requireSession } from "@/server/session";
import { sendMatch } from "@/server/services/match-service";

export async function POST(request: Request) {
  return respond(async () => {
    const { customerId, matchId, subject, body } = sendBody.parse(await request.json());
    return sendMatch(await requireSession(), customerId, matchId, { subject, body });
  });
}
