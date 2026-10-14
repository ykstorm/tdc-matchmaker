import { respond } from "@/server/http";
import { statusBody } from "@/server/schemas";
import { requireSession } from "@/server/session";
import { getCustomer, setStatus } from "@/server/services/customer-service";

export async function GET(_request: Request, ctx: RouteContext<"/api/customers/[id]">) {
  return respond(async () => getCustomer(await requireSession(), (await ctx.params).id));
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/customers/[id]">) {
  return respond(async () => {
    const { status } = statusBody.parse(await request.json());
    return setStatus(await requireSession(), (await ctx.params).id, status);
  });
}
