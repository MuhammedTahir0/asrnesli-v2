import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { ADMIN_EMAIL } from '../../services/authService'

const TURKISH_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const HIJRI_MONTHS = ['Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce']

import { haptic } from '../../utils/haptic'

const Layout = ({ children }) => {
     const location = useLocation()
     const handleNavClick = () => haptic('light')
     const { user, logout } = useAuth()
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

     // Filter menu items based on admin status
     const visibleMenuItems = menuItems.filter(item => {
          if (item.admin) {
               return user?.email === ADMIN_EMAIL
          }
          return true
     })

     const isAdminPage = location.pathname === '/admin'

     if (isAdminPage) {
          return <div className="min-h-screen w-full font-display antialiased">{children}</div>
     }

     return (
          <div className="relative h-screen w-full flex flex-col max-w-md mx-auto overflow-hidden shadow-2xl bg-background-light dark:bg-background-dark font-display antialiased transition-colors duration-300">
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
                                   className="absolute top-0 left-0 h-full w-[80%] bg-surface-light dark:bg-background-dark z-[70] shadow-2xl border-r border-accent-gold/10 flex flex-col"
                              >
                                   {/* Sidebar Header */}
                                   <div className="p-8 bg-gradient-to-br from-primary to-accent-green text-white overflow-hidden relative">
                                        <div className="absolute inset-0 opacity-20 bg-islamic-pattern scale-150"></div>
                                        <div className="relative z-10 flex flex-col gap-6">
                                             <div className="flex justify-between items-start">
                                                  <div className="size-16 rounded-[1.25rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transform -rotate-6">
                                                       <span className="material-symbols-outlined text-accent-gold text-4xl">mosque</span>
                                                  </div>
                                                  <button
                                                       onClick={() => { setIsSidebarOpen(false); handleNavClick(); }}
                                                       className="size-10 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-all active:scale-90"
                                                  >
                                                       <span className="material-symbols-outlined text-accent-gold text-xl">close</span>
                                                  </button>
                                             </div>
                                             <div>
                                                  <h2 className="text-2xl font-bold font-serif tracking-tight text-accent-gold">Asr Nesli</h2>
                                                  <p className="text-accent-gold/60 text-[10px] uppercase font-bold tracking-widest">İslami Yaşam Rehberi</p>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Sidebar Links */}
                                   <nav className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-2">
                                        {visibleMenuItems.map((item) => (
                                             <Link
                                                  key={item.path}
                                                  to={item.path}
                                                  onClick={() => { setIsSidebarOpen(false); handleNavClick(); }}
                                                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${location.pathname === item.path
                                                       ? 'bg-accent-gold/10 text-accent-gold'
                                                       : 'text-text-secondary hover:bg-black/5 dark:hover:bg-accent-gold/5 hover:text-primary dark:hover:text-accent-gold'
                                                       }`}
                                             >
                                                  <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${location.pathname === item.path ? 'fill-1 scale-110 text-accent-gold-text' : 'group-hover:scale-110'
                                                       }`}>
                                                       {item.icon}
                                                  </span>
                                                  <span className={`text-sm tracking-wide transition-all ${location.pathname === item.path ? 'font-bold' : 'font-medium'}`}>
                                                       {item.title}
                                                  </span>
                                                  {item.admin && (
                                                       <span className="ml-auto text-[8px] font-bold uppercase tracking-widest bg-accent-gold/20 text-accent-gold px-2 py-1 rounded-md">Admin</span>
                                                  )}
                                             </Link>
                                        ))}

                                        <button
                                             onClick={() => { logout(); handleNavClick(); }}
                                             className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600"
                                        >
                                             <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">logout</span>
                                             <span className="text-sm font-medium tracking-wide">Çıkış Yap</span>
                                        </button>
                                   </nav>

                                   {/* Sidebar Footer */}
                                   <div className="p-6 border-t border-gray-100 dark:border-white/5">
                                        <p className="text-[10px] text-center text-text-secondary/50 font-sans tracking-widest uppercase">v1.2.0 Beta</p>
                                   </div>
                              </motion.aside>
                         </>
                    )}
               </AnimatePresence>

               {/* Yapışkan Başlık */}
               <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-accent-gold/20">
                    <div className="flex items-center justify-between px-6 py-4">
                         <button
                              onClick={() => { setIsSidebarOpen(true); handleNavClick(); }}
                              className="size-10 rounded-full bg-surface-light dark:bg-surface-dark border border-accent-gold/20 flex items-center justify-center text-primary dark:text-accent-gold transition-all hover:bg-accent-gold/10 active:scale-95 shadow-sm"
                         >
                              <span className="material-symbols-outlined text-[24px]">menu</span>
                         </button>
                         <div className="flex flex-col items-center">
                              <p className="text-[10px] font-bold tracking-widest uppercase text-accent-gold mb-0.5">
                                   {dateInfo.hijri === null ? 'Yükleniyor...' : dateInfo.hijri}
                              </p>
                              <p className="text-text-secondary dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">{dateInfo.gregorian}</p>
                         </div>
                         <button
                              onClick={handleNavClick}
                              className="size-10 rounded-full bg-surface-light dark:bg-surface-dark border border-accent-gold/20 flex items-center justify-center text-primary dark:text-accent-gold transition-all hover:bg-accent-gold/10 relative active:scale-95 shadow-sm"
                         >
                              <span className="material-symbols-outlined text-[24px]">notifications</span>
                              <span className="absolute top-2.5 right-2.5 size-2 bg-red-600 rounded-full border-2 border-surface-light dark:border-background-dark"></span>
                         </button>
                    </div>
               </header>

               {/* Ana İçerik */}
               <main className="flex-1 flex flex-col relative min-h-0 overflow-auto">
                    {children}
               </main>

               {/* Alt Navigasyon */}
               <nav className="fixed bottom-0 w-full max-w-md bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-accent-gold/20 pb-safe pt-2 z-50">
                    <div className="flex items-center justify-around px-2 pb-4">
                         <Link to="/" onClick={handleNavClick} className={`flex flex-col items-center gap-1 p-2 group transition-all ${location.pathname === '/' ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold/70'}`}>
                              <div className="relative">
                                   <span className={`material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-300 ${location.pathname === '/' ? 'fill-1' : ''}`}>home</span>
                                   {location.pathname === '/' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(197,160,89,0.8)]"></span>}
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-widest">Ana Sayfa</span>
                         </Link>
                         <Link to="/prayer" onClick={handleNavClick} className={`flex flex-col items-center gap-1 p-2 group transition-all ${location.pathname === '/prayer' ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold/70'}`}>
                              <span className={`material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-300 ${location.pathname === '/prayer' ? 'fill-1' : ''}`}>mosque</span>
                              <span className="text-[9px] font-bold uppercase tracking-widest">Ezan</span>
                         </Link>

                         {/* Orta Buton (Kategoriler) */}
                         <div className="relative -top-6">
                              <Link to="/categories" onClick={handleNavClick} className={`flex items-center justify-center size-14 rounded-2xl transition-all hover:scale-105 active:scale-95 border-2 border-white dark:border-background-dark shadow-gold ${location.pathname === '/categories' ? 'bg-accent-gold text-white' : 'bg-primary text-accent-gold'}`}>
                                   <span className="material-symbols-outlined text-[28px]">grid_view</span>
                              </Link>
                         </div>

                         <Link to="/qibla" onClick={handleNavClick} className={`flex flex-col items-center gap-1 p-2 group transition-all ${location.pathname === '/qibla' ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold/70'}`}>
                              <span className={`material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-300 ${location.pathname === '/qibla' ? 'fill-1' : ''}`}>explore</span>
                              <span className="text-[9px] font-bold uppercase tracking-widest">Kıble</span>
                         </Link>
                         <Link to="/profile" onClick={handleNavClick} className={`flex flex-col items-center gap-1 p-2 group transition-all ${location.pathname === '/profile' ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold/70'}`}>
                              <span className={`material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-300 ${location.pathname === '/profile' ? 'fill-1' : ''}`}>person</span>
                              <span className="text-[9px] font-bold uppercase tracking-widest">Profil</span>
                         </Link>
                    </div>
               </nav>
          </div>
     )
}

export default Layout
