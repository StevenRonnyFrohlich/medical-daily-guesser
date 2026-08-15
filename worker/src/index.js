const COOKIE = "call_session";
const MAX_FILES = 3;
const MAX_BYTES = 8 * 1024 * 1024;
const LINK_TTL_MS = 20 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CATALOG_CACHE = "public, max-age=60";
const OFFICIAL_TRACKS = new Set(["morphology", "organisms", "abnormal", "cytology"]);

const ALLOWED_ORIGINS = [
  "https://scopethecall.com",
  "https://www.scopethecall.com",
  "https://stevenronnyfrohlich.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://localhost:5500"
];

export default {
  async fetch(request, env, ctx) {
    try {
      return await handle(request, env, ctx);
    } catch (error) {
      console.error(JSON.stringify({ err: String(error && error.stack ? error.stack : error) }));
      return json({ error: "Server error" }, 500, request);
    }
  }
};

async function handle(request, env, ctx) {
  if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }), request);

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (request.method === "GET" && path === "/catalog") return catalog(env, request);
  if (request.method === "GET" && path.startsWith("/img/")) return serveImage(env, request, path.slice(5));
  if (request.method === "POST" && path === "/auth/magic-link") return magicLink(env, request);
  if (request.method === "GET" && path === "/auth/callback") return callback(env, request, url);
  if (request.method === "POST" && path === "/auth/logout") return logout(request);
  if (request.method === "GET" && path === "/me") return me(env, request);
  if (request.method === "POST" && path === "/submissions") return createSubmission(env, request);
  if (request.method === "GET" && path === "/submissions") return mySubmissions(env, request);
  if (request.method === "GET" && path === "/admin/queue") return adminQueue(env, request);
  if (request.method === "POST" && path.startsWith("/admin/submissions/") && path.endsWith("/approve")) {
    return approve(env, request, path.split("/")[3]);
  }
  if (request.method === "POST" && path.startsWith("/admin/submissions/") && path.endsWith("/reject")) {
    return reject(env, request, path.split("/")[3]);
  }

  return json({ error: "Not found" }, 404, request);
}

async function catalog(env, request) {
  const extraTrays = await env.DB.prepare(
    "SELECT id, label, blurb FROM trays WHERE official = 0 ORDER BY label"
  ).all();
  const rows = await env.DB.prepare(
    `SELECT s.*, u.email
     FROM submissions s
     JOIN users u ON u.id = s.user_id
     WHERE s.status = 'approved'
     ORDER BY s.reviewed_at DESC`
  ).all();
  const specimens = [];
  for (const row of rows.results || []) {
    const files = await env.DB.prepare(
      "SELECT id FROM submission_files WHERE submission_id = ? ORDER BY sort_order"
    )
      .bind(row.id)
      .all();
    const origin = apiOrigin(request);
    const urls = (files.results || []).map((file) => `${origin}/img/${file.id}`);
    if (!urls.length) continue;
    specimens.push({
      id: `ugc-${row.id}`,
      name: `${row.diagnosis} (${row.plain})`,
      scientific: row.scientific,
      about: row.about || "",
      category: row.track,
      track: row.track,
      difficulty: clamp(row.difficulty, 1, 5),
      stain: row.stain,
      mag: row.mag,
      file: urls[0],
      files: urls,
      credit: row.credit || "contributor",
      lookalikes: safeJson(row.lookalikes, []),
      blurb: row.blurb
    });
  }
  return json(
    { trays: extraTrays.results || [], specimens },
    200,
    request,
    { "Cache-Control": CATALOG_CACHE }
  );
}

async function serveImage(env, request, fileId) {
  const id = decodeURIComponent(fileId).replace(/[^a-zA-Z0-9_-]/g, "");
  if (!id) return json({ error: "Not found" }, 404, request);
  const row = await env.DB.prepare(
    `SELECT f.r2_key, f.content_type, s.status, s.user_id
     FROM submission_files f
     JOIN submissions s ON s.id = f.submission_id
     WHERE f.id = ?`
  )
    .bind(id)
    .first();
  if (!row) return json({ error: "Not found" }, 404, request);
  if (row.status !== "approved") {
    const user = await currentUser(env, request);
    const admin = isAdmin(env, user);
    if (!user || (!admin && user.id !== row.user_id)) {
      return json({ error: "Not found" }, 404, request);
    }
  }
  if (!env.FIELDS) return json({ error: "Image storage is not enabled yet." }, 503, request);
  const obj = await env.FIELDS.get(row.r2_key);
  if (!obj) return json({ error: "Not found" }, 404, request);
  const headers = new Headers();
  headers.set("Content-Type", row.content_type || "image/jpeg");
  headers.set("Cache-Control", row.status === "approved" ? "public, max-age=31536000, immutable" : "private, max-age=60");
  return cors(new Response(obj.body, { headers }), request);
}

async function magicLink(env, request) {
  if (!(await rateLimit(env, request, "magic", 5, 15 * 60 * 1000))) {
    return json({ error: "Too many login attempts. Wait a few minutes." }, 429, request);
  }
  const body = await readJson(request);
  const email = normalizeEmail(body && body.email);
  if (!email) return json({ error: "Enter an email address." }, 400, request);
  if (!(await rateLimit(env, request, `magic:${email}`, 5, 15 * 60 * 1000))) {
    return json({ error: "Too many login attempts. Wait a few minutes." }, 429, request);
  }
  const raw = randomToken();
  const hash = await sha256(raw);
  await env.DB.prepare("INSERT INTO magic_links (token_hash, email, expires_at) VALUES (?, ?, ?)").bind(
    hash,
    email,
    Date.now() + LINK_TTL_MS
  ).run();
  const api = apiOrigin(request);
  const url = `${api}/auth/callback?token=${encodeURIComponent(raw)}`;
  const sent = await sendMagicMail(env, email, url);
  const payload = { ok: true, sent };
  if (!env.RESEND_API_KEY) payload.devLink = url;
  return json(payload, 200, request);
}

async function callback(env, request, url) {
  const raw = url.searchParams.get("token") || "";
  const app = appOrigin(env, request);
  if (!raw) return Response.redirect(`${app}/account.html?error=missing`, 302);
  const hash = await sha256(raw);
  const row = await env.DB.prepare("SELECT email, expires_at FROM magic_links WHERE token_hash = ?")
    .bind(hash)
    .first();
  await env.DB.prepare("DELETE FROM magic_links WHERE token_hash = ?").bind(hash).run();
  if (!row || row.expires_at < Date.now()) {
    return Response.redirect(`${app}/account.html?error=expired`, 302);
  }
  let user = await env.DB.prepare("SELECT id, email FROM users WHERE email = ?").bind(row.email).first();
  if (!user) {
    user = { id: crypto.randomUUID(), email: row.email };
    await env.DB.prepare("INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)").bind(
      user.id,
      user.email,
      Date.now()
    ).run();
  }
  const sessionRaw = randomToken();
  const sessionHash = await sha256(sessionRaw);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(
    sessionHash,
    user.id,
    Date.now() + SESSION_TTL_MS
  ).run();
  const headers = new Headers();
  headers.set("Location", `${app}/account.html`);
  headers.append("Set-Cookie", sessionCookie(sessionRaw, request, SESSION_TTL_MS / 1000));
  return cors(new Response(null, { status: 302, headers }), request);
}

function logout(request) {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", sessionCookie("", request, 0));
  return cors(new Response(JSON.stringify({ ok: true }), { status: 200, headers }), request);
}

async function me(env, request) {
  const user = await currentUser(env, request);
  if (!user) return json({ user: null }, 200, request);
  return json(
    { user: { id: user.id, email: user.email, admin: isAdmin(env, user) } },
    200,
    request
  );
}

async function createSubmission(env, request) {
  const user = await currentUser(env, request);
  if (!user) return json({ error: "Log in to submit a field." }, 401, request);
  if (!(await rateLimit(env, request, `up:${user.id}`, 8, 60 * 60 * 1000))) {
    return json({ error: "Upload limit reached for this hour." }, 429, request);
  }
  const form = await request.formData();
  const rights = truthy(form.get("rights"));
  const noPhi = truthy(form.get("no_phi"));
  const deidentified = truthy(form.get("deidentified"));
  const notAdvice = truthy(form.get("not_advice"));
  if (!rights || !noPhi || !deidentified || !notAdvice) {
    return json({ error: "All attestations are required." }, 400, request);
  }
  const diagnosis = String(form.get("diagnosis") || "").trim();
  const plain = String(form.get("plain") || "").trim();
  const scientific = String(form.get("scientific") || "").trim();
  const blurb = String(form.get("blurb") || "").trim();
  if (!diagnosis || !plain || !scientific || !blurb) {
    return json({ error: "Diagnosis, plain English name, scientific name, and a short note are required." }, 400, request);
  }
  const lookalikes = [1, 2, 3]
    .map((n) => String(form.get(`lookalike${n}`) || "").trim())
    .filter(Boolean);
  if (lookalikes.length !== 3) return json({ error: "Give three lookalike diagnoses." }, 400, request);
  let track = String(form.get("track") || "").trim();
  const proposedLabel = String(form.get("proposed_label") || "").trim();
  if (track === "new") {
    if (!proposedLabel) return json({ error: "Name the proposed tray." }, 400, request);
    track = slugify(proposedLabel);
    if (OFFICIAL_TRACKS.has(track) || track.length < 2) {
      return json({ error: "Choose a different tray name." }, 400, request);
    }
  } else if (!OFFICIAL_TRACKS.has(track)) {
    return json({ error: "Pick a tray, or propose a new one." }, 400, request);
  }
  if (!env.FIELDS) return json({ error: "Image storage is not enabled yet." }, 503, request);
  const files = form.getAll("files").filter((item) => item && typeof item.arrayBuffer === "function");
  if (!files.length || files.length > MAX_FILES) {
    return json({ error: "Attach 1–3 images (jpeg, png, or webp)." }, 400, request);
  }
  const prepared = [];
  for (const file of files) {
    const type = (file.type || "").toLowerCase();
    if (!["image/jpeg", "image/png", "image/webp"].includes(type)) {
      return json({ error: "Images must be jpeg, png, or webp." }, 400, request);
    }
    let bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes.byteLength > MAX_BYTES) return json({ error: "Each image must be under 8 MB." }, 400, request);
    bytes = stripExif(bytes, type);
    prepared.push({ bytes, type });
  }
  const id = crypto.randomUUID();
  const difficulty = clamp(Number(form.get("difficulty") || 3), 1, 5);
  await env.DB.prepare(
    `INSERT INTO submissions (
      id, user_id, status, track, proposed_label, diagnosis, plain, scientific,
      lookalikes, blurb, about, stain, mag, difficulty, credit, created_at
    ) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      user.id,
      track,
      proposedLabel || null,
      diagnosis,
      plain,
      scientific,
      JSON.stringify(lookalikes),
      blurb,
      String(form.get("about") || "").trim(),
      String(form.get("stain") || "").trim() || "unspecified",
      String(form.get("mag") || "").trim() || "unspecified",
      difficulty,
      String(form.get("credit") || "").trim() || "contributor",
      Date.now()
    )
    .run();
  let order = 0;
  for (const item of prepared) {
    const fileId = crypto.randomUUID();
    const key = `pending/${user.id}/${id}/${fileId}`;
    await env.FIELDS.put(key, item.bytes, { httpMetadata: { contentType: item.type } });
    await env.DB.prepare(
      "INSERT INTO submission_files (id, submission_id, r2_key, sort_order, content_type) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(fileId, id, key, order, item.type)
      .run();
    order += 1;
  }
  return json({ ok: true, id }, 201, request);
}

async function mySubmissions(env, request) {
  const user = await currentUser(env, request);
  if (!user) return json({ error: "Log in." }, 401, request);
  const rows = await env.DB.prepare(
    `SELECT id, status, track, proposed_label, diagnosis, plain, created_at, reviewed_at
     FROM submissions WHERE user_id = ? ORDER BY created_at DESC`
  )
    .bind(user.id)
    .all();
  return json({ submissions: rows.results || [] }, 200, request);
}

async function adminQueue(env, request) {
  const user = await requireAdmin(env, request);
  if (user instanceof Response) return user;
  const rows = await env.DB.prepare(
    `SELECT s.*, u.email
     FROM submissions s
     JOIN users u ON u.id = s.user_id
     WHERE s.status = 'pending'
     ORDER BY s.created_at ASC`
  ).all();
  const origin = apiOrigin(request);
  const items = [];
  for (const row of rows.results || []) {
    const files = await env.DB.prepare(
      "SELECT id FROM submission_files WHERE submission_id = ? ORDER BY sort_order"
    )
      .bind(row.id)
      .all();
    items.push({
      ...row,
      lookalikes: safeJson(row.lookalikes, []),
      images: (files.results || []).map((file) => `${origin}/img/${file.id}`)
    });
  }
  const trays = await env.DB.prepare("SELECT id, label, official FROM trays ORDER BY official DESC, label").all();
  return json({ items, trays: trays.results || [] }, 200, request);
}

async function approve(env, request, id) {
  const user = await requireAdmin(env, request);
  if (user instanceof Response) return user;
  const body = await readJson(request);
  const row = await env.DB.prepare("SELECT * FROM submissions WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "Not found" }, 404, request);
  let track = String((body && body.track) || row.track).trim();
  const label = String((body && body.label) || row.proposed_label || track).trim();
  const blurb = String((body && body.trayBlurb) || "").trim();
  if (!OFFICIAL_TRACKS.has(track)) {
    const existing = await env.DB.prepare("SELECT id FROM trays WHERE id = ?").bind(track).first();
    if (!existing) {
      await env.DB.prepare("INSERT INTO trays (id, label, blurb, official) VALUES (?, ?, ?, 0)").bind(
        track,
        label || track,
        blurb || "A contributor tray."
      ).run();
    }
  }
  await env.DB.prepare(
    `UPDATE submissions SET
      status = 'approved',
      track = ?,
      diagnosis = ?,
      plain = ?,
      scientific = ?,
      blurb = ?,
      about = ?,
      credit = ?,
      reviewed_at = ?
     WHERE id = ?`
  )
    .bind(
      track,
      String((body && body.diagnosis) || row.diagnosis),
      String((body && body.plain) || row.plain),
      String((body && body.scientific) || row.scientific),
      String((body && body.blurb) || row.blurb),
      String((body && body.about) || row.about || ""),
      String((body && body.credit) || row.credit || "contributor"),
      Date.now(),
      id
    )
    .run();
  return json({ ok: true }, 200, request);
}

async function reject(env, request, id) {
  const user = await requireAdmin(env, request);
  if (user instanceof Response) return user;
  const row = await env.DB.prepare("SELECT id FROM submissions WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "Not found" }, 404, request);
  await env.DB.prepare("UPDATE submissions SET status = 'rejected', reviewed_at = ? WHERE id = ?")
    .bind(Date.now(), id)
    .run();
  return json({ ok: true }, 200, request);
}

async function requireAdmin(env, request) {
  const user = await currentUser(env, request);
  if (!user) return json({ error: "Log in." }, 401, request);
  if (!isAdmin(env, user)) return json({ error: "Not allowed." }, 403, request);
  return user;
}

function isAdmin(env, user) {
  const admin = normalizeEmail(env.ADMIN_EMAIL || "");
  return Boolean(user && admin && user.email === admin);
}

async function currentUser(env, request) {
  const token = cookieValue(request, COOKIE);
  if (!token) return null;
  const hash = await sha256(token);
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, s.expires_at
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?`
  )
    .bind(hash)
    .first();
  if (!row || row.expires_at < Date.now()) return null;
  return { id: row.id, email: row.email };
}

async function rateLimit(env, request, action, max, windowMs) {
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  const key = `${action}:${ip}`;
  const now = Date.now();
  const row = await env.DB.prepare("SELECT count, window_start FROM rate_limits WHERE key = ?").bind(key).first();
  if (!row || now - row.window_start > windowMs) {
    await env.DB.prepare(
      "INSERT INTO rate_limits (key, count, window_start) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, window_start = ?"
    )
      .bind(key, now, now)
      .run();
    return true;
  }
  if (row.count >= max) return false;
  await env.DB.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").bind(key).run();
  return true;
}

async function sendMagicMail(env, email, url) {
  if (!env.RESEND_API_KEY) {
    console.log(JSON.stringify({ magic_link: url, email }));
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "The Call <login@scopethecall.com>",
      to: [email],
      subject: "Log in to The Call",
      text: `Open this link to log in. It expires in 20 minutes.\n\n${url}\n\nIf you did not ask for this, ignore it.`
    })
  });
  return res.ok;
}

function stripExif(bytes, type) {
  if (type === "image/jpeg") return stripJpegExif(bytes);
  if (type === "image/png") return stripPngExif(bytes);
  return bytes;
}

function stripJpegExif(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return bytes;
  const out = [0xff, 0xd8];
  let i = 2;
  while (i + 3 < bytes.length) {
    if (bytes[i] !== 0xff) break;
    const marker = bytes[i + 1];
    if (marker === 0xda) {
      for (let j = i; j < bytes.length; j += 1) out.push(bytes[j]);
      return new Uint8Array(out);
    }
    if (marker === 0xd9) {
      out.push(0xff, 0xd9);
      return new Uint8Array(out);
    }
    const size = (bytes[i + 2] << 8) + bytes[i + 3];
    const next = i + 2 + size;
    if (marker === 0xe1) {
      i = next;
      continue;
    }
    for (let j = i; j < next && j < bytes.length; j += 1) out.push(bytes[j]);
    i = next;
  }
  while (i < bytes.length) out.push(bytes[i++]);
  return new Uint8Array(out);
}

function stripPngExif(bytes) {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i += 1) if (bytes[i] !== sig[i]) return bytes;
  const out = Array.from(bytes.slice(0, 8));
  let i = 8;
  while (i + 8 <= bytes.length) {
    const len = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
    const type = String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
    const next = i + 12 + len;
    if (type !== "eXIf") {
      for (let j = i; j < next && j < bytes.length; j += 1) out.push(bytes[j]);
    }
    i = next;
    if (type === "IEND") break;
  }
  return new Uint8Array(out);
}

function sessionCookie(value, request, maxAge) {
  const secure = new URL(request.url).protocol === "https:";
  const parts = [
    `${COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Math.floor(maxAge))}`
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function cookieValue(request, name) {
  const header = request.headers.get("Cookie") || "";
  const parts = header.split(";");
  for (const part of parts) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

function cors(response, request, extra) {
  const origin = request.headers.get("Origin") || "";
  const headers = extra || response.headers;
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Vary", "Origin");
  }
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  if (extra) {
    response.headers.forEach((value, key) => {
      if (!headers.has(key)) headers.set(key, value);
    });
    return new Response(response.body, { status: response.status, headers });
  }
  return response;
}

function json(data, status, request, extraHeaders) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (extraHeaders) Object.entries(extraHeaders).forEach(([key, value]) => headers.set(key, value));
  return cors(new Response(JSON.stringify(data), { status, headers }), request);
}

function apiOrigin(request) {
  return new URL(request.url).origin;
}

function appOrigin(env, request) {
  const origin = request.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) return origin;
  const referer = request.headers.get("Referer") || "";
  try {
    const fromRef = new URL(referer).origin;
    if (ALLOWED_ORIGINS.includes(fromRef)) return fromRef;
  } catch {
    /* ignore */
  }
  return env.APP_ORIGIN || "https://scopethecall.com";
}

function normalizeEmail(value) {
  const email = String(value || "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email.slice(0, 200);
}

function truthy(value) {
  const text = String(value || "").toLowerCase();
  return text === "on" || text === "true" || text === "1" || text === "yes";
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function clamp(n, min, max) {
  const value = Number(n);
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function safeJson(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
