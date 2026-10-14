import { cookies } from "next/headers";

import { UnauthorizedError } from "./errors";
import { SESSION_COOKIE, readSession } from "./token";

async function currentSession() {
  const jar = await cookies();
  return readSession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSession() {
  const session = await currentSession();
  if (!session) throw new UnauthorizedError("Your session ended. Sign in again.");
  return session;
}
