import { cookies } from "next/headers";

import { respond } from "@/server/http";
import { SESSION_COOKIE } from "@/server/token";

export async function POST() {
  return respond(async () => {
    (await cookies()).delete(SESSION_COOKIE);
    return { ok: true };
  });
}
