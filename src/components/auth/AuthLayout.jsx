// AsrNesli Auth Layout
// İslami-Lüks tasarımlı kimlik doğrulama sayfaları için ortak layout

import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// Geometrik İslami desen SVG
const IslamicPattern = () => (
     <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
               <pattern id="islamic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path
                         d="M50 0L100 50L50 100L0 50Z M50 25L75 50L50 75L25 50Z"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="0.5"
                    />
                    <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    <circle cx="0" cy="0" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    <circle cx="100" cy="0" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    <circle cx="0" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
               </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
     </svg>
)

// Yıldız dekorasyonları
const StarDecoration = ({ className }) => (
     <motion.div
          className={`absolute text-[#C5A059]/20 ${className}`}
          animate={{
               opacity: [0.2, 0.5, 0.2],
               scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
     >
          ✦
     </motion.div>
)

const AuthLayout = ({ children, title, subtitle }) => {
     return (
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a1a0a] via-[#0f2a0f] to-[#0a1a0a] overflow-hidden">
               {/* Arka Plan Desenleri */}
               <div className="fixed inset-0 pointer-events-none">
                    <IslamicPattern />

                    {/* Işık efektleri */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2D5A27]/20 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[120px]" />

                    {/* Yıldız dekorasyonları */}
                    <StarDecoration className="top-[10%] left-[15%] text-3xl" />
                    <StarDecoration className="top-[20%] right-[20%] text-2xl" />
                    <StarDecoration className="bottom-[15%] left-[25%] text-xl" />
                    <StarDecoration className="top-[40%] right-[10%] text-2xl" />
               </div>

               {/* İçerik */}
               <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                    {/* Logo ve Başlık */}
                    <motion.div
                         className="text-center mb-8"
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.6 }}
                    >
                         {/* Bismillah */}
                         <motion.div
                              className="text-[#C5A059]/60 text-lg font-amiri mb-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                         >
                              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                         </motion.div>

                         {/* Logo */}
                         <Link to="/" className="inline-block">
                              <motion.div
                                   className="flex items-center justify-center gap-3"
                                   whileHover={{ scale: 1.02 }}
                              >
                                   <div className="size-12 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#1a3a1a] flex items-center justify-center border border-[#C5A059]/30 shadow-lg shadow-[#C5A059]/10">
                                        <span className="text-[#C5A059] text-xl">☪</span>
                                   </div>
                                   <div className="text-left">
                                        <h1 className="text-2xl font-bold text-white tracking-wide">
                                             Asr<span className="text-[#C5A059]">Nesli</span>
                                        </h1>
                                        <p className="text-[10px] text-[#C5A059]/60 uppercase tracking-[0.3em]">
                                             İslami Yaşam
                                        </p>
                                   </div>
                              </motion.div>
                         </Link>
                    </motion.div>

                    {/* Kart */}
                    <motion.div
                         className="w-full max-w-md"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.6, delay: 0.1 }}
                    >
                         {/* Altın çerçeve efekti */}
                         <div className="relative">
                              {/* Dış glow */}
                              <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/10 to-[#C5A059]/20 rounded-3xl blur-xl" />

                              {/* Kart */}
                              <div className="relative bg-[#0f1f0f]/90 backdrop-blur-xl rounded-2xl border border-[#C5A059]/20 overflow-hidden">
                                   {/* Üst altın çizgi */}
                                   <div className="h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

                                   {/* Başlık alanı */}
                                   {(title || subtitle) && (
                                        <div className="px-8 pt-8 pb-4 text-center">
                                             {title && (
                                                  <h2 className="text-xl font-bold text-white mb-1">
                                                       {title}
                                                  </h2>
                                             )}
                                             {subtitle && (
                                                  <p className="text-sm text-gray-400">
                                                       {subtitle}
                                                  </p>
                                             )}
                                        </div>
                                   )}

                                   {/* İçerik */}
                                   <div className="px-8 pb-8">
                                        {children}
                                   </div>

                                   {/* Alt altın çizgi */}
                                   <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />
                              </div>
                         </div>
                    </motion.div>

                    {/* Alt bilgi */}
                    <motion.p
                         className="mt-8 text-center text-xs text-gray-500"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.5 }}
                    >
                         © 2026 AsrNesli. Tüm hakları saklıdır.
                    </motion.p>
               </div>
          </div>
     )
}

export default AuthLayout
