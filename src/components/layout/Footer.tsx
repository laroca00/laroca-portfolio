import { getTranslations } from "next-intl/server";
import type { Profile } from "@/content/schema";
import { Container } from "./Container";

async function buildYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer({ profile }: { profile: Profile }) {
  const t = await getTranslations("Footer");
  const year = await buildYear();
  return (
    <footer className="theme-night mt-auto border-t border-border py-10 font-mono text-sm text-muted">
      <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} LaRoca Dev — {profile.name}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {profile.socials.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-text">
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${profile.email}`} className="hover:text-text">
              {t("email")}
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
