-- Esma-ül Hüsna Veritabanı Şeması ve Başlangıç Verisi
-- Bu scripti Supabase Dashboard > SQL Editor üzerinden çalıştırabilirsiniz.

-- 1. Tabloyu Oluşturma
CREATE TABLE IF NOT EXISTS names_of_allah (
    id SERIAL PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_tr TEXT NOT NULL,
    meaning TEXT NOT NULL,
    description TEXT,
    virtue TEXT,
    dhikr_count INTEGER DEFAULT 0,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Index Ekleme (Performans için)
CREATE INDEX IF NOT EXISTS idx_esma_order ON names_of_allah(display_order);

-- 3. Veri Girişi (İlk 20 İsim Örnektir, Tam Liste İçin Dashboard Kullanılabilir)
INSERT INTO names_of_allah (name_ar, name_tr, meaning, description, virtue, dhikr_count, display_order)
VALUES 
('اللَّهُ', 'Allah', 'Eşi ve benzeri olmayan, bütün noksan sıfatlardan münezzeh tek İlah.', 'Bütün isimlerin sultanıdır, her şeyi kapsar.', 'Her gün 1000 defa zikredilmesi imanı kuvvetlendirir.', 66, 1),
('الرَّحْمَنُ', 'er-Rahmân', 'Dünyada bütün mahlûkata merhamet eden.', 'Rahmeti her şeyi kuşatmıştır.', 'Okuyan her türlü afetten korunur.', 298, 2),
('الرَّحِيمُ', 'er-Rahîm', 'Ahirette sadece mü''minlere rahmet eden.', 'Müminlere has bir merhamettir.', 'Rızık bereketi ve sevgi için okunur.', 258, 3),
('الْمَلِكُ', 'el-Melik', 'Mülkün gerçek sahibi.', 'Kainatın tek hakimidir.', 'Maddi ve manevi güç için okunur.', 90, 4),
('الْقُدُّوسُ', 'el-Kuddûs', 'Her türlü noksanlıktan uzak.', 'Hatalardan ve noksanlıktan uzaktır.', 'Kalp temizliği için okunur.', 170, 5),
('السَّلامُ', 'es-Selâm', 'Esenlik veren, tehlikelerden selamete çıkaran.', 'Kullarını selamette tutandır.', 'Korkulardan emin olmak için okunur.', 131, 6),
('الْمُؤْمِنُ', 'el-Mü''min', 'Emniyet ve güven veren.', 'İman ışığını yakandır.', 'Düşman şerrinden korunmak için okunur.', 136, 7),
('الْمُهَيْمِنُ', 'el-Müheymin', 'Her şeyi gözetip koruyan.', 'Kainatı kontrol edendir.', 'İnsanların sevgisini kazanmak için okunur.', 145, 8),
('الْعَزِيزُ', 'el-Azîz', 'İzzet sahibi, her şeye galip gelen.', 'Mağlup edilemez güç sahibidir.', 'Düşmanlara karşı galip gelmek için okunur.', 94, 9),
('الْجَبَّارُ', 'el-Cebbâr', 'Azamet ve kudret sahibi.', 'Hükmüne karşı gelinemez.', 'İsteklerin kabulü için okunur.', 206, 10),
('الْمُتَكَبِّرُ', 'el-Mütekebbir', 'Büyüklükte eşi olmayan.', 'Büyüklük sadece O''na aittir.', 'İzzet ve şeref kazanmak için okunur.', 662, 11),
('الْخَالِقُ', 'el-Hâlık', 'Yaratan, yoktan var eden.', 'Her şeyin yaratıcısıdır.', 'İşlerde başarı için okunur.', 731, 12),
('الْبَارِئُ', 'el-Bâri''', 'Her şeyi kusursuz yaratan.', 'Her şeyi yerli yerinde yaratandır.', 'Afetlerden korunmak için okunur.', 213, 13),
('الْمُصَوِّرُ', 'el-Musavvir', 'Şekil veren, tasvir eden.', 'Varlıklara suret verendir.', 'Sanatta ve ilimde başarı için okunur.', 336, 14),
('الْغَفَّارُ', 'el-Gaffâr', 'Mağfireti bol olan.', 'Günahları örten ve affedendir.', 'Günahların affı için okunur.', 1281, 15),
('الْقَهَّارُ', 'el-Kahhâr', 'Her şeye galip gelen, kahreden.', 'Zalimleri perişan edendir.', 'Daire-i harpten kurtulmak için okunur.', 306, 16),
('الْوَهَّابُ', 'el-Vehhâb', 'Karşılıksız veren.', 'Bağış ve ihsanı bol olandır.', 'Borçlardan kurtulmak için okunur.', 14, 17),
('الرَّزَّاقُ', 'er-Razzâk', 'Rızık veren.', 'Her canlıya rızık ulaştırandır.', 'Rızık bereketi için okunur.', 308, 18),
('الْفَتَّاحُ', 'el-Fettâh', 'Her türlü zorluğu açan.', 'Kapalı kapıları açandır.', 'Zihin açıklığı için okunur.', 489, 19),
('الْعَلِيمُ', 'el-Alîm', 'Her şeyi bilen.', 'İlmi her şeyi kuşatmıştır.', 'İlim ve hikmet için okunur.', 150, 20)
ON CONFLICT (id) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_tr = EXCLUDED.name_tr,
    meaning = EXCLUDED.meaning,
    description = EXCLUDED.description,
    virtue = EXCLUDED.virtue,
    dhikr_count = EXCLUDED.dhikr_count,
    display_order = EXCLUDED.display_order;
