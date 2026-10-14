import { cookies } from "next/headers";

import { UnauthorizedError } from "./errors";
import { SESSION_COOKIE, readSession } from "./token";

export async function currentSession() {
  const jar = await cookies();
  return readSession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSession() {
  const session = await currentSession();
  if (!session) throw new UnauthorizedError("Please sign in");
  return session;
}
