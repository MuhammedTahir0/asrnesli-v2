# PLAN-share-preview: Görsel Önizleme ve Paylaşım Modalı

> **Durum**: Planlama Aşamasında
> **Öncelik**: Yüksek
> **Hedef**: Kullanıcıların tasarladıkları görsele tıklayarak önizleme yapmasını ve doğrudan hedef platform seçerek paylaşım başlatmasını sağlamak.

---

## 1. Analiz ve Gereksinimler

### Mevcut Durum
- Kullanıcı şu anda üstteki ikonlardan boyut seçebiliyor.
- Paylaşım için alttaki butonları kullanıyor.
- Görsel (kanvas) şu anda sadece görüntüleme amaçlı, üzerine tıklanınca bir işlem yapmıyor.

### İstenen Özellikler
1.  **Tıklanabilir Kanvas**: Oluşturulan görsele tıklandığında bir "Önizleme/Paylaşım Modalı" açılmalı.
2.  **Platform Seçimi**: Açılan modalda WhatsApp, TikTok, Twitter/X, Facebook ve YouTube ikonları bulunmalı.
3.  **Hızlı Paylaşım**: Modaldaki ikonlara tıklandığında, o platforma uygun paylaşım işlemi (mevcut `handleSharePlatform` mantığı ile) başlamalı.
4.  **Görsel Doğruluk**: Simgeler `sizes.js` verileriyle veya FontAwesome/React Icons ile uyumlu olmalı.

---

## 2. Teknik Plan

### Bileşen Yapısı (`ShareStudio.jsx`)

1.  **State Yönetimi**:
    - `const [isPreviewOpen, setIsPreviewOpen] = useState(false)`
    
2.  **Event Handler**:
    - Kanvası saran `div` veya `cardRef` elementine `onClick={() => setIsPreviewOpen(true)}` eklenecek.

3.  **UI - Önizleme Modalı**:
    - Tam ekran veya ortalanmış bir modal (overlay).
    - Arka plan: `backdrop-blur` (buzlu cam efekti).
    - İçerik:
        - Görselin önizlemesi (isteğe bağlı, zaten görselin üstüne açılıyorsa sadece butonlar olabilir, ama "Önizleme Ekranı" dendiği için görselin temiz bir hali gösterilebilir).
        - **Platform Grid**: Yatay kaydırılabilir veya grid yapısında sosyal medya ikonları.
        - **Kapat Butonu**: Modalı kapatmak için.

### Platform Verileri
- `sizes.js` dosyasındaki `platformGroups` veya `platformSizes` kullanılabilir, ancak `handleSharePlatform` fonksiyonu parametre olarak string ('whatsapp', 'instagram' vb.) aldığı için bu yapıya uygun bir map oluşturulacak.

### Akış
1.  Kullanıcı tuvale tıklar -> `isPreviewOpen = true`.
2.  Modal açılır.
3.  Kullanıcı "Instagram" ikonuna tıklar.
4.  `handleSharePlatform('instagram')` çağrılır.
5.  Modal kapanır (veya işlem bitince kapanır).

---

## 3. Görev Listesi

- [ ] `ShareStudio.jsx` içinde `isPreviewOpen` state'ini oluştur.
- [ ] Kanvas alanına tıklama özelliği ekle (`cursor-pointer` ile).
- [ ] `AnimatePresence` içinde yeni bir modal bileşeni (veya inline JSX) oluştur.
- [ ] Modal içine sosyal medya butonlarını yerleştir (mevcut buton tasarımını veya daha büyük versiyonlarını kullan).
- [ ] Butonları `handleSharePlatform` fonksiyonuna bağla.
- [ ] UI/UX düzenlemeleri (animasyonlar, responsive tasarım).

---

## 4. Sorular / Netleştirilmesi Gerekenler
*   **Önizleme Görünümü**: Modal açıldığında sadece butonlar mı çıkmalı, yoksa görselin etrafındaki tüm UI elementleri gizlenip sadece görsel ve butonlar mı kalmalı?
*   **Geri Dönüş**: Kullanıcı önizlemeden nasıl çıkacak? (X butonu ve dışarı tıklama).

---

## 5. Doğrulama
*   Kanvasa tıklayınca modal açılıyor mu?
*   Her platform butonu doğru paylaşım akışını tetikliyor mu?
*   Mobil ve masaüstü görünümü düzgün mü?
