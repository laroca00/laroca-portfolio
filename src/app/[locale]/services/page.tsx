import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Testimonials } from "@/components/home/Testimonials";
import { getServices, getTestimonials } from "@/content/load";
import { isEnabledLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Services" });
  return { title: t("title"), description: t("intro") };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [services, testimonials] = await Promise.all([getServices(locale), getTestimonials(locale)]);

  return (
    <>
      <ServicesSection services={services} headingLevel={1} />
      <Testimonials items={testimonials} />
    </>
  );
}
