import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const TURKISH_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const HIJRI_MONTHS = ['Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce']

const Layout = ({ children }) => {
     const location = useLocation()
     const props = { ...children.props }
     const [isSidebarOpen, setIsSidebarOpen] = useState(false)
     // hijri başlangıçta null (yükleniyor), hata/yoksa boş string
     const [dateInfo, setDateInfo] = useState({ gregorian: '', hijri: null })

     useEffect(() => {
          const fetchHijriDate = async () => {
               const today = new Date()
               const day = today.getDate()
               const month = today.getMonth() + 1
               const year = today.getFullYear()

               // Miladi tarih formatla
               const gregorianDate = `${day} ${TURKISH_MONTHS[today.getMonth()]} ${year}`

               // Başlangıçta sadece miladi tarihi set et, hijri null kalsın
               setDateInfo(prev => ({ ...prev, gregorian: gregorianDate }))

               try {
                    // Endpoint düzeltildi: gpiToHijri -> gToH
                    const response = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`)
                    const data = await response.json()
                    if (data.code === 200) {
                         const h = data.data.hijri
                         const hijriMonthIndex = parseInt(h.month.number) - 1
                         const hijriDate = `${h.day} ${HIJRI_MONTHS[hijriMonthIndex]} ${h.year}`
                         setDateInfo({ gregorian: gregorianDate, hijri: hijriDate })
                    } else {
                         // API hatası - boş string ata (yükleniyor gösterme)
                         setDateInfo({ gregorian: gregorianDate, hijri: '' })
                    }
               } catch (err) {
                    console.error("Hicri tarih hatası:", err)
                    // Network hatası - boş string ata
                    setDateInfo({ gregorian: gregorianDate, hijri: '' })
               }
          }
          fetchHijriDate()
     }, [])

     const menuItems = [
          { title: 'Ana Sayfa', icon: 'home', path: '/' },
          { title: 'Kategoriler', icon: 'grid_view', path: '/categories' },
          { title: 'Ezan Vakitleri', icon: 'mosque', path: '/prayer' },
          { title: 'Kıble Bulucu', icon: 'explore', path: '/qibla' },
          { title: 'Paylaşım Stüdyosu', icon: 'share', path: '/share' },
          { title: 'Profilim', icon: 'person', path: '/profile' },
          { title: 'Ayarlar', icon: 'settings', path: '/settings' },
          { title: 'Yönetim Paneli', icon: 'admin_panel_settings', path: '/admin', admin: true },
     ]

     const isAdminPage = location.pathname === '/admin'

     if (isAdminPage) {
          return <div className="min-h-screen w-full font-display antialiased">{children}</div>
     }

     return (
          <div className="relative min-h-screen w-full flex flex-col max-w-md mx-auto overflow-hidden shadow-2xl bg-background-light dark:bg-background-dark font-display antialiased transition-colors duration-300">
               {/* Arka Plan Deseni */}
               <div className="absolute inset-0 z-0 bg-islamic-pattern pointer-events-none opacity-50"></div>

               {/* Sidebar Overlay */}
               <AnimatePresence>
                    {isSidebarOpen && (
                         <>
                              <motion.div
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   exit={{ opacity: 0 }}
                                   onClick={() => setIsSidebarOpen(false)}
                                   className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                              />
                              <motion.aside
                                   initial={{ x: '-100%' }}
                                   animate={{ x: 0 }}
                                   exit={{ x: '-100%' }}
                                   transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                   className="absolute top-0 left-0 h-full w-[80%] bg-surface-light dark:bg-[#1a1c1a] z-[70] shadow-2xl border-r border-accent-gold/10 flex flex-col"
                              >
                                   {/* Sidebar Header */}
                                   <div className="p-8 bg-accent-green dark:bg-[#2d3a2d] text-white overflow-hidden relative">
                                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                                        <div className="relative z-10 flex flex-col gap-4">
                                             <div className="flex justify-between items-start">
                                                  <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                                       <span className="material-symbols-outlined text-accent-gold text-3xl">mosque</span>
                                                  </div>
                                                  <button
                                                       onClick={() => setIsSidebarOpen(false)}
                                                       className="size-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
                                                  >
                                                       <span className="material-symbols-outlined text-white">close</span>
                                                  </button>
                                             </div>
                                             <div>
                                                  <h2 className="text-xl font-bold font-serif">Asr Nesli</h2>
                                                  <p className="text-white/60 text-xs font-sans tracking-wide">Hakkı ve Sabrı Tavsiye Edenler</p>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Sidebar Links */}
                                   <nav className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-1">
                                        {menuItems.map((item) => (
                                             <Link
                                                  key={item.path}
                                                  to={item.path}
                                                  onClick={() => setIsSidebarOpen(false)}
                                                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${location.pathname === item.path
                                                       ? 'bg-accent-green/10 text-accent-green dark:text-primary'
                                                       : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-white/5 hover:text-text-primary dark:hover:text-white'
                                                       }`}
                                             >
                                                  <span className={`material-symbols-outlined text-[24px] ${location.pathname === item.path ? 'fill-1' : 'group-hover:scale-110 transition-transform'
                                                       }`}>
                                                       {item.icon}
                                                  </span>
                                                  <span className={`text-sm tracking-wide ${location.pathname === item.path ? 'font-bold' : 'font-medium'}`}>
                                                       {item.title}
                                                  </span>
                                                  {item.admin && (
                                                       <span className="ml-auto text-[8px] font-bold uppercase tracking-tighter bg-accent-gold/10 text-accent-gold px-1.5 py-0.5 rounded">Admin</span>
                                                  )}
                                             </Link>
                                        ))}
                                   </nav>

                                   {/* Sidebar Footer */}
                                   <div className="p-6 border-t border-gray-100 dark:border-white/5">
                                        <button className="w-full flex items-center gap-3 text-red-500 font-bold text-sm px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                             <span className="material-symbols-outlined">logout</span>
                                             Çıkış Yap
                                        </button>
                                        <p className="mt-4 text-[10px] text-center text-text-secondary/50 font-sans tracking-widest uppercase">v1.2.0 Beta</p>
                                   </div>
                              </motion.aside>
                         </>
                    )}
               </AnimatePresence>

               {/* Yapışkan Başlık */}
               <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-accent-gold/20">
                    <div className="flex items-center justify-between px-6 py-4">
                         <button
                              onClick={() => setIsSidebarOpen(true)}
                              className="text-accent-green dark:text-primary transition-opacity hover:opacity-70 active:scale-95"
                         >
                              <span className="material-symbols-outlined text-[28px]">menu</span>
                         </button>
                         <div className="flex flex-col items-center">
                              <p className="text-xs font-bold tracking-widest uppercase text-accent-gold mb-0.5">
                                   {dateInfo.hijri === null ? 'Yükleniyor...' : dateInfo.hijri}
                              </p>
                              <p className="text-text-secondary text-[10px] font-sans tracking-wide">{dateInfo.gregorian}</p>
                         </div>
                         <button className="text-accent-green dark:text-primary transition-opacity hover:opacity-70 relative active:scale-95">
                              <span className="material-symbols-outlined text-[28px]">notifications</span>
                              <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-background-light"></span>
                         </button>
                    </div>
               </header>

               {/* Ana İçerik */}
               <main className="flex-1 flex flex-col relative">
                    {children}
               </main>

               {/* Alt Navigasyon */}
               <nav className="fixed bottom-0 w-full max-w-md bg-surface-light/95 dark:bg-[#171b17]/95 backdrop-blur-xl border-t border-accent-gold/20 pb-safe pt-2 z-50">
                    <div className="flex items-center justify-around px-2 pb-4">
                         <Link to="/" className={`flex flex-col items-center gap-1 p-2 group ${location.pathname === '/' ? 'text-accent-green dark:text-primary' : 'text-text-secondary'}`}>
                              <div className="relative">
                                   <span className={`material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-300 ${location.pathname === '/' ? 'fill-1' : ''}`}>home</span>
                                   {location.pathname === '/' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-green dark:bg-primary"></span>}
                              </div>
                              <span className="text-[10px] font-medium">Ana Sayfa</span>
                         </Link>
                         <Link to="/prayer" className={`flex flex-col items-center gap-1 p-2 group ${location.pathname === '/prayer' ? 'text-accent-green dark:text-primary' : 'text-text-secondary hover:text-accent-green dark:hover:text-primary'}`}>
                              <span className={`material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-300 ${location.pathname === '/prayer' ? 'fill-1' : ''}`}>mosque</span>
                              <span className="text-[10px] font-medium">Ezan</span>
                         </Link>

                         {/* Orta Buton (Kategoriler) */}
                         <div className="relative -top-6">
                              <Link to="/categories" className={`flex items-center justify-center size-14 rounded-full transition-all hover:scale-105 border-4 border-background-light dark:border-background-dark shadow-[0_8px_16px_rgba(45,90,39,0.3)] ${location.pathname === '/categories' ? 'bg-accent-gold text-white' : 'bg-accent-green dark:bg-primary text-white'}`}>
                                   <span className="material-symbols-outlined text-[28px]">grid_view</span>
                              </Link>
                         </div>

                         <Link to="/qibla" className={`flex flex-col items-center gap-1 p-2 group ${location.pathname === '/qibla' ? 'text-accent-green dark:text-primary' : 'text-text-secondary hover:text-accent-green dark:hover:text-primary'}`}>
                              <span className={`material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-300 ${location.pathname === '/qibla' ? 'fill-1' : ''}`}>explore</span>
                              <span className="text-[10px] font-medium">Kıble</span>
                         </Link>
                         <Link to="/profile" className={`flex flex-col items-center gap-1 p-2 group ${location.pathname === '/profile' ? 'text-accent-green dark:text-primary' : 'text-text-secondary hover:text-accent-green dark:hover:text-primary'}`}>
                              <span className={`material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-300 ${location.pathname === '/profile' ? 'fill-1' : ''}`}>person</span>
                              <span className="text-[10px] font-medium">Profil</span>
                         </Link>
                    </div>
               </nav>
          </div>
     )
}

export default Layout
