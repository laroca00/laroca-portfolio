# LaRoca — Tuğberk Emre Akkurt portfolyosu

Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4, next-intl ve MDX ile yazılmış kişisel portfolyo. Vercel'de çalışır.

## Geliştirme

```bash
npm install
npm run dev          # http://localhost:3000 (önce içerik kontrolü çalışır)
npm test             # birim testleri (Vitest)
npm run test:e2e     # uçtan uca testler (Playwright, üretim build'i üzerinde)
npm run typecheck && npm run lint
npm run format       # Prettier
```

İlk kez e2e çalıştıracaksan: `npx playwright install chromium`.

## İçerik nasıl düzenlenir

Kod değiştirmeden siteyi güncellemek için yalnızca şu dosyalara dokunman yeterli:

| Ne | Dosya |
|---|---|
| Ad, biyografi, e-posta, sosyal linkler, rakamlar, araçlar, "yeni projelere açık" | `content/tr/profile.json` |
| Hizmetler | `content/tr/services.json` (`icon`: `globe`, `smartphone`, `landmark`, `server`, `code`) |
| Referanslar | `content/tr/testimonials.json` |
| Deneyim ve eğitim | `content/tr/experience.json` (`start`/`end`: `YYYY-MM`, `kind`: `work` ya da `education`) |
| Terminal kartı yedek kayıtları | `content/tr/changelog.json` (GitHub'da herkese açık commit yokken gösterilir) |
| Projeler | `content/tr/projects/<slug>.mdx` |
| Blog yazıları | `content/tr/blog/<slug>.mdx` |
| Arayüz metinleri (menü, butonlar, başlıklar) | `messages/tr.json` |
| CV | `public/cv/tr.pdf` |
| Proje görselleri | `public/projects/<slug>/cover.webp` (1600×1000 önerilir) |

> Şu anki metinlerin bir kısmı **yer tutucu**: "(örnek)" yazan referanslar ve deneyimler, `changelog.json` kayıtları, proje vaka çalışmalarındaki `TODO` yorumları ve iletişim bölümündeki "genellikle bir gün içinde dönüyorum" cümlesi. Yayına almadan önce kendi bilgilerinle değiştir.

### Yeni proje eklemek

`content/tr/projects/yeni-proje.mdx` oluştur (dosya adı = adres):

```mdx
---
title: Proje Adı
tagline: Tek cümlelik açıklama.
label: React Native · Oyun
category: mobile          # web | mobile | game | backend
stack: [React Native, TypeScript]
accent: blue              # green | teal | blue | violet | red | amber
featured: true            # ana sayfadaki büyük vitrinde gösterilsin mi
order: 5                  # sıralama
year: 2026
liveUrl: https://...      # isteğe bağlı
storeUrl: https://play.google.com/store/apps/details?id=...   # isteğe bağlı
repoUrl: https://github.com/...                               # isteğe bağlı
cover: /projects/yeni-proje/cover.webp
preview: /projects/yeni-proje/preview.jpg                     # isteğe bağlı, aşağıya bak
---

## Problem
...
```

### Canlı site önizlemesi

`liveUrl` alanı olan bir projenin ana sayfadaki kartında canlı sitenin önizlemesi gösterilebilir: sayfa kaydırıldıkça sitenin tam boy ekran görüntüsü kartın içinde aşağı kayar, fareyle üzerine gelince gerçek site yüklenir. Ekran görüntüsünü almak için:

```bash
npm run capture:previews              # liveUrl'si olan tüm projeler
npm run capture:previews -- akgun     # yalnızca belirtilen projeler
```

Komut `public/projects/<slug>/preview.jpg` dosyasını oluşturur; ardından projenin ön bilgisine `preview: /projects/<slug>/preview.jpg` satırını ekle. Canlı site değiştikçe komutu yeniden çalıştır.

### Vaka çalışması parçaları

Proje sayfası ön bilgideki alanlara göre kendini kurar; `##` başlıklarından yan tarafta bir içindekiler listesi oluşur.

```mdx
metrics:                      # sayaçla dolan büyük rakamlar
  - { value: "120+", label: katılımcı }
screens:                      # mobil uygulamalar: iPhone çerçevelerinde ekranlar (1206×2622)
  - { src: /projects/<slug>/screens/home.webp, caption: Ana sayfa }
```

Metnin içine sürüklenebilir önce/sonra karşılaştırması:

```mdx
<Compare
  before="/projects/<slug>/eski.webp"
  after="/projects/<slug>/yeni.webp"
  beforeLabel="Önce"
  afterLabel="Sonra"
  alt="Ana sayfa"
/>
```

Görsel dosyasını değiştirirken yeni bir ad ver; aynı ad kalırsa önbellek eski görseli göstermeye devam edebilir.

### Yeni blog yazısı

`content/tr/blog/yazi-adi.mdx` — ön bilgi alanları: `title`, `description`, `date: 2026-10-20`, `tags: [nextjs]`, `draft: false`. `draft: true` olan yazılar yalnızca geliştirme modunda görünür.

Hatalı bir alan (ör. bilinmeyen `accent`) `npm run check:content` ya da build sırasında dosya adı ve alanla birlikte hata verir.

## Yeni dil açma (en / de / it)

1. `messages/tr.json` dosyasını `messages/en.json` olarak kopyalayıp çevir.
2. `content/tr/` klasörünü `content/en/` olarak kopyalayıp çevir (blog yazıları isteğe bağlı; çevrilmeyen yazı o dilde listelenmez).
3. `npm run check:content` çalıştır; eksik çeviriler listelenir.
4. `src/i18n/config.ts` içinde `LOCALE_ENABLED.en = true` yap.

Kapalı bir dilin tüm adresleri 404 döner ve dil seçici, sitemap ve hreflang'de görünmez. Dil seçici ikinci dil açılınca kendiliğinden belirir.

## Ortam değişkenleri

`.env.example` dosyasına bak:

| Değişken | Açıklama |
|---|---|
| `RESEND_API_KEY` | İletişim formu için Resend anahtarı. Yoksa form, e-posta adresini göstererek nazikçe hata verir. |
| `CONTACT_TO_EMAIL` | Mesajların gideceği adres (`tugberkakkrt@gmail.com`). |
| `CONTACT_FROM_EMAIL` | Gönderen. Alan adı doğrulanana kadar `LaRoca <onboarding@resend.dev>`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical, sitemap ve paylaşım görselleri için tam adres (ör. `https://laroca.studio`). |
| `GITHUB_TOKEN` | İsteğe bağlı. "Son çalışmalar" terminali ve katkı ızgarası için. Varsa özel repoların commit mesajları ve özel katkı sayıları da gösterilir; yoksa yalnızca herkese açık veriler. Classic token için `repo` ve `read:user` izinleri yeterli. |

## Yayına alma (Vercel Hobby)

1. Bu depoyu GitHub'da `laroca00` hesabına gönder.
2. [vercel.com](https://vercel.com) → **Add New Project** → depoyu içe aktar (ayar gerekmez).
3. **Settings → Environment Variables**: yukarıdaki değişkenleri ekle.
4. **Analytics** sekmesinden Web Analytics'i aç (çerezsizdir, çerez bandı gerekmez).
5. `laroca.studio` alan adını satın aldıktan sonra **Settings → Domains** ile ekle ve gösterilen DNS kayıtlarını gir; `NEXT_PUBLIC_SITE_URL=https://laroca.studio` yap.
6. [Resend](https://resend.com)'de alan adını doğrula, ardından `CONTACT_FROM_EMAIL=LaRoca <iletisim@laroca.studio>` yap.

## Mimari notlar

- Tüm sayfalar build sırasında statik üretilir; ana sayfadaki terminal kartı GitHub'ın herkese açık olaylarını saatte bir yeniler (`src/lib/terminal-feed.ts`). Özel depo bilgisi asla gösterilmez.
- Bilinmeyen proje/yazı adresleri `src/proxy.ts` içinde, build sırasında üretilen `src/generated/content-manifest.json` ile 404'e yönlendirilir. Bu dosya `npm run dev` ve `npm run build` öncesinde kendiliğinden yenilenir.
- Animasyonlar CSS scroll-driven animations ile yapılır; JavaScript kapalıyken ve "hareketi azalt" ayarında içerik eksiksiz görünür.
- ⌘K / Ctrl+K komut paleti ilk kullanımda yüklenir (ilk yüklemeyi hafif tutmak için).
