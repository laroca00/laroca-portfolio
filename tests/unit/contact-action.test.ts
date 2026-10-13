import { beforeEach, expect, test } from "vitest";
import { handleContact, type ContactDeps, type SendArgs } from "@/lib/contact";
import { createRateLimiter } from "@/lib/rate-limit";

let sent: SendArgs[];
let deps: ContactDeps;

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const VALID = { name: "Ayşe", email: "a@b.co", message: "Merhaba, bir projem var." };

beforeEach(() => {
  sent = [];
  deps = {
    ip: "1.2.3.4",
    apiKey: "re_test",
    to: "tugberkakkrt@gmail.com",
    from: "LaRoca <onboarding@resend.dev>",
    limiter: createRateLimiter({ limit: 5, windowMs: 600_000 }),
    send: async (args) => {
      sent.push(args);
      return {};
    },
  };
});

test("valid submission sends to CONTACT_TO_EMAIL with reply-to", async () => {
  const s = await handleContact(form(VALID), deps);
  expect(s.status).toBe("success");
  expect(sent).toHaveLength(1);
  expect(sent[0]).toMatchObject({ to: "tugberkakkrt@gmail.com", replyTo: "a@b.co", from: deps.from });
  expect(sent[0].text).toContain("Merhaba, bir projem var.");
});

test("honeypot filled → success, nothing sent", async () => {
  const s = await handleContact(form({ ...VALID, company: "spam inc" }), deps);
  expect(s.status).toBe("success");
  expect(sent).toHaveLength(0);
});

test("invalid email → invalid with fieldErrors.email", async () => {
  const s = await handleContact(form({ ...VALID, email: "nope" }), deps);
  expect(s.status).toBe("invalid");
  expect(s.fieldErrors?.email).toBeTruthy();
  expect(sent).toHaveLength(0);
});

test("too-short message and name → invalid with both field errors", async () => {
  const s = await handleContact(form({ name: "A", email: "a@b.co", message: "kısa" }), deps);
  expect(s.status).toBe("invalid");
  expect(Object.keys(s.fieldErrors ?? {}).sort()).toEqual(["message", "name"]);
});

test("6th submission from same IP within 10 min → rate_limited", async () => {
  for (let i = 0; i < 5; i++) expect((await handleContact(form(VALID), deps)).status).toBe("success");
  expect((await handleContact(form(VALID), deps)).status).toBe("rate_limited");
  expect(sent).toHaveLength(5);
});

test("missing RESEND_API_KEY → error, no throw", async () => {
  const s = await handleContact(form(VALID), { ...deps, apiKey: undefined });
  expect(s.status).toBe("error");
  expect(sent).toHaveLength(0);
});

test("provider returns error → error", async () => {
  const s = await handleContact(form(VALID), { ...deps, send: async () => ({ error: { message: "boom" } }) });
  expect(s.status).toBe("error");
});

test("provider throws → error, no throw", async () => {
  const s = await handleContact(form(VALID), {
    ...deps,
    send: async () => {
      throw new Error("network");
    },
  });
  expect(s.status).toBe("error");
});
