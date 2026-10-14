// Client-side fetch for our own API. Throws with the server's message, so
// components can show it as is.
export async function api<T>(path: string, init?: { method: string; body: unknown }): Promise<T> {
  const response = await fetch(path, {
    method: init?.method ?? "GET",
    headers: init ? { "content-type": "application/json" } : undefined,
    body: init ? JSON.stringify(init.body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed. Check your connection and try again.");
  return data as T;
}
