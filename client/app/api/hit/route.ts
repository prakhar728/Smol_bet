export async function GET() {
  console.log("[/api/hit] GET hit");
  return Response.json({ ok: true, method: "GET", ts: new Date().toISOString() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  console.log("[/api/hit] POST hit", body);
  return Response.json({ ok: true, method: "POST" });
}
