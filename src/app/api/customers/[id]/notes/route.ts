import { respond } from "@/server/http";
import { noteBody } from "@/server/schemas";
import { requireSession } from "@/server/session";
import { addNote } from "@/server/services/customer-service";

export async function POST(request: Request, ctx: RouteContext<"/api/customers/[id]/notes">) {
  return respond(async () => {
    const { text } = noteBody.parse(await request.json());
    return addNote(await requireSession(), (await ctx.params).id, text);
  });
}
