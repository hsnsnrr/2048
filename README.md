# 2048 Oyunu 🎮

Vercel'de çalışan modern bir 2048 oyunu uygulaması.

## 🎯 Özellikler

- ✨ Temiz ve modern arayüz
- 👤 Oyuncu adı girişi
- 🏆 Top 10 skor tablosu (localStorage ile kaydedilir)
- ⌨️ Klavye kontrolleri (Ok tuşları)
- 📱 Responsive tasarım
- 🎨 Güzel renkler ve animasyonlar

## 🚀 Kurulum

### Yerel Olarak Çalıştırmak

1. Repository'yi klonlayın
2. Proje dizinine gidin
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
5. Tarayıcıda `http://localhost:3000` adresini açın

### Vercel'e Deploy Etmek

1. [Vercel](https://vercel.com) hesabınız varsa giriş yapın
2. GitHub repository'nizi bağlayın
3. "Deploy" butonuna tıklayın
4. Vercel otomatik olarak yapılandırma yapacak

Alternatif olarak:
```bash
npm install -g vercel
vercel
```

## 🎮 Nasıl Oynanır?

1. **Oyuncu Adı Girin**: Başlangıç ekranında adınızı yazın
2. **Oynamaya Başla**: "Oynamaya Başla" butonuna basın
3. **Kontroller**: 
   - ⬆️ Yukarı Ok tuşu: Yukarı hareket
   - ⬇️ Aşağı Ok tuşu: Aşağı hareket
   - ⬅️ Sol Ok tuşu: Sol hareket
   - ➡️ Sağ Ok tuşu: Sağ hareket
4. **Amaç**: Aynı sayıları birleştirerek 2048 kutusunu oluşturmaya çalışın

## 📋 Skor Tablosu

Oyun bittiğinde skorunuz otomatik olarak kaydedilir ve skor tablosunun en iyi 10 içinde yer alırsa gösterilir.

## 🛠️ Teknolojiler

- **Next.js** - React framework
- **React** - UI kütüphanesi
- **CSS Modules** - Styling
- **localStorage** - Verileri cihazda saklama

## 📝 Dosya Yapısı

```
├── pages/
│   ├── _app.js          # App wrapper
│   └── index.js         # Ana oyun componenti
├── styles/
│   ├── globals.css      # Global stiller
│   └── Home.module.css  # Oyun stilleri
├── package.json         # Bağımlılıklar
└── vercel.json         # Vercel yapılandırması
```

## 💾 Veriler

Skor tablosu verileriniz tarayıcıda `localStorage` kullanılarak kaydedilir. Tarayıcı cache'i temizlemediğiniz sürece veriler silinmez.

## 🔧 Yapılandırma

`package.json` dosyasında Next.js sürümünü güncelleyebilirsiniz.

## 📄 Lisans

MIT

## 👨‍💻 Geliştirici

Oyunu Vercel'de barındırarak herkesin oynayabilmesi için deploy ettirin!

---

**Eğlenceleri oyunla! 🎉**