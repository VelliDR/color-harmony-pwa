# 🎨 Color Harmony M3

> 32-bit HDR destekli, Material 3 tasarımlı 2D Kutupsal Renk Çemberi, Erişilebilirlik Kiti ve PWA Uygulaması.

---

## 🚀 Öne Çıkan Özellikler

* **2D Kutupsal Renk Çemberi Mimari Yapısı:**
* **Segmentli Mod (48 Renk $\times$ 5 Katman):** 5 konsantrik halka katmanı (Açık Tint/Pastel $\to$ Saf Doygun Renk $\to$ Koyu Gölge/Shade) ve merkezde saf beyaz çekirdek ile geleneksel sanat ve tasarım standartlarına tam uyum.
* **Sürekli Tayf Modu:** HTML5 Canvas üzerinde piksel bazlı, pürüzsüz radyal renk ve parlaklık geçişi.


* **Dinamik Yarıçap ve Uyum Geometrisi:**
* **Homojen Mod:** Tüm uyum düğümleri eşit parlaklık/doygunluk seviyesinde kilitlenir.
* **Serbest (Heterojen) Mod:** Her uyum düğümünün yarıçapı ($r$) ve parlaklığı bağımsız olarak ayarlanabilir; yüksek kontrastlı ve derinlikli paletler oluşturulabilir.


* **Hassas Renk Uzayları ve Bit Derinliği:**
* 8-bit standart RGB'den 32-bit HDR Float seviyesine kadar hassas hesaplama.
* `sRGB`, `Display-P3`, `Adobe-RGB` ve `Rec2020` geniş renk gamı (Wide Gamut) desteği.


* **Erişilebilirlik ve WCAG Analizi:**
* Protanopia, Deuteranopia ve Tritanopia renk körlüğü simülasyonları.
* Ana renk ve metin kombinasyonları için anlık WCAG AA/AAA kontrast oran matrisi.


* **Çevrimdışı PWA Desteği:**
* Özel Service Worker mimarisi ile internet bağlantısı olmadan tam performans çalışma.
* Mobil ve masaüstü cihazlara kurulabilir (Installable PWA) yapı.


* **Esnek Dışa Aktarım:**
* Oluşturulan paletleri CSS Değişkenleri, JSON veya Swatch formatlarında kolayca dışa aktarma.



---

## 🛠️ Teknolojiler

| Kategori | Teknoloji / Kütüphane |
| --- | --- |
| **Çatı (Framework)** | React 18, TypeScript, Vite |
| **Durum Yönetimi** | Zustand |
| **Grafik Motoru** | SVG (Segmented & Geometry Overlay), HTML5 Canvas (Continuous Spectrum) |
| **Tasarım Dili** | Material 3 (Mürdüm & Amber Tonları) |
| **Çevrimdışı Mimari** | Custom Service Worker (PWA) |

---

## 📦 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

```bash
# 1. Depoyu klonlayın
git clone https://github.com/KULLANICI_ADI/color-harmony-pwa.git

# 2. Proje dizinine geçin
cd color-harmony-pwa

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirici sunucusunu başlatın
npm run dev

```

Üretim (Production) derlemesi almak için:

```bash
npm run build

```

---

## 📁 Proje Yapısı

```text
src/
├── core/
│   └── math-engine/    # Kutupsal dönüşümler, WCAG, renk körlüğü simülasyonu
├── components/
│   ├── wheel/          # ColorWheel ve GeometryOverlay bileşenleri
│   ├── panel/          # PaletteInspector, kartlar ve dışa aktarım modalları
│   └── ui/             # M3 Accordion ve ortak arayüz elemanları
├── state/              # Zustand palet ve ayar depoları
├── theme/              # M3 Mürdüm/Amber tema paleti
└── App.tsx             # Ana uygulama düzeni

```

---

## 📄 Lisans

Bu proje [MIT](https://www.google.com/search?q=LICENSE) lisansı altında lisanslanmıştır.