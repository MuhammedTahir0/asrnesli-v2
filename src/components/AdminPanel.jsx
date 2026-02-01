import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const AdminPanel = () => {
     const [activeTab, setActiveTab] = useState('verses')
     const [showModal, setShowModal] = useState(false)
     const [items, setItems] = useState([])
     const [loading, setLoading] = useState(true)
     const [stats, setStats] = useState({ verses: 0, hadiths: 0, ilmihals: 0, names: 0 })

     const [formData, setFormData] = useState({
          type: 'verses',
          content_ar: '',
          content_tr: '',
          surah_name: '',
          surah_number: '',
          verse_number: '',
          tafsir: '',
          content: '',
          source: '',
          question: '',
          answer: '',
          name_ar: '',
          name_tr: '',
          meaning: '',
          description: '',
          display_date: new Date().toISOString().split('T')[0]
     })

     const sidebarItems = [
          { id: 'verses', title: 'Ayet-i Kerime Yönetimi', icon: 'menu_book', color: '#6f9b69' },
          { id: 'hadiths', title: 'Hadis-i Şerif Yönetimi', icon: 'format_quote', color: '#C5A059' },
          { id: 'ilmihals', title: 'İlmihal Rehberi Seçenekleri', icon: 'help_center', color: '#4a7c44' },
          { id: 'names_of_allah', title: 'Esma-ül Hüsna Yönetimi', icon: 'hotel_class', color: '#b08d4d' },
          { id: 'daily_content', title: 'Günlük Akış Takvimi', icon: 'today', color: '#2D5A27' },
     ]

     useEffect(() => {
          fetchStats()
          fetchItems()
     }, [activeTab])

     const fetchStats = async () => {
          try {
               const { count: vCount } = await supabase.from('verses').select('*', { count: 'exact', head: true })
               const { count: hCount } = await supabase.from('hadiths').select('*', { count: 'exact', head: true })
               const { count: iCount } = await supabase.from('ilmihals').select('*', { count: 'exact', head: true })
               const { count: nCount } = await supabase.from('names_of_allah').select('*', { count: 'exact', head: true })
               setStats({ verses: vCount || 0, hadiths: hCount || 0, ilmihals: iCount || 0, names: nCount || 0 })
          } catch (err) {
               console.error('Stats error:', err)
          }
     }

     const fetchItems = async () => {
          setLoading(true)
          try {
               let query;
               if (activeTab === 'daily_content') {
                    query = supabase.from('daily_content').select(`
                     *,
                     verse:verses(content_tr),
                     hadith:hadiths(content),
                     ilmihal:ilmihals(question),
                     nameOfAllah:names_of_allah(name_tr)
                 `).order('display_date', { ascending: false })
               } else {
                    query = supabase.from(activeTab).select('*').order('created_at', { ascending: false })
               }

               const { data, error } = await query
               if (error) console.error('Hata:', error)
               else setItems(data || [])
          } catch (err) {
               console.error('Fetch error:', err)
          } finally {
               setLoading(false)
          }
     }

     const handleSubmit = async (e) => {
          e.preventDefault()
          try {
               let dataToInsert = {}
               const table = formData.type

               if (table === 'verses') {
                    dataToInsert = {
                         content_ar: formData.content_ar,
                         content_tr: formData.content_tr,
                         surah_name: formData.surah_name,
                         surah_number: parseInt(formData.surah_number),
                         verse_number: parseInt(formData.verse_number),
                         tafsir: formData.tafsir
                    }
               } else if (table === 'hadiths') {
                    dataToInsert = { content: formData.content, source: formData.source }
               } else if (table === 'ilmihals') {
                    dataToInsert = { question: formData.question, answer: formData.answer }
               } else if (table === 'names_of_allah') {
                    dataToInsert = {
                         name_ar: formData.name_ar,
                         name_tr: formData.name_tr,
                         meaning: formData.meaning,
                         description: formData.description
                    }
               }

               const { error } = await supabase.from(table).insert([dataToInsert])
               if (error) throw error

               setShowModal(false)
               fetchItems()
               fetchStats()
               setFormData({ ...formData, content_ar: '', content_tr: '', content: '', question: '', answer: '', name_ar: '', name_tr: '' })
          } catch (err) {
               alert('Hata: ' + err.message)
          }
     }

     return (
          <div className="flex h-screen w-full bg-[#FDFBF7] font-sans text-[#141514] overflow-hidden">
               {/* Fixed Sidebar for Navigation */}
               <aside className="w-80 bg-[#171b17] flex flex-col shrink-0 h-full text-white shadow-2xl relative z-30">
                    <div className="p-10">
                         <div className="flex items-center gap-4 mb-2">
                              <div className="size-12 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#b08d4d] flex items-center justify-center shadow-lg shadow-black/20">
                                   <span className="material-symbols-outlined text-white text-3xl">mosque</span>
                              </div>
                              <h1 className="text-xl font-bold font-display tracking-tight">İslami Günlük</h1>
                         </div>
                         <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] ml-16">Yönetim Merkezi</p>
                    </div>

                    <nav className="flex-1 px-6 py-4 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
                         <p className="px-4 text-[11px] text-white/30 font-bold uppercase tracking-widest mb-4">Ana Menü</p>
                         {sidebarItems.map((item) => (
                              <button
                                   key={item.id}
                                   onClick={() => setActiveTab(item.id)}
                                   className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group ${activeTab === item.id
                                        ? 'bg-white/10 text-white shadow-lg border-l-4'
                                        : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                                   style={{ borderLeftColor: activeTab === item.id ? item.color : 'transparent' }}
                              >
                                   <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-white/40'}`}>
                                        {item.icon}
                                   </span>
                                   <span className="text-[15px] font-semibold">{item.title}</span>
                              </button>
                         ))}
                    </nav>

                    <div className="p-8 border-t border-white/5">
                         <Link to="/" className="flex items-center gap-4 px-5 py-4 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all group">
                              <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                              <span className="text-[15px] font-semibold font-display">Sitede Önizle</span>
                         </Link>
                    </div>
               </aside>

               {/* Full-width Main Content Area */}
               <div className="flex-1 flex flex-col relative overflow-hidden">
                    {/* Header: Global Actions */}
                    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-[#e3e1dd] px-12 flex items-center justify-between sticky top-0 z-20">
                         <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-widest mb-1">Şu Anda Aktif</span>
                              <h2 className="text-2xl font-bold font-display text-[#141514]">
                                   {sidebarItems.find(i => i.id === activeTab)?.title}
                              </h2>
                         </div>

                         <div className="flex items-center gap-6">
                              <div className="h-12 px-5 bg-[#fcfaf7] rounded-full border border-[#e3e1dd] flex items-center gap-3 w-96 shadow-inner transition-all focus-within:ring-2 focus-within:ring-[#C5A059]/20 focus-within:border-[#C5A059]">
                                   <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
                                   <input type="text" placeholder="İçeriklerde anahtar kelime ara..." className="bg-transparent border-none text-[15px] w-full focus:ring-0 placeholder-gray-400 font-medium" />
                              </div>

                              <button
                                   onClick={() => {
                                        setFormData({ ...formData, type: activeTab === 'daily_content' ? 'verses' : activeTab })
                                        setShowModal(true)
                                   }}
                                   className="flex items-center gap-3 px-8 py-3.5 bg-[#C5A059] hover:bg-[#b08d4d] text-white rounded-2xl font-bold text-sm shadow-2xl shadow-[#C5A059]/30 transition-all hover:-translate-y-0.5 active:scale-95"
                              >
                                   <span className="material-symbols-outlined">add_circle</span>
                                   <span>Yeni İçerik Ekle</span>
                              </button>
                         </div>
                    </header>

                    {/* Scrollable Content Body */}
                    <main className="flex-1 overflow-y-auto bg-islamic-pattern bg-fixed p-12 no-scrollbar">
                         <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                              {/* KPI Statistics Section */}
                              <div className="grid grid-cols-4 gap-8">
                                   {[
                                        { label: 'Yayındaki Ayetler', value: stats.verses, icon: 'menu_book', color: '#6f9b69' },
                                        { label: 'Günlük Hadisler', value: stats.hadiths, icon: 'format_quote', color: '#C5A059' },
                                        { label: 'İlmihal Maddeleri', value: stats.ilmihals, icon: 'help_center', color: '#4a7c44' },
                                        { label: 'Esmalar', value: stats.names, icon: 'hotel_class', color: '#b08d4d' },
                                   ].map((stat) => (
                                        <div key={stat.label} className="bg-white p-10 rounded-[2.5rem] border border-[#e3e1dd] shadow-sm hover:shadow-2xl hover:border-[#C5A059]/30 transition-all duration-500 group overflow-hidden relative">
                                             <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" style={{ backgroundImage: `radial-gradient(circle, ${stat.color} 0%, transparent 70%)` }} />
                                             <div className="relative z-10">
                                                  <div className="flex items-center justify-between mb-6">
                                                       <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                                       <div className="size-12 rounded-2xl flex items-center justify-center opacity-80 shadow-inner" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                                            <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                                                       </div>
                                                  </div>
                                                  <h3 className="text-5xl font-bold text-[#141514] font-display">{stat.value}</h3>
                                                  <div className="mt-4 flex items-center gap-2">
                                                       <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-current rounded-full" style={{ width: '65%', color: stat.color }} />
                                                       </div>
                                                       <span className="text-[11px] font-bold text-gray-400">65% Doluluk</span>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>

                              {/* Data Table Section */}
                              <div className="bg-white rounded-[3rem] border border-[#e3e1dd] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)] overflow-hidden">
                                   <div className="px-12 py-10 border-b border-[#e3e1dd] flex items-center justify-between bg-gray-50/30">
                                        <div className="flex items-center gap-4">
                                             <div className="size-3 rounded-full bg-[#C5A059] animate-pulse" />
                                             <h4 className="text-xl font-bold font-display text-[#141514]">Kayıtlı Tüm Bilgi Hazinesi</h4>
                                        </div>
                                        <div className="flex p-1 bg-white rounded-2xl border border-[#e3e1dd] shadow-sm">
                                             <button className="px-6 py-2.5 text-xs font-bold bg-[#171b17] text-white rounded-xl shadow-lg transition-all">Tümü</button>
                                             <button className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-[#171b17] transition-all">Yayında</button>
                                             <button className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-[#171b17] transition-all">Arşiv</button>
                                        </div>
                                   </div>

                                   {loading ? (
                                        <div className="p-40 flex flex-col items-center justify-center gap-8">
                                             <div className="relative size-24">
                                                  <div className="absolute inset-0 border-[6px] border-[#C5A059]/10 rounded-full"></div>
                                                  <div className="absolute inset-0 border-[6px] border-t-[#C5A059] rounded-full animate-spin"></div>
                                             </div>
                                             <p className="text-gray-400 font-display text-lg animate-pulse tracking-wide">Bilgiler derleniyor, lütfen bekleyiniz...</p>
                                        </div>
                                   ) : items.length === 0 ? (
                                        <div className="p-40 text-center space-y-8">
                                             <div className="size-32 rounded-full bg-[#fcfaf7] flex items-center justify-center mx-auto shadow-inner border border-[#e3e1dd]">
                                                  <span className="material-symbols-outlined text-gray-200 text-7xl">inventory_2</span>
                                             </div>
                                             <div className="space-y-3">
                                                  <p className="text-[#141514] font-bold text-2xl font-display">Henüz Kayıt Bulunmuyor</p>
                                                  <p className="text-gray-400 max-w-sm mx-auto text-[15px] leading-relaxed">İslami Günlük havuzunda henüz bir içerik bulunmuyor. Paylaşmaya başlamak için sağ üstteki butonu kullanın.</p>
                                             </div>
                                        </div>
                                   ) : (
                                        <div className="overflow-x-auto">
                                             <table className="w-full text-left">
                                                  <thead>
                                                       <tr className="bg-gray-50/50 text-[#141514]/40 text-[11px] font-bold uppercase tracking-[0.25em] border-b border-[#e3e1dd]">
                                                            <th className="px-12 py-8 w-1/2">İçerik ve Detaylar</th>
                                                            <th className="px-12 py-8 text-center">Durum</th>
                                                            <th className="px-12 py-8">Tarih Bilgisi</th>
                                                            <th className="px-12 py-8 text-right">Eylemler</th>
                                                       </tr>
                                                  </thead>
                                                  <tbody className="divide-y divide-[#e3e1dd]">
                                                       {items.map((item) => (
                                                            <tr key={item.id} className="group hover:bg-[#fcfaf7] transition-all duration-500 cursor-default">
                                                                 <td className="px-12 py-12">
                                                                      <div className="flex flex-col gap-3">
                                                                           <div className="relative">
                                                                                <p className="text-[17px] font-semibold text-[#141514] leading-[1.6] group-hover:text-[#2D5A27] transition-colors line-clamp-2">
                                                                                     {activeTab === 'verses' ? item.content_tr :
                                                                                          activeTab === 'hadiths' ? item.content :
                                                                                               activeTab === 'ilmihals' ? item.question :
                                                                                                    activeTab === 'names_of_allah' ? item.name_tr :
                                                                                                         activeTab === 'daily_content' ? `Takvim: ${item.display_date}` : ''}
                                                                                </p>
                                                                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#C5A059] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 rounded-full" />
                                                                           </div>
                                                                           {activeTab === 'verses' && (
                                                                                <div className="flex items-center gap-2">
                                                                                     <span className="size-5 rounded-md bg-[#6f9b69]/10 flex items-center justify-center">
                                                                                          <span className="material-symbols-outlined text-[10px] text-[#6f9b69]">menu_book</span>
                                                                                     </span>
                                                                                     <span className="text-[13px] text-gray-400 font-display italic font-medium tracking-wide">
                                                                                          {item.surah_name} Suresi • {item.surah_number}:{item.verse_number}
                                                                                     </span>
                                                                                </div>
                                                                           )}
                                                                      </div>
                                                                 </td>
                                                                 <td className="px-12 py-12">
                                                                      <div className="flex justify-center">
                                                                           <span className="px-5 py-2 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-widest rounded-2xl border border-emerald-100/50 flex items-center gap-2 shadow-sm">
                                                                                <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                                                                Yayında
                                                                           </span>
                                                                      </div>
                                                                 </td>
                                                                 <td className="px-12 py-12">
                                                                      <div className="flex flex-col">
                                                                           <span className="text-[15px] font-bold text-[#141514]">
                                                                                {new Date(item.created_at || item.display_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                           </span>
                                                                           <div className="flex items-center gap-2 mt-1">
                                                                                <span className="material-symbols-outlined text-[14px] text-gray-300">schedule</span>
                                                                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Sistem Kaydı</span>
                                                                           </div>
                                                                      </div>
                                                                 </td>
                                                                 <td className="px-12 py-12">
                                                                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                                           <button className="size-12 rounded-2xl bg-white text-gray-400 hover:bg-[#C5A059] hover:text-white transition-all duration-500 shadow-xl shadow-black/5 flex items-center justify-center border border-[#e3e1dd]">
                                                                                <span className="material-symbols-outlined text-[22px]">edit</span>
                                                                           </button>
                                                                           <button className="size-12 rounded-2xl bg-white text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-500 shadow-xl shadow-black/5 flex items-center justify-center border border-[#e3e1dd]">
                                                                                <span className="material-symbols-outlined text-[22px]">delete</span>
                                                                           </button>
                                                                      </div>
                                                                 </td>
                                                            </tr>
                                                       ))}
                                                  </tbody>
                                             </table>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </main>
               </div>

               {/* Add Content Modal */}
               <AnimatePresence>
                    {showModal && (
                         <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 overflow-y-auto no-scrollbar">
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-[#171b17]/80 backdrop-blur-2xl" />
                              <motion.div
                                   initial={{ scale: 0.98, opacity: 0, y: 30 }}
                                   animate={{ scale: 1, opacity: 1, y: 0 }}
                                   exit={{ scale: 0.98, opacity: 0, y: 30 }}
                                   className="w-full max-w-5xl bg-white rounded-[3.5rem] shadow-[0_48px_128px_-16px_rgba(0,0,0,0.6)] overflow-hidden relative z-[110] flex flex-col border border-white/10"
                              >
                                   <form onSubmit={handleSubmit} className="flex flex-col h-full">
                                        <div className="px-16 py-12 bg-gradient-to-br from-[#171b17] via-[#1b2b1a] to-[#2D5A27] text-white flex items-center justify-between relative overflow-hidden">
                                             <div className="absolute top-0 right-0 w-96 h-96 bg-islamic-pattern opacity-10 translate-x-1/2 -translate-y-1/2 rotate-12" />
                                             <div className="relative z-10">
                                                  <h3 className="text-4xl font-bold font-display leading-tight tracking-tight">İlim Hazinesine Yeni Ekleme</h3>
                                                  <p className="text-white/50 text-lg mt-2 font-medium">Hayra vesile olan, o hayrı işlemiş gibidir.</p>
                                             </div>
                                             <button type="button" onClick={() => setShowModal(false)} className="size-14 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-all duration-500 hover:rotate-90 group relative z-10">
                                                  <span className="material-symbols-outlined text-3xl">close</span>
                                             </button>
                                        </div>

                                        <div className="p-16 space-y-12 max-h-[60vh] overflow-y-auto no-scrollbar bg-[#FDFBF7]">
                                             <div className="grid grid-cols-3 gap-12">
                                                  <div className="col-span-1 flex flex-col gap-4">
                                                       <label className="text-[12px] font-bold text-[#C5A059] uppercase tracking-[0.3em]">İçerik Kategorisi</label>
                                                       <div className="space-y-3">
                                                            {[
                                                                 { id: 'verses', label: '📖 Ayet-i Kerime' },
                                                                 { id: 'hadiths', label: '📜 Hadis-i Şerif' },
                                                                 { id: 'ilmihals', label: '📚 İlmihal Rehberi' },
                                                                 { id: 'names_of_allah', label: '✨ Esma-ül Hüsna' }
                                                            ].map(opt => (
                                                                 <button
                                                                      key={opt.id}
                                                                      type="button"
                                                                      onClick={() => setFormData({ ...formData, type: opt.id })}
                                                                      className={`w-full h-16 rounded-2xl border-2 px-6 flex items-center justify-between font-bold text-[15px] transition-all duration-300 ${formData.type === opt.id ? 'bg-[#1b2b1a] border-[#1b2b1a] text-white shadow-xl' : 'bg-white border-[#e3e1dd] text-gray-500 hover:border-[#C5A059]/50'}`}
                                                                 >
                                                                      <span>{opt.label}</span>
                                                                      {formData.type === opt.id && <span className="material-symbols-outlined text-xl">check_circle</span>}
                                                                 </button>
                                                            ))}
                                                       </div>
                                                  </div>

                                                  <div className="col-span-2 space-y-10">
                                                       {formData.type === 'verses' && (
                                                            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                                                                 <div className="flex flex-col gap-4">
                                                                      <label className="text-[12px] font-bold text-[#141514] uppercase tracking-[0.3em] flex items-center gap-2">
                                                                           Arapça Kelâmullah
                                                                           <span className="text-[10px] bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded-full">Harekelere Dikkat Ediniz</span>
                                                                      </label>
                                                                      <textarea dir="rtl" value={formData.content_ar} onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })} className="w-full rounded-[2.5rem] border-2 border-[#e3e1dd] bg-white text-5xl calligraphy px-12 py-14 leading-[2] focus:ring-8 focus:ring-[#C5A059]/5 focus:border-[#C5A059] transition-all resize-none shadow-inner" rows="3" placeholder="...يَا أَيُّهَا الَّذِينَ آمَنُوا" />
                                                                 </div>
                                                                 <div className="flex flex-col gap-4">
                                                                      <label className="text-[12px] font-bold text-[#141514] uppercase tracking-[0.3em]">Türkçe Kelâm Meali</label>
                                                                      <textarea value={formData.content_tr} onChange={(e) => setFormData({ ...formData, content_tr: e.target.value })} className="w-full rounded-3xl border-2 border-[#e3e1dd] bg-white text-lg font-medium p-8 leading-relaxed focus:ring-8 focus:ring-[#C5A059]/5 focus:border-[#C5A059] transition-all resize-none shadow-inner" rows="4" placeholder="Rahman ve Rahim olan Allah'ın adıyla..." />
                                                                 </div>
                                                                 <div className="grid grid-cols-3 gap-6">
                                                                      {['Sure Adı', 'Sure No', 'Ayet No'].map((f, i) => (
                                                                           <div key={f} className="flex flex-col gap-2">
                                                                                <label className="text-[11px] font-bold text-gray-400 tracking-widest px-1">{f}</label>
                                                                                <input
                                                                                     placeholder={['Örn: Bakara', '2', '153'][i]}
                                                                                     type={i > 0 ? 'number' : 'text'}
                                                                                     value={formData[i === 0 ? 'surah_name' : i === 1 ? 'surah_number' : 'verse_number']}
                                                                                     onChange={(e) => setFormData({ ...formData, [i === 0 ? 'surah_name' : i === 1 ? 'surah_number' : 'verse_number']: e.target.value })}
                                                                                     className="h-16 rounded-2xl border-2 border-[#e3e1dd] bg-white px-6 font-bold text-gray-700 focus:ring-0 focus:border-[#C5A059] transition-all shadow-sm"
                                                                                />
                                                                           </div>
                                                                      ))}
                                                                 </div>
                                                            </div>
                                                       )}

                                                       {formData.type === 'hadiths' && (
                                                            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                                                                 <div className="flex flex-col gap-4">
                                                                      <label className="text-[12px] font-bold text-[#141514] uppercase tracking-[0.3em]">Hadis-i Şerif Metni</label>
                                                                      <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full rounded-[2.5rem] border-2 border-[#e3e1dd] bg-white text-[19px] font-medium p-12 leading-[1.8] focus:ring-8 focus:ring-[#C5A059]/5 focus:border-[#C5A059] transition-all resize-none shadow-inner" rows="6" placeholder="Peygamber Efendimiz (s.a.v.) buyurdu ki..." />
                                                                 </div>
                                                                 <div className="grid grid-cols-2 gap-8">
                                                                      <div className="flex flex-col gap-4">
                                                                           <label className="text-[12px] font-bold text-[#141514] uppercase tracking-[0.3em]">Sıhhatli Kaynak</label>
                                                                           <input placeholder="Buhari, Müslim, Tirmizi vb." value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="h-16 rounded-2xl border-2 border-[#e3e1dd] bg-white px-8 font-bold focus:ring-0 focus:border-[#C5A059] transition-all shadow-sm" />
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       )}

                                                       {/* Logic can be extended for ilmihal and names as well */}
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="px-16 py-12 bg-white border-t border-[#e3e1dd] flex items-center justify-between">
                                             <button type="button" onClick={() => setShowModal(false)} className="text-[13px] font-bold text-gray-400 hover:text-gray-950 uppercase tracking-[0.4em] transition-all">Vazgeç</button>
                                             <div className="flex gap-6">
                                                  <button type="submit" className="px-16 py-5 bg-[#171b17] text-white rounded-[1.5rem] font-bold text-[17px] shadow-[0_24px_48px_-12px_rgba(23,27,23,0.4)] hover:bg-[#2D5A27] hover:-translate-y-2 transition-all duration-500 active:scale-95">İçeriği Tasdıkla ve Yayınla</button>
                                             </div>
                                        </div>
                                   </form>
                              </motion.div>
                         </div>
                    )}
               </AnimatePresence>
          </div>
     )
}

export default AdminPanel
