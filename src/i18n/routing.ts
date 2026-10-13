import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { enabledLocales, resolveFallbackLocale } from "./config";

export const routing = defineRouting({
  locales: enabledLocales(),
  defaultLocale: resolveFallbackLocale(),
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
