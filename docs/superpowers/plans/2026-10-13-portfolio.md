# LaRoca Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Tuğberk Emre Akkurt's ("LaRoca") dark, Apple-product-page-style developer portfolio with 4-locale infrastructure (TR content only for now), MDX projects/blog, contact form, ⌘K palette, deployed on Vercel.

**Architecture:** Next.js 16 App Router, fully static where possible (SSG via `generateStaticParams`), all routes under `src/app/[locale]/`. Locale routing by next-intl in `src/proxy.ts`, gated by a hand-edited `enabled` flag per locale. All content lives in `content/<locale>/` as MDX/JSON, loaded by a small typed loader (gray-matter + zod + next-mdx-remote/rsc) that fails the build on invalid content.

**Tech Stack:** Next.js 16.4, React 19.3, TypeScript (strict), Tailwind CSS 4.3, next-intl 4, Motion 14, cmdk 1, zod 4, gray-matter, next-mdx-remote 6 (RSC), shiki 4 (via rehype-pretty-code), resend 6, @vercel/analytics 2, geist font. Tests: Vitest 5 + @testing-library/react, Playwright 1.64 (+ @axe-core/playwright). Package manager: npm.

**Spec:** `docs/superpowers/specs/2026-10-13-portfolio-design.md` (Turkish). Executors read both.

## Global Constraints

- Locales: `tr`, `en`, `de`, `it`. URL prefix always present (`/tr/...`). Path segments are English and identical across locales: `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/about`, `/services`. Slugs identical across locales.
- Initially only `tr` is `enabled`. A disabled locale's every URL returns 404 and appears nowhere (switcher, sitemap, hreflang).
- First-visit redirect: browser language if enabled; else `en` if enabled; else first enabled locale (today: `tr`). User choice remembered (next-intl locale cookie).
- All visible copy written in Turkish only; realistic Turkish placeholder text. Real project names/links: Green Future Balcony → `https://greenfuturebalcony.com`; EmpowerEU → `https://empoweringadultswithdisabilities.com`; Sırpça öğrenme uygulaması, Online Pişti (React Native, Play Store link TBD = omit link), Akgün websitesi, 3DCare (links TBD = omit link).
- Visual: dark theme only, near-black background, Apple-style large tight sans (Geist), gradient headlines, terminal accents (Geist Mono, green `#7CFF9B`). Must NOT look like light editorial/serif or Y2K/sticker style.
- Every animation respects `prefers-reduced-motion` (disabled, content fully visible). Content must be visible without JS.
- Contact recipient: `tugberkakkrt@gmail.com` (env `CONTACT_TO_EMAIL`). Domain: `laroca.studio` (env `NEXT_PUBLIC_SITE_URL`, default `http://localhost:3000`); nothing hardcodes the domain.
- Hosting: Vercel Hobby. No database, no paid services. Analytics: `@vercel/analytics` only, no cookie banner.
- GitHub username: `laroca00`. Terminal card never shows private repo data and never renders empty.
- Quality: Lighthouse mobile ≥95 in all four categories on `/tr` and one project page; full keyboard navigation; no horizontal scroll at 360px width.
- No app legal pages (privacy/account deletion) — explicitly out of scope.

## Review Focus

1. **Invalid content file** (missing required frontmatter field, unknown accent color, bad date): build/test must fail naming the file path and field, not render a broken page → test in Task 3.
2. **Locale enabled before translation is complete / disabled locale with files present**: `npm run check:content` warns per missing UI key or project for each enabled locale; `/de/...` stays 404 even if `content/de/` exists → tests in Tasks 2 and 3.
3. **GitHub API failure** (403 rate limit, network error, malformed JSON) **or zero public events** (the real current state): terminal card shows changelog entries, never empty, never throws → test in Task 8.
4. **Contact form abuse/failure**: honeypot filled → fake success, no email; >5 submissions per IP per 10 min → rate-limit message; missing `RESEND_API_KEY` or Resend error → friendly error with mailto fallback, no crash → tests in Task 11.
5. **Reduced motion / no JS**: project showcase sections and hero text fully visible (not stuck at opacity 0 or half-typed) → Playwright test in Task 7.

---

## File Structure

```
content/
  tr/
    profile.json            # name, tagline, bio, email, socials, openToWork, stats
    services.json           # Service[]
    testimonials.json       # Testimonial[]
    experience.json         # ExperienceItem[]
    changelog.json          # ChangelogEntry[] (terminal card fallback)
    projects/<slug>.mdx     # 6 projects
    blog/<slug>.mdx         # 2 placeholder posts
messages/tr.json            # UI strings (next-intl)
public/cv/tr.pdf            # placeholder CV
src/
  proxy.ts                  # next-intl locale routing (Next 16 "middleware")
  i18n/config.ts            # LOCALES, LOCALE_ENABLED, enabledLocales(), resolveFallbackLocale()
  i18n/routing.ts           # next-intl defineRouting + navigation helpers
  i18n/request.ts           # next-intl getRequestConfig
  content/schema.ts         # zod schemas + inferred types
  content/load.ts           # typed loaders (server-only)
  content/mdx.tsx           # renderMdx() with rehype-pretty-code + custom components
  lib/github.ts             # getTerminalLines()
  lib/rate-limit.ts         # in-memory sliding window
  lib/site.ts               # siteUrl(), absoluteUrl()
  app/[locale]/layout.tsx, page.tsx, not-found.tsx
  app/[locale]/projects/page.tsx, projects/[slug]/page.tsx
  app/[locale]/blog/page.tsx, blog/[slug]/page.tsx
  app/[locale]/about/page.tsx, services/page.tsx
  app/[locale]/contact/actions.ts   # sendContact server action
  app/sitemap.ts, app/robots.ts
  app/[locale]/opengraph-image.tsx, projects/[slug]/opengraph-image.tsx, blog/[slug]/opengraph-image.tsx
  components/layout/{Nav,Footer,Container,LanguageSwitcher}.tsx
  components/home/{Hero,TypedLine,ProjectShowcase,Bento,TerminalCard,ServicesSection,Testimonials,LatestPosts}.tsx
  components/contact/ContactForm.tsx
  components/command/CommandPalette.tsx
  components/motion/Reveal.tsx
scripts/check-content.ts
tests/unit/**  (Vitest)   tests/e2e/** (Playwright)   tests/fixtures/content/**
```

---

### Task 1: Scaffold, tooling, git

**Files:**
- Create: project via create-next-app in the repo root (keep existing `CLAUDE.md`, `.claude/`, `docs/`, `skills-lock.json`)
- Create: `vitest.config.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `.gitignore` (add `.superpowers/`, `.env*.local`, `test-results/`, `playwright-report/`)

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `test:e2e` (`playwright test`), `check:content` (added in Task 3). Path alias `@/*` → `src/*`.

- [ ] **Step 1:** `git init`. Scaffold in a temp dir and move into the root (create-next-app refuses non-empty dirs): `npx create-next-app@16.4.0 _scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes`; move `_scaffold/*` (incl. dotfiles, excluding `.git`) to root; delete `_scaffold`. Merge, don't overwrite, any existing root file (`.gitignore`). Commit the existing `CLAUDE.md`, `docs/`, `.claude/`, `skills-lock.json` in this first commit too.
- [ ] **Step 2:** Install dev deps: `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test @axe-core/playwright tsx`; `npx playwright install chromium`. Configure Vitest (jsdom, `@` alias, setup file importing jest-dom). Configure Playwright: `webServer: npm run build && npm run start`, port 3000, chromium + a mobile project (Pixel 7).
- [ ] **Step 3: Write smoke tests** — `tests/unit/smoke.test.ts`: `expect(1+1).toBe(2)`; `tests/e2e/smoke.spec.ts`: `GET /` returns status < 400.
- [ ] **Step 4:** Run `npm run lint && npm run typecheck && npm test && npm run test:e2e` → all PASS.
- [ ] **Step 5: Commit** `chore: scaffold Next.js 16 app with Vitest and Playwright`.

---

### Task 2: Locale config and routing

**Files:**
- Create: `src/i18n/config.ts`, `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/proxy.ts`, `messages/tr.json`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (temporary "LaRoca" heading), `src/app/[locale]/not-found.tsx`, `src/app/[locale]/[...rest]/page.tsx` (calls `notFound()`)
- Delete: scaffolded `src/app/page.tsx`; move root `layout.tsx` responsibilities into `[locale]/layout.tsx` (`<html lang={locale}>`)
- Test: `tests/unit/i18n-config.test.ts`, `tests/e2e/locale-routing.spec.ts`

**Interfaces:**
- Produces:
  - `type Locale = 'tr' | 'en' | 'de' | 'it'`; `const LOCALES: readonly Locale[]`
  - `const LOCALE_ENABLED: Record<Locale, boolean>` — `{ tr: true, en: false, de: false, it: false }` (the one switch Tuğberk edits)
  - `enabledLocales(flags = LOCALE_ENABLED): Locale[]` (order of `LOCALES`)
  - `resolveFallbackLocale(flags = LOCALE_ENABLED): Locale` — `en` if enabled else first enabled
  - `isEnabledLocale(x: string): x is Locale`
  - `routing` (next-intl `defineRouting({ locales: enabledLocales(), defaultLocale: resolveFallbackLocale(), localePrefix: 'always' })`) and `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `createNavigation(routing)` in `src/i18n/routing.ts`
  - `LOCALE_LABELS: Record<Locale, string>` = `{ tr: 'Türkçe', en: 'English', de: 'Deutsch', it: 'Italiano' }`

- [ ] **Step 1: Write the failing unit tests**

```ts
test('only enabled locales are returned, in LOCALES order', () => {
  expect(enabledLocales({ tr: true, en: false, de: true, it: false })).toEqual(['tr', 'de']);
});
test('fallback prefers en when enabled', () => {
  expect(resolveFallbackLocale({ tr: true, en: true, de: false, it: false })).toBe('en');
});
test('fallback is first enabled when en disabled', () => {
  expect(resolveFallbackLocale({ tr: true, en: false, de: false, it: false })).toBe('tr');
});
test('throws when no locale enabled', () => {
  expect(() => resolveFallbackLocale({ tr: false, en: false, de: false, it: false })).toThrow(/no locale enabled/i);
});
```

- [ ] **Step 2:** `npx vitest run tests/unit/i18n-config.test.ts` → FAIL (module missing).
- [ ] **Step 3:** Implement `src/i18n/config.ts`, routing, request config (loads `messages/${locale}.json`), `src/proxy.ts` (next-intl `createMiddleware(routing)`, matcher excludes `api`, `_next`, `_vercel`, files with a dot). `[locale]/layout.tsx`: `generateStaticParams` from `enabledLocales()`, `notFound()` if `!isEnabledLocale(locale)` or not enabled, `setRequestLocale(locale)`, `NextIntlClientProvider`.
- [ ] **Step 4:** Unit tests PASS.
- [ ] **Step 5: Write e2e tests** (`tests/e2e/locale-routing.spec.ts`):
  - `/` with `Accept-Language: de-DE` → final URL `/tr`, status 200 (de disabled).
  - `/` with `Accept-Language: tr-TR` → `/tr`.
  - `/de`, `/en/projects`, `/it/blog/x` → status 404.
  - `/tr/does-not-exist` → 404 and page contains Turkish not-found text from `messages/tr.json` (`NotFound.title` = `"Sayfa bulunamadı"`).
  - `<html lang="tr">` on `/tr`.
- [ ] **Step 6:** `npm run test:e2e -- locale-routing` → PASS.
- [ ] **Step 7: Commit** `feat(i18n): locale routing gated by enabled flags`.

---

### Task 3: Content schema, loader, and content check

**Files:**
- Create: `src/content/schema.ts`, `src/content/load.ts`, `src/content/mdx.tsx`, `scripts/check-content.ts`
- Create fixtures: `tests/fixtures/content/{valid,invalid}/tr/...`
- Test: `tests/unit/content-load.test.ts`, `tests/unit/check-content.test.ts`
- Modify: `package.json` (`"check:content": "tsx scripts/check-content.ts"`, `"prebuild": "npm run check:content"`)

**Interfaces:**
- Produces (all loaders take `locale: Locale` and optional `root = path.join(process.cwd(), 'content')`; `import 'server-only'` in `load.ts`):
  - `Accent = 'green' | 'teal' | 'blue' | 'violet' | 'red' | 'amber'`
  - `Project` frontmatter: `{ slug: string (from filename), title: string, tagline: string, label: string, category: 'web'|'mobile'|'game'|'backend', stack: string[], accent: Accent, featured: boolean, order: number, liveUrl?: url, storeUrl?: url, repoUrl?: url, cover?: string, year: number }` + `body: string`
  - `Post`: `{ slug, title, description, date: Date (from 'YYYY-MM-DD'), tags: string[], draft: boolean }` + `body`, `readingMinutes: number` (words/200, ceil, min 1)
  - `Profile`: `{ name, handle: 'LaRoca', tagline, bio, email, location, openToWork: boolean, socials: {label, url}[], stats: {value: string, label: string}[], stack: string[] }`
  - `Service`: `{ title, description, icon: string }`; `Testimonial`: `{ quote, author, role, org }`; `ExperienceItem`: `{ start: 'YYYY-MM', end?: 'YYYY-MM', title, org, description, kind: 'work'|'education' }`; `ChangelogEntry`: `{ date: 'YYYY-MM-DD', message: string }`
  - `getProjects(locale): Promise<Project[]>` sorted by `order` asc; `getProject(locale, slug): Promise<Project | null>`; `getPosts(locale): Promise<Post[]>` (drafts excluded in production, date desc); `getPost(locale, slug)`; `getProfile`, `getServices`, `getTestimonials`, `getExperience` (start desc), `getChangelog` (date desc).
  - `ContentError extends Error` with `file: string` and message `"<relative file>: <zod issue path>: <message>"`.
  - `renderMdx(source: string): Promise<ReactElement>` — next-mdx-remote/rsc `compileMDX` with `rehype-pretty-code` (theme `github-dark-dimmed`) and components `{ a: external links get target=_blank rel="noopener noreferrer", img: next/image wrapper }`.
  - `checkContent(root, flags): { warnings: string[] }` — for each enabled locale ≠ `tr`, compares against `tr`: missing message keys (deep), missing project slugs, missing JSON files. Blog exempt. Prints warnings, exits 0; exits 1 only on `ContentError`.

- [ ] **Step 1: Write failing tests** (`content-load.test.ts`, using fixtures root):

```ts
test('loads and sorts projects by order', async () => {
  const p = await getProjects('tr', VALID);
  expect(p.map(x => x.slug)).toEqual(['alpha', 'beta']);
  expect(p[0].accent).toBe('green');
});
test('getProject returns null for unknown slug', async () => {
  expect(await getProject('tr', 'nope', VALID)).toBeNull();
});
test('invalid frontmatter throws ContentError naming file and field', async () => {
  await expect(getProjects('tr', INVALID)).rejects.toThrow(/projects[\\/]broken\.mdx: accent/);
});
test('reading time is ceil(words/200), min 1', async () => {
  const [post] = await getPosts('tr', VALID);
  expect(post.readingMinutes).toBe(2); // fixture body has 201 words
});
```

`check-content.test.ts`:

```ts
test('warns about missing keys and projects for enabled non-tr locale', () => {
  const { warnings } = checkContent(FIXTURE_WITH_PARTIAL_EN, { tr: true, en: true, de: false, it: false });
  expect(warnings).toContain('en: missing message key "Hero.title"');
  expect(warnings).toContain('en: missing project "beta"');
  expect(warnings.some(w => w.startsWith('de:'))).toBe(false);
  expect(warnings.some(w => w.includes('blog'))).toBe(false);
});
```

- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement schema, loaders, `renderMdx`, `checkContent` + CLI wrapper.
- [ ] **Step 4:** Run → PASS. `npm run typecheck` PASS.
- [ ] **Step 5: Commit** `feat(content): typed MDX/JSON content loader with validation`.

---

### Task 4: Seed Turkish placeholder content

**Files:**
- Create: everything under `content/tr/` per File Structure; `public/cv/tr.pdf` (one-page placeholder, "CV yakında" — generate with any tool, < 50 KB); `public/projects/<slug>/cover.webp` placeholders (solid accent-gradient images, 1600×1000, < 60 KB each)
- Test: `tests/unit/seed-content.test.ts`

Project seeds (slug → accent, category, featured, order):
`green-future-balcony` green/web/featured/1 (label "Erasmus+ · 4 ülke", liveUrl greenfuturebalcony.com), `empower-eu` violet/web/featured/2 (label "Erasmus+ · Erişilebilirlik", liveUrl empoweringadultswithdisabilities.com), `online-pisti` red/game/featured/3 (label "React Native · Çok oyunculu"), `sirpca-ogren` blue/mobile/featured/4 (label "React Native · Dil öğrenme"), `akgun` amber/web/not featured/5, `3dcare` teal/web/not featured/6. Each MDX body: placeholder case study with headings `## Problem`, `## Çözüm`, `## Teknik detaylar`, `## Sonuç`, each with 1–2 sentences marked by a leading `<!-- TODO: Tuğberk -->` comment.
Profile: name "Tuğberk Emre Akkurt", handle "LaRoca", email `tugberkakkrt@gmail.com`, socials: GitHub `https://github.com/laroca00` (others empty placeholders omitted), `openToWork: true`, stats e.g. `{value:"2", label:"Erasmus+ projesi"}`, `{value:"7", label:"partner ülke"}`, `{value:"2", label:"mobil uygulama"}`.
Changelog: ≥5 entries describing the real projects (e.g. "empower-eu yayına alındı").

- [ ] **Step 1: Write failing test**

```ts
test('seed content is valid and complete', async () => {
  const projects = await getProjects('tr');
  expect(projects).toHaveLength(6);
  expect(projects.filter(p => p.featured).map(p => p.slug))
    .toEqual(['green-future-balcony', 'empower-eu', 'online-pisti', 'sirpca-ogren']);
  expect((await getProfile('tr')).email).toBe('tugberkakkrt@gmail.com');
  expect((await getChangelog('tr')).length).toBeGreaterThanOrEqual(5);
  expect((await getPosts('tr')).length).toBe(2);
});
```

- [ ] **Step 2:** Run → FAIL. **Step 3:** Write the content. **Step 4:** Run → PASS; `npm run check:content` → 0 warnings.
- [ ] **Step 5: Commit** `content: seed Turkish placeholder content`.

---

### Task 5: Design tokens and layout shell

**Files:**
- Modify: `src/app/globals.css` (Tailwind v4 `@theme` tokens), `src/app/[locale]/layout.tsx`
- Create: `src/components/layout/{Container,Nav,Footer}.tsx`, `src/components/motion/Reveal.tsx`, `src/lib/site.ts`
- Test: `tests/unit/nav.test.tsx`, `tests/e2e/shell.spec.ts`

**Interfaces:**
- Produces:
  - CSS tokens: `--color-bg #000`, `--color-surface #1c1c1e`, `--color-surface-2 #2c2c2e`, `--color-border rgb(255 255 255 / .08)`, `--color-text #f5f5f7`, `--color-muted #8e8e93`, `--color-terminal #7CFF9B`, `--color-link #2997ff`, accent tokens `--color-accent-{green,teal,blue,violet,red,amber}`; utility class `.text-gradient` (white → #8e8e93 vertical). Fonts: `GeistSans` → `--font-sans`, `GeistMono` → `--font-mono`.
  - `<Container>` (max-w 1200px, 16px side gutter on mobile, 24px ≥md).
  - `<Reveal as? delay?>` — client component; Motion `whileInView` fade+translateY(24px). Must render children visible when reduced motion is on **and** in SSR HTML (use `initial={false}` when `useReducedMotion()`; and gate hidden initial state behind a `data-js` attribute set on `<html>` by an inline script, so no-JS shows content).
  - `siteUrl(): string` (`NEXT_PUBLIC_SITE_URL` without trailing slash, default `http://localhost:3000`), `absoluteUrl(path): string`.
  - Nav items (labels from `messages/tr.json` `Nav.*`): Projeler `/projects`, Hakkımda `/about`, Hizmetler `/services`, Blog `/blog`, İletişim `/#contact`; right side: ⌘K button (Task 12 wires it; emits `window.dispatchEvent(new Event('open-command-palette'))`) and LanguageSwitcher slot (Task 13).
  - Footer: "© {year} LaRoca Dev — Tuğberk Emre Akkurt", GitHub link, email.

- [ ] **Step 1: Write failing test** `nav.test.tsx`: renders Nav within NextIntl provider with tr messages; expects links named Projeler, Hakkımda, Hizmetler, Blog, İletişim with hrefs `/tr/projects`, `/tr/about`, `/tr/services`, `/tr/blog`, `/tr#contact`; expects a button with accessible name matching `/komut paleti/i`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5: e2e** `shell.spec.ts`: at 360×740 viewport `document.documentElement.scrollWidth <= 360` on `/tr`; skip-to-content link is the first Tab stop and moves focus to `#main`; body background computed `rgb(0, 0, 0)`.
- [ ] **Step 6:** PASS. **Step 7: Commit** `feat(ui): design tokens, nav, footer, reveal primitive`.

---

### Task 6: Hero

**Files:**
- Create: `src/components/home/Hero.tsx`, `src/components/home/TypedLine.tsx`
- Modify: `src/app/[locale]/page.tsx`, `messages/tr.json` (`Hero.eyebrow`, `Hero.title` = `"Fikirden ürüne.\nHer katmanda."`, `Hero.subtitle`, `Hero.terminal` = `"mobile · web · backend · games"`, `Hero.ctaProjects` = `"Projeleri gör"`, `Hero.ctaContact` = `"İletişime geç"`)
- Test: `tests/unit/typed-line.test.tsx`

**Interfaces:**
- Produces: `<TypedLine text: string, prompt?: string = '$', speedMs?: number = 45 />` — client; types characters with blinking cursor; full text present in SSR markup via `aria-label={text}` and a visually-hidden copy; reduced motion → renders full text immediately.

- [ ] **Step 1: Failing test:** with `matchMedia('(prefers-reduced-motion: reduce)')` mocked true, `TypedLine` renders visible text `"mobile · web · backend · games"` on first render; with it false and fake timers, after `45 * text.length` ms the full text is visible.
- [ ] **Step 2:** FAIL. **Step 3:** Implement Hero (full-viewport height `min-h-[100svh]`, centered, `.text-gradient` title at `clamp(2.75rem, 8vw, 6rem)`, tracking `-0.03em`; TypedLine in mono green; two CTAs; `openToWork` pill from profile). **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat(home): hero with typed terminal line`.

---

### Task 7: Project showcase sections

**Files:**
- Create: `src/components/home/ProjectShowcase.tsx`
- Modify: `src/app/[locale]/page.tsx`, `messages/tr.json` (`Showcase.readCase` = `"Vaka çalışmasını oku"`, `Showcase.visit` = `"Siteye git"`, `Showcase.store` = `"Play Store'da gör"`)
- Test: `tests/unit/project-showcase.test.tsx`, `tests/e2e/reduced-motion.spec.ts`

**Interfaces:**
- Consumes: `getProjects`, `Project`, `Reveal`.
- Produces: `<ProjectShowcase projects: Project[] />` (server component; renders only `featured`), each a full-viewport `<section aria-labelledby>` with label (accent-colored), `h2` title, tagline, links, and cover image inside a device-like frame with accent glow (`box-shadow` using the project's accent token). Scroll-linked scale/opacity of the cover via Motion `useScroll` in a small client child; disabled under reduced motion.

- [ ] **Step 1: Failing unit test:** given seed-like projects, renders 4 sections in order; Green Future section has link "Vaka çalışmasını oku" → `/tr/projects/green-future-balcony` and link "Siteye git" → `https://greenfuturebalcony.com` with `target="_blank"` and `rel` containing `noopener`; project without `liveUrl`/`storeUrl` renders only the case-study link; non-featured `akgun` not rendered.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: e2e** `reduced-motion.spec.ts`: two contexts — `reducedMotion: 'reduce'` and `javaScriptEnabled: false` — on `/tr`, scroll to each showcase `h2`; assert `toBeVisible()` and computed opacity of its section's cover `=== '1'`; hero title visible and TypedLine text present.
- [ ] **Step 6:** PASS. **Step 7: Commit** `feat(home): Apple-style project showcase`.

---

### Task 8: Bento grid and GitHub terminal card

**Files:**
- Create: `src/lib/github.ts`, `src/components/home/Bento.tsx`, `src/components/home/TerminalCard.tsx`
- Modify: `src/app/[locale]/page.tsx`, `messages/tr.json` (`Bento.*`, `Terminal.command` = `"git log --oneline"`)
- Test: `tests/unit/github.test.ts`, `tests/unit/bento.test.tsx`

**Interfaces:**
- Produces:
  - `type TerminalLine = { date: string /* YYYY-MM-DD */; message: string; source: 'github' | 'changelog' }`
  - `getTerminalLines(opts: { username: string; fallback: ChangelogEntry[]; limit?: number = 5; fetchImpl?: typeof fetch }): Promise<TerminalLine[]>` — fetches `https://api.github.com/users/${username}/events/public?per_page=30` with `next: { revalidate: 3600 }` and `Accept: application/vnd.github+json`; maps `PushEvent` commits to `"<repo-name>: <first line of commit message>"` (truncate 72 chars); only events where `public === true`; if result empty or any error/non-2xx/invalid JSON → `fallback` mapped to `source: 'changelog'`; never throws; never returns empty if `fallback` non-empty.
  - `<Bento profile: Profile, terminalLines: TerminalLine[] />`: grid (desktop 4 cols, mobile 1 col): intro card (name, bio, "● Yeni projelere açık" if `openToWork`, green dot), TerminalCard (mono, `~/laroca $ git log --oneline` then lines, blinking cursor), stack card (profile.stack chips), stats cards (profile.stats), wide card linking to `/about`.

- [ ] **Step 1: Failing tests** (`github.test.ts`, inject `fetchImpl`):

```ts
test('maps public PushEvents to lines', async () => {
  const lines = await getTerminalLines({ username: 'laroca00', fallback: FALLBACK, fetchImpl: ok([pushEvent('laroca00/pisti', 'fix: deal order\n\nlong body')]) });
  expect(lines[0]).toMatchObject({ message: 'pisti: fix: deal order', source: 'github' });
});
test('empty events → changelog fallback', async () => {
  const lines = await getTerminalLines({ username: 'laroca00', fallback: FALLBACK, fetchImpl: ok([]) });
  expect(lines.every(l => l.source === 'changelog')).toBe(true);
  expect(lines.length).toBeGreaterThan(0);
});
test.each([['403', status(403)], ['network', reject()], ['bad json', ok('not-json')]])('%s → fallback, no throw', async (_, f) => {
  await expect(getTerminalLines({ username: 'laroca00', fallback: FALLBACK, fetchImpl: f })).resolves.toHaveLength(FALLBACK.length);
});
test('respects limit', async () => { /* 10 events, limit 5 → 5 lines */ });
```

- [ ] **Step 2:** FAIL. **Step 3:** Implement github.ts, Bento, TerminalCard. **Step 4:** PASS (+ `bento.test.tsx`: renders "Yeni projelere açık" only when `openToWork`; renders every terminal line text).
- [ ] **Step 5: Commit** `feat(home): bento grid with live GitHub terminal card`.

---

### Task 9: Services, testimonials, latest posts, contact section (home)

**Files:**
- Create: `src/components/home/{ServicesSection,Testimonials,LatestPosts}.tsx`
- Modify: `src/app/[locale]/page.tsx` (final order: Hero → ProjectShowcase → Bento → ServicesSection → Testimonials → LatestPosts → `<section id="contact">` placeholder heading "Birlikte bir şey üretelim" filled by Task 11), `messages/tr.json`
- Test: `tests/unit/home-sections.test.tsx`

**Interfaces:**
- Produces: `<ServicesSection services: Service[] />`, `<Testimonials items: Testimonial[] />` (horizontal scroll-snap on mobile, grid on desktop; `<blockquote>`/`<figcaption>`), `<LatestPosts posts: Post[] limit?: 3 />` (date formatted with `Intl.DateTimeFormat(locale, { dateStyle: 'long' })`, reading time `"{n} dk okuma"`). Each section hides itself (returns null) when its list is empty.

- [ ] **Step 1: Failing tests:** each renders all items; LatestPosts shows at most 3 and links `/tr/blog/<slug>`; empty arrays render nothing.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat(home): services, testimonials, latest posts`.

---

### Task 10: Content pages (projects, blog, about, services)

**Files:**
- Create: `src/app/[locale]/projects/page.tsx`, `projects/[slug]/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`, `about/page.tsx`, `services/page.tsx`
- Create: `src/components/about/Timeline.tsx`
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: loaders, `renderMdx`, `Reveal`, `ServicesSection`, `Testimonials`.
- Produces: every dynamic route exports `generateStaticParams` (enabled locales × slugs) and `dynamicParams = false`; unknown slug → 404. `/about`: profile bio, `Timeline` of experience (work & education distinguished by icon + `kind` label), stack, "CV indir" link to `/cv/${locale}.pdf` with `download`. `/projects`: grid of all 6 (featured first), accent-colored cards. Project page: hero with title/label/stack chips/links, cover, MDX body in `prose`-like styles (custom CSS, dark), prev/next project nav. Blog list + post page with date, reading time, tags, code highlighting.

- [ ] **Step 1: Failing e2e:** `/tr/projects` lists 6 project titles; `/tr/projects/empower-eu` has `h1` "EmpowerEU" and "Siteye git" link to the live URL; `/tr/projects/unknown` → 404; `/tr/blog` lists 2 posts; first post page has `<time datetime>` and a highlighted code block (`pre[data-language]`); `/tr/about` has a link with `download` attribute to `/cv/tr.pdf` returning 200 `application/pdf`; `/tr/services` lists all services.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat(pages): projects, blog, about, services`.

---

### Task 11: Contact form

**Files:**
- Create: `src/app/[locale]/contact/actions.ts`, `src/lib/rate-limit.ts`, `src/components/contact/ContactForm.tsx`, `.env.example`
- Modify: home `#contact` section, `messages/tr.json` (`Contact.*`)
- Test: `tests/unit/contact-action.test.ts`, `tests/unit/rate-limit.test.ts`

**Interfaces:**
- Produces:
  - `.env.example`: `RESEND_API_KEY=`, `CONTACT_TO_EMAIL=tugberkakkrt@gmail.com`, `CONTACT_FROM_EMAIL=LaRoca <onboarding@resend.dev>`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
  - `type ContactState = { status: 'idle' | 'success' | 'invalid' | 'rate_limited' | 'error'; fieldErrors?: Partial<Record<'name'|'email'|'message', string>> }`
  - `sendContact(prev: ContactState, formData: FormData): Promise<ContactState>` ('use server'). Fields: `name` (2–80), `email` (valid), `message` (10–5000), honeypot `company` (must be empty). Rate key: first IP from `x-forwarded-for` header (via `headers()`), fallback `'unknown'`.
  - `createRateLimiter({ limit: number, windowMs: number, now?: () => number }): { hit(key: string): boolean }` (true = allowed). Contact uses limit 5, window 10 min. In-memory per instance (acceptable on Hobby; documented in code comment).
  - Internal seam for tests: `deps = { send: (args) => Promise<{ error?: unknown }>, limiter }` exported as `__setContactDeps` for tests only.
  - `<ContactForm email: string />` client; `useActionState(sendContact, { status: 'idle' })`; labels, `aria-invalid`, `aria-describedby` errors, `aria-live="polite"` status; on `error` shows message plus `mailto:` link to profile email; submit button disabled while pending.

- [ ] **Step 1: Failing tests** (`contact-action.test.ts`):

```ts
test('valid submission sends to CONTACT_TO_EMAIL with reply-to', async () => {
  const s = await sendContact(IDLE, form({ name: 'Ayşe', email: 'a@b.co', message: 'Merhaba, bir projem var.' }));
  expect(s.status).toBe('success');
  expect(sent[0]).toMatchObject({ to: 'tugberkakkrt@gmail.com', replyTo: 'a@b.co' });
});
test('honeypot filled → success, nothing sent', async () => { /* status success, sent.length 0 */ });
test('invalid email → invalid with fieldErrors.email', async () => {});
test('6th submission from same IP within 10 min → rate_limited', async () => {});
test('missing RESEND_API_KEY → error, no throw', async () => {});
test('provider returns error → error', async () => {});
```

`rate-limit.test.ts`: 5 allowed, 6th denied, allowed again after `windowMs` (injected `now`).
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat(contact): contact form with Resend, honeypot, rate limit`.

---

### Task 12: Command palette (⌘K)

**Files:**
- Create: `src/components/command/CommandPalette.tsx`
- Modify: `src/app/[locale]/layout.tsx` (mount once; pass serializable data: project titles+slugs, profile email, enabled locales), `messages/tr.json` (`Command.*`)
- Test: `tests/unit/command-palette.test.tsx`

**Interfaces:**
- Consumes: `open-command-palette` window event from Nav (Task 5), `useRouter` from `@/i18n/routing`.
- Produces: `<CommandPalette projects: {slug,title}[], email: string, locales: Locale[] />` using `cmdk` `Command.Dialog`; opens on `Meta+K` / `Ctrl+K` / the window event; terminal styling (mono, `~/laroca $` prompt in input placeholder). Groups: "Git" (Ana sayfa, Projeler, Hakkımda, Hizmetler, Blog, İletişim), "Projeler" (each project), "Eylemler" (E-postayı kopyala → `navigator.clipboard.writeText(email)` then shows "Kopyalandı", CV indir → `/cv/{locale}.pdf`, GitHub'ı aç), "Dil" (only if `locales.length > 1`). Esc closes and returns focus to the previously focused element.

- [ ] **Step 1: Failing tests:** `Ctrl+K` opens a `role="dialog"`; typing "pişti" filters to the Online Pişti item; selecting "E-postayı kopyala" calls clipboard with `tugberkakkrt@gmail.com`; "Dil" group absent when one locale; Esc closes.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat(ui): terminal-style command palette`.

---

### Task 13: Language switcher

**Files:**
- Create: `src/components/layout/LanguageSwitcher.tsx`
- Modify: `Nav.tsx`
- Test: `tests/unit/language-switcher.test.tsx`

**Interfaces:**
- Produces: `<LanguageSwitcher locales: Locale[] current: Locale />` — returns `null` when `locales.length < 2`; otherwise a menu of `LOCALE_LABELS` switching to the same pathname in the target locale via `useRouter().replace(pathname, { locale })`.

- [ ] **Step 1: Failing tests:** renders nothing for `['tr']`; for `['tr','en']` shows "English" and calls `replace` with `{ locale: 'en' }`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat(i18n): language switcher (hidden with one locale)`.

---

### Task 14: SEO — metadata, sitemap, robots, OG images, JSON-LD

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo.ts`, OG image routes (`[locale]/opengraph-image.tsx`, `projects/[slug]/opengraph-image.tsx`, `blog/[slug]/opengraph-image.tsx`)
- Modify: each page's `generateMetadata`, `[locale]/layout.tsx` (JSON-LD Person)
- Test: `tests/unit/seo.test.ts`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Produces: `alternatesFor(path: string, flags?): { canonical: string; languages: Record<string, string> }` — only enabled locales, plus `x-default` → fallback locale URL; `buildSitemap(entries, flags?)` used by `sitemap.ts` (all static pages + project + post URLs × enabled locales, with `alternates.languages`). `metadataBase = new URL(siteUrl())`. Title template `"%s · LaRoca"`, default `"Tuğberk Emre Akkurt · LaRoca"`. OG images 1200×630, black background, gradient title, mono subtitle, project accent glow. JSON-LD `Person` { name, alternateName: 'LaRoca', url, sameAs: socials, jobTitle: 'Full-stack Developer', email }.

- [ ] **Step 1: Failing unit tests:** with only `tr` enabled, `alternatesFor('/projects').languages` equals `{ tr: '<site>/tr/projects', 'x-default': '<site>/tr/projects' }`; with `tr,en`, contains `en` and `x-default` → `/en/projects`; sitemap contains no `/de/` or `/it/` URLs and includes `/tr/projects/empower-eu`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: e2e:** `/sitemap.xml` 200 with `/tr/projects/green-future-balcony`; `/robots.txt` references sitemap; `/tr` has `<link rel="alternate" hreflang="x-default">`, `og:image` URL returning 200 `image/png`; JSON-LD script parses and `@type === 'Person'`.
- [ ] **Step 6:** PASS. **Step 7: Commit** `feat(seo): metadata, hreflang, sitemap, OG images, JSON-LD`.

---

### Task 15: Analytics, accessibility/performance gate, docs, deploy handoff

**Files:**
- Modify: `[locale]/layout.tsx` (`<Analytics />` from `@vercel/analytics/next`)
- Create: `tests/e2e/a11y.spec.ts`, `README.md` (Turkish)
- Test: `tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Write a11y e2e:** for `/tr`, `/tr/projects`, `/tr/projects/green-future-balcony`, `/tr/blog`, `/tr/about`, `/tr/services`: `@axe-core/playwright` → zero violations of impact `serious`/`critical`; on mobile project, `scrollWidth <= innerWidth`; Tab through `/tr` reaches the contact submit button without a focus trap.
- [ ] **Step 2:** Run → fix any violations → PASS.
- [ ] **Step 3: Lighthouse:** `npm run build && npm run start`, then `npx lighthouse@latest http://localhost:3000/tr --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./lh-home.json --chrome-flags="--headless"` and same for `/tr/projects/green-future-balcony`. Expected: every category score ≥ 0.95. Fix and re-run until met. Do not commit the JSON.
- [ ] **Step 4: README.md (Turkish)** — sections: Geliştirme (`npm run dev`, tests), İçerik nasıl düzenlenir (which file for what; how to add a project/post; images location), Yeni dil açma (translate `messages/<l>.json` + `content/<l>/`, run `npm run check:content`, set `LOCALE_ENABLED[l] = true`), Ortam değişkenleri (from `.env.example`), Yayına alma (Vercel Hobby: import repo, set env vars, after buying laroca.studio add domain in Vercel + DNS records, verify domain in Resend and change `CONTACT_FROM_EMAIL` to `LaRoca <iletisim@laroca.studio>`, set `NEXT_PUBLIC_SITE_URL=https://laroca.studio`).
- [ ] **Step 5:** Full gate: `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e` → all PASS.
- [ ] **Step 6: Commit** `chore: analytics, a11y gate, README`.
- [ ] **Step 7: Handoff (Tuğberk does these; executor does not):** create GitHub repo under `laroca00` and push; import to Vercel; set env vars; buy laroca.studio; DNS. Executor only prints this checklist.
