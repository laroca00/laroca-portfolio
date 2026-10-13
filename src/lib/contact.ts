import { z } from "zod";

export type ContactField = "name" | "email" | "message";
export type ContactState = {
  status: "idle" | "success" | "invalid" | "rate_limited" | "error";
  fieldErrors?: Partial<Record<ContactField, string>>;
};

export type SendArgs = { from: string; to: string; replyTo: string; subject: string; text: string };

export type ContactDeps = {
  ip: string;
  apiKey: string | undefined;
  to: string;
  from: string;
  limiter: { hit(key: string): boolean };
  send: (args: SendArgs, apiKey: string) => Promise<{ error?: unknown }>;
};

/** Error values are message keys under `Contact.errors` in messages/<locale>.json. */
const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(80, "name"),
  email: z.email("email"),
  message: z.string().trim().min(10, "message").max(5000, "message"),
});

export async function handleContact(formData: FormData, deps: ContactDeps): Promise<ContactState> {
  // Honeypot: real people never see or fill this field. Pretend it worked.
  if (String(formData.get("company") ?? "").trim() !== "") return { status: "success" };

  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: String(formData.get("email") ?? "").trim(),
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "invalid", fieldErrors };
  }

  if (!deps.limiter.hit(deps.ip)) return { status: "rate_limited" };
  if (!deps.apiKey) return { status: "error" };

  const { name, email, message } = parsed.data;
  try {
    const { error } = await deps.send(
      {
        from: deps.from,
        to: deps.to,
        replyTo: email,
        subject: `Portfolyo iletişim: ${name}`,
        text: `${name} <${email}>\n\n${message}`,
      },
      deps.apiKey,
    );
    return error ? { status: "error" } : { status: "success" };
  } catch {
    return { status: "error" };
  }
}
