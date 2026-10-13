import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { CommandPaletteLauncher } from "@/components/command/CommandPaletteLauncher";
import { Footer } from "@/components/layout/Footer";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Nav } from "@/components/layout/Nav";
import { getProfile, getProjects } from "@/content/load";
import { enabledLocales, isEnabledLocale } from "@/i18n/config";
import { personJsonLd, alternatesFor } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });

export function generateStaticParams() {
  return enabledLocales().map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t("title"), template: "%s · LaRoca" },
    description: t("description"),
    alternates: alternatesFor(locale, ""),
    openGraph: { type: "website", siteName: "LaRoca", locale },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [messages, profile, projects, t] = await Promise.all([
    getMessages({ locale }),
    getProfile(locale),
    getProjects(locale),
    getTranslations({ locale, namespace: "A11y" }),
  ]);

  return (
    <html lang={locale} className={`${geistSans.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="sr-only z-50 rounded-md bg-text px-3 py-2 text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-2"
          >
            {t("skip")}
          </a>
          <Nav languageSwitcher={<LanguageSwitcher locales={enabledLocales()} current={locale} />} />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
            {children}
          </main>
          <Footer profile={profile} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(profile)).replace(/</g, "\u003c") }}
          />
          <CommandPaletteLauncher
            projects={projects.map(({ slug, title }) => ({ slug, title }))}
            email={profile.email}
            locales={enabledLocales()}
          />
        </NextIntlClientProvider>
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
