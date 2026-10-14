import { SignJWT, jwtVerify } from "jose";

// Kept apart from the auth service so the proxy can verify sessions without
// pulling the profile store and bcrypt into its bundle.

export const SESSION_COOKIE = "tdc_session";
export const SESSION_HOURS = 12;

export interface Session {
  matchmakerId: string;
  name: string;
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value && process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(value ?? "local-dev-secret-not-for-production");
}

export function signSession(session: Session) {
  return new SignJWT({ name: session.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.matchmakerId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secret());
}

export async function readSession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { matchmakerId: String(payload.sub), name: String(payload.name) };
  } catch {
    return null;
  }
}
