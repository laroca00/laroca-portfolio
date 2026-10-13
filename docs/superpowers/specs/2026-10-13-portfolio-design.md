# LaRoca Portfolyo Sitesi — Tasarım Belgesi

Tarih: 2026-10-13
Sahip: Tuğberk Emre Akkurt ("LaRoca")
Alan adı: laroca.studio (henüz satın alınmadı; laroca.dev başkasına ait) · GitHub: https://github.com/laroca00

## 1. Niyet ve neden

Tuğberk'in kişisel geliştirici portfolyosu ve aynı zamanda "LaRoca Dev" markasının ana evi.
Footer'ında "LaRoca Dev" imzası olan müşteri siteleri (ör. greenfuturebalcony.com,
empoweringadultswithdisabilities.com) zaten bu markayı kullanıyor; portfolyo bu imzanın götürdüğü yer olacak.

- Uzun yıllar ayakta kalacak; tüm profillerden ve Play Console'daki geliştirici web sitesi alanından link verilecek.
- **Öncelik:** iş teklifi ve proje (freelance) teklifi almak.
- **Ziyaretçinin aklında kalacak his:** "genç, idealist bir yazılımcı" — mobil, web, backend, frontend ve oyun; her katmanda iş çıkaran biri.

## 2. Hedefler, hedef olmayanlar, anti-hedefler

**Hedefler**
- İşe alımcı ya da potansiyel müşteri 30 saniye içinde kim olduğunu, ne yaptığını ve nasıl ulaşacağını anlar.
- Site bizzat "en güncel teknoloji ve mimari" kanıtı olur: hızlı, erişilebilir, modern React mimarisi.
- İçerik (projeler, blog, deneyim, referanslar, hizmetler, çeviriler) kod bilmeden değil ama **kod mantığı değiştirmeden**, yalnızca içerik dosyaları düzenlenerek güncellenebilir.
- 4 dil altyapısı: TR, EN, DE, IT.

**Hedef olmayanlar**
- CMS paneli / veritabanı (şimdilik yok; MDX + repo yeterli).
- Uygulamaların yasal sayfaları (gizlilik politikası, hesap silme) — Tuğberk bunları bu sitede istemiyor (bkz. §8).
- Kullanıcı hesabı, yorum sistemi, e-ticaret.

**Anti-hedefler (teknik olarak çalışsa bile başarısızlık sayılır)**
- Şablon/hazır tema gibi görünmesi.
- Açık renkli editoryal/serif tarz veya cıvıl cıvıl Y2K/sticker tarzı — Tuğberk ikisini de açıkça reddetti.
- Animasyonlar yüzünden yavaş, takılan ya da mobilde bozulan bir site.
- Yarım çevrilmiş dillerin yayında görünmesi.

## 3. Kısıtlar ve kararlaştırılmış teknoloji

Tuğberk'in onayladığı yığın:
- **Next.js (App Router), TypeScript** — kurulum anındaki güncel kararlı sürüm.
- **MDX** — tüm uzun içerik (projeler/vaka çalışmaları, blog) repoda MDX olarak.
- **Vercel (Hobby planı)** — hosting; laroca.studio alan adı bağlanacak. Alan adı alınana kadar `*.vercel.app` adresi kullanılır; site alan adına bağımlı kurulmaz (tek bir ayar).

Tuğberk React Native ve Next.js ile çalışıyor; site bu ekosistemde kalmalı.

Tuğberk'in onayladığı ek araçlar:
- Tailwind CSS, Motion (Framer Motion) animasyon için.
- İletişim formu: Server Action + Resend ile e-posta; alıcı **tugberkakkrt@gmail.com** (Tuğberk doğruladı). Alan adı DNS'i doğrulanana kadar Resend'in test göndericisi kullanılır (Resend hesabı bu adresle açılırsa bu adrese gönderim çalışır). Spam koruması (honeypot + hız sınırı) eklenir.
- Vercel Analytics (çerezsiz; çerez bandı gerekmez).

## 4. Görsel yön (Tuğberk'in seçimi)

Mockup'larla seçildi: **"Apple ürün sayfası anlatımı" temel**, üstüne "Apple hero" ve "bento + canlı terminal" parçaları.

- Koyu tema, siyaha yakın arka plan; Apple tarzı büyük, sıkı, temiz sans-serif tipografi; gradient başlık yazıları.
- Geliştirici kimliği terminal dokunuşlarıyla (monospace, yeşil vurgu, imleç) — baskın değil, aksan olarak.
- Sakin ve premium; kaydırmaya bağlı yumuşak animasyonlar.

## 5. Site yapısı

### Ana sayfa (akış sırasıyla)
1. **Hero** — ekranı kaplayan kısa ve büyük başlık (gradient), altında yazılıyormuş gibi canlanan tek satır terminal ("mobile · web · backend · games"). Üstte minimal nav ve ⌘K göstergesi.
2. **Öne çıkan projeler** — her biri tam ekran bir "ürün lansmanı" bölümü: üst etiket (ör. "Erasmus+ · 4 ülke"), büyük başlık, tek cümlelik açıklama, "Vaka çalışmasını oku ›" ve "Canlı gör / Play Store ›" linkleri, kaydırdıkça açılan görsel (ekran görüntüsü/cihaz). Her projenin kendi vurgu rengi var.
3. **Hakkımda / yetenekler — bento ızgarası** — kartlar: kısa tanıtım + "yeni projelere açık" durumu, canlı terminal kartı (bkz. §6), teknolojiler, rakamlar (ör. 2 Erasmus+ projesi, partner ülke sayısı, uygulama sayısı).
4. **Hizmetler** — LaRoca Dev olarak sunulanlar (web, mobil, proje/kurum siteleri vb.).
5. **Referanslar** — müşteri/partner yorumları.
6. **Son blog yazıları** — 2–3 kart.
7. **İletişim** — net çağrı + form.

### Diğer sayfalar
- `/projeler` — tüm projeler listesi; `/projeler/[slug]` — MDX vaka çalışması.
- `/blog` ve `/blog/[slug]` — MDX yazılar.
- `/hakkimda` (veya ana sayfadaki bölümün genişletilmiş hali) — **deneyim/eğitim zaman çizelgesi** + **indirilebilir PDF CV**.
- `/hizmetler` (ana sayfa bölümünün genişletilmiş hali, isteğe bağlı — builder kararı).
- 404 sayfası, aynı dilde.

### Her yerde
- **⌘K / Ctrl+K komut paleti**, terminal görünümlü: sayfalara/projelere atla, e-postayı kopyala, CV indir, dil değiştir. Mobilde nav'daki bir butonla açılır.

### Projeler (başlangıç içeriği)
| Proje | Tür | Bilinen link |
|---|---|---|
| Green Future Balcony | Erasmus+ proje sitesi (WordPress, özel tema) | greenfuturebalcony.com |
| EmpowerEU | Erasmus+ proje sitesi, erişilebilirlik odaklı | empoweringadultswithdisabilities.com |
| Sırpça öğrenme uygulaması | React Native mobil uygulama | Play Store (link sonra) |
| Online Pişti | React Native çok oyunculu kart oyunu | Play Store (link sonra) |
| Akgün websitesi | Web | sonra |
| 3DCare | Web | sonra |

## 6. Canlı terminal kartı

Bento'daki bir kart GitHub'daki son aktiviteyi terminal çıktısı gibi gösterir (`~/laroca $ git log` → son birkaç commit/olay).
**Mevcut durum:** github.com/laroca00 şu an 0 public repo ve 0 public olaya sahip; doğrudan public API ile kart boş kalır.
Çözüm builder'a bırakılmıştır, şu kısıtla: kart **asla boş veya hatalı görünmemeli** ve özel repo içeriği (commit mesajı, repo adı) izinsiz sızmamalı. Veri yoksa içerik dosyasındaki elle yazılmış "changelog" girişlerine düşer.

## 7. Çok dillilik (i18n)

- Diller: **tr, en, de, it**. URL'de dil öneki (ör. `/tr/...`, `/en/...`).
- İlk ziyarette tarayıcı diline göre yönlendirme; eşleşme yoksa **en**. Kullanıcının seçimi hatırlanır.
- **Şimdilik içerik yalnızca Türkçe yazılır**; Tuğberk diğer dilleri kendisi çevirecek.
- Çevirisi tamamlanmamış diller dil seçicide ve sitemap'te **görünmez**; yayında yarım çeviri olmaz. (Bu yüzden ilk yayında fiilen tek dil TR olur; en'e otomatik yönlendirme ancak en çevirisi eklenince devreye girer — tarayıcı eşleşmesi yoksa mevcut ilk dile, yani TR'ye düşer.)
- Arayüz metinleri dil başına bir sözlük dosyasında; projeler/blog dil başına ayrı MDX dosyası. Bir blog yazısının yalnızca bazı dillerde çevirisi olabilir; olmayan dilde o yazı listelenmez.
- **Dilin "hazır" sayılması (benim çağrım):** tek bir yapılandırma dosyasında dil başına elle açılan `enabled` bayrağı. Tuğberk çeviriyi bitirince bayrağı açar. Kapalı bir dilin tüm URL'leri 404 döner; seçicide, sitemap'te ve `hreflang`'de yer almaz. Derleme sırasında, açık bir dilde eksik arayüz metni veya eksik proje varsa uyarı verilir (blog muaf).
- **URL yolları (benim çağrım):** yol parçaları tüm dillerde aynı ve İngilizce (`/tr/projects/green-future-balcony`, `/de/blog/...`); bir içeriğin slug'ı tüm dillerde aynı kalır. Bu, dil değiştirici ve `hreflang` eşleşmesini basit tutar. (§5'teki `/projeler`, `/hakkimda` gibi Türkçe adlar yalnızca açıklama içindir; gerçek yollar `/projects`, `/about`, `/blog`, `/services`.)

## 8. İçerik yönetimi

- Tüm içerik repoda, tek bir `content/` ağacında; Tuğberk yalnızca bu dosyaları düzenleyerek siteyi günceller.
- İlk sürümde **gerçekçi Türkçe yer tutucu metinler**; proje adları ve bilinen linkler gerçek. Görseller için yer tutucular.
- Deneyim, referanslar, hizmetler, sosyal linkler, "yeni projelere açık" durumu gibi yapılandırılmış veriler de içerik dosyalarında (tipli/şemalı, hatalı içerik derlemede yakalanır).
- CV: içerik klasöründe bir PDF; dil başına ayrı PDF olabilir.

## 9. Kalite çıtası

- Lighthouse (mobil) performans, erişilebilirlik, en iyi pratikler, SEO: hepsi 95+ hedef.
- `prefers-reduced-motion` desteklenir: animasyonlar kapanır, içerik eksiksiz görünür.
- Klavye ile tam gezinilebilir; ⌘K paleti erişilebilir.
- SEO: dil başına meta, Open Graph görselleri (proje/yazı başına otomatik üretilebilir), sitemap, `hreflang`, yapılandırılmış veri (Person).
- Mobilde aynı his, daha sade animasyon.

## 10. Builder'a bırakılanlar

- Klasör yapısı, bileşen mimarisi, i18n ve MDX kütüphanesi seçimi.
- Animasyon tekniği (CSS scroll-driven animations vs Motion) ve detayları.
- Tipografi (Apple hissini veren açık lisanslı font, ör. Inter/Geist) ve renk token'ları.
- Proje vurgu renkleri.
- Canlı terminal kartının veri kaynağı (§6 kısıtları içinde).
- Test stratejisi ve CI.
- `/hizmetler`'in ayrı sayfa olup olmayacağı.

## 11. Bilinen notlar

- Google Play, gizlilik politikası için herkese açık bir URL ister ve hesap içeren uygulamalarda hesap silme URL'si gerekir. Tuğberk bu sayfaları bu sitede istemiyor; gerekirse sonradan iki statik sayfa olarak eklenebilir.
- Proje klasörü henüz bir git deposu değil; kurulumda `git init` yapılıp `.superpowers/` `.gitignore`'a eklenecek.
