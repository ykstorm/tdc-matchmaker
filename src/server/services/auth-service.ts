import { compare } from "bcryptjs";

import { store } from "../data/store";
import { UnauthorizedError } from "../errors";
import { signSession } from "../token";

export async function login(username: string, password: string) {
  const matchmaker = store.matchmakers.find((m) => m.username === username.trim().toLowerCase());
  // Compare against a real hash even for unknown users so the response time
  // does not reveal which usernames exist.
  const hash = matchmaker?.passwordHash ?? store.matchmakers[0].passwordHash;
  const valid = await compare(password, hash);
  if (!matchmaker || !valid) throw new UnauthorizedError("Wrong username or password");
  const token = await signSession({ matchmakerId: matchmaker.id, name: matchmaker.name });
  return { token, name: matchmaker.name };
}
