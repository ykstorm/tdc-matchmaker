import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";

import { NotFoundError, UnauthorizedError } from "./errors";

function statusFor(error: unknown) {
  if (error instanceof UnauthorizedError) return 401;
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ZodError) return 400;
  return 500;
}

// Every route handler goes through this, so handlers only describe the happy
// path and errors map to status codes in one place.
export async function respond(work: () => Promise<unknown>) {
  try {
    return Response.json(await work());
  } catch (error) {
    // Next signals things like "this route is dynamic" by throwing. Those
    // must pass through, or Next can't do its job.
    unstable_rethrow(error);
    const status = statusFor(error);
    if (status === 500) console.error(error);
    const message = status === 500 ? "Server error. Try again in a minute." : messageOf(error);
    return Response.json({ error: message }, { status });
  }
}

function messageOf(error: unknown) {
  if (error instanceof ZodError) return error.issues.map((issue) => issue.message).join(", ");
  return error instanceof Error ? error.message : "Request failed";
}
