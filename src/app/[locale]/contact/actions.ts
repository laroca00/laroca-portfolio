"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { handleContact, type ContactState } from "@/lib/contact";
import { createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return handleContact(formData, {
    ip,
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.CONTACT_TO_EMAIL ?? "tugberkakkrt@gmail.com",
    from: process.env.CONTACT_FROM_EMAIL ?? "LaRoca <onboarding@resend.dev>",
    limiter,
    send: async (args, apiKey) => {
      const { error } = await new Resend(apiKey).emails.send(args);
      return { error: error ?? undefined };
    },
  });
}
