import { respond } from "@/server/http";
import { requireSession } from "@/server/session";
import { getMatches } from "@/server/services/match-service";

export async function GET(_request: Request, ctx: RouteContext<"/api/customers/[id]/matches">) {
  return respond(async () => getMatches(await requireSession(), (await ctx.params).id));
}
