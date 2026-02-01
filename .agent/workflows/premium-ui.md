---
description: Premium Panel ve Modal Kullanım Rehberi
---

## Giriş
Bu workflow, uygulamadaki "Premium" görünümü (40px yuvarlama, backdrop blur, kalın tipografi) korumak için tasarlanmış `PremiumPanel` bileşeninin nasıl kullanılacağını açıklar.

## Bileşen Kullanımı

`PremiumPanel` bileşeni hem ekran ortasında bir modal hem de sağdan açılan bir panel (drawer) olarak çalışabilir.

### Temel Props
- `isOpen`: Panelin açık olup olmadığı.
- `onClose`: Kapatma fonksiyonu.
- `title`: Ana başlık (Büyük, font-black).
- `subtitle`: Alt başlık (Opsiyonel).
- `category`: Sağ üstte çıkan kategori etiketi (Opsiyonel).
- `variant`: `'center'` (varsayılan) veya `'right'`.
- `maxWidth`: `'md'` (varsayılan), `'lg'`, `'xl'`, vb.

### Örnek Kullanım

```tsx
import PremiumPanel from '../ui/PremiumPanel';
import { Settings } from 'lucide-react';

// ...

<PremiumPanel
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  title="Hesap Ayarları"
  subtitle="Profil ve Güvenlik Tercihleri"
  category="Yönetim"
  variant="center"
  maxWidth="2xl"
>
  <div className="space-y-6">
    {/* İçerik buraya gelir */}
    <p>Premium tasarım standartlarına uygun içerik...</p>
  </div>
</PremiumPanel>
```

## Tasarım Standartları
Yeni bir panel oluştururken aşağıdaki kurallara dikkat edilmelidir:
1. **Tipografi**: Başlıklar için her zaman `font-black` ve `tracking-tight` kullanın.
2. **Köşeler**: Ana bileşenlerde `rounded-[40px]`, iç kartlarda `rounded-[32px]` kullanın.
3. **Gölgeler**: Derinlik katmak için `shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]` kullanın.
4. **İkonlar**: İkon kutuları için `rounded-2xl` ve yumuşak arka plan renkleri (bg-gray-50 gibi) tercih edin.
