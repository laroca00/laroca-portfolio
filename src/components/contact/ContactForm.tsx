"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { sendContact } from "@/app/[locale]/contact/actions";
import type { ContactField, ContactState } from "@/lib/contact";

const INITIAL: ContactState = { status: "idle" };

const inputClass =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-base text-text placeholder:text-muted/70 transition-colors focus:border-link focus:outline-none aria-[invalid=true]:border-accent-red";

export function ContactForm({ email }: { email: string }) {
  const t = useTranslations("Contact");
  const [state, action, pending] = useActionState(sendContact, INITIAL);
  const error = (field: ContactField) => state.fieldErrors?.[field];

  const field = (name: ContactField, input: React.ReactNode) => (
    <div className="flex flex-col gap-2 text-left">
      <label htmlFor={`contact-${name}`} className="text-sm text-muted">
        {t(`fields.${name}`)}
      </label>
      {input}
      {error(name) && (
        <p id={`contact-${name}-error`} className="text-sm text-accent-red">
          {t(`errors.${name}`)}
        </p>
      )}
    </div>
  );

  const aria = (name: ContactField) => ({
    id: `contact-${name}`,
    name,
    required: true,
    "aria-invalid": !!error(name),
    "aria-describedby": error(name) ? `contact-${name}-error` : undefined,
  });

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-[28px] bg-surface p-8 text-lg">
        {t("success")}
      </p>
    );
  }

  return (
    <form action={action} noValidate className="grid w-full gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        {field("name", <input {...aria("name")} autoComplete="name" className={inputClass} />)}
        {field("email", <input {...aria("email")} type="email" autoComplete="email" className={inputClass} />)}
      </div>
      {field("message", <textarea {...aria("message")} rows={6} className={`${inputClass} resize-y`} />)}

      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-text px-8 py-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending ? t("sending") : t("submit")}
        </button>
        <p aria-live="polite" className="min-h-6 text-center text-sm">
          {state.status === "rate_limited" && <span className="text-accent-amber">{t("rateLimited")}</span>}
          {state.status === "error" && (
            <span className="text-accent-red">
              {t("error")}{" "}
              <a href={`mailto:${email}`} className="text-link underline">
                {email}
              </a>
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
