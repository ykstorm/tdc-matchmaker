import { respond } from "@/server/http";
import { requireSession } from "@/server/session";
import { listCustomers } from "@/server/services/customer-service";

export async function GET() {
  return respond(async () => listCustomers(await requireSession()));
}
