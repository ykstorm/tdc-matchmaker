import { cookies } from "next/headers";

import { respond } from "@/server/http";
import { loginBody } from "@/server/schemas";
import { login } from "@/server/services/auth-service";
import { SESSION_COOKIE, SESSION_HOURS } from "@/server/token";

export async function POST(request: Request) {
  return respond(async () => {
    const { username, password } = loginBody.parse(await request.json());
    const { token, name } = await login(username, password);
    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_HOURS * 3600,
      path: "/",
    });
    return { name };
  });
}
