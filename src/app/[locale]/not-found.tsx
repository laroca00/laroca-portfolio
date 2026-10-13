import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <main id="main" className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="font-mono text-sm text-[var(--color-terminal,#7CFF9B)]">$ 404</p>
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="max-w-md opacity-70">{t("description")}</p>
      <Link href="/" className="underline underline-offset-4">
        {t("back")}
      </Link>
    </main>
  );
}
