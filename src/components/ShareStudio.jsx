import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'

const ShareStudio = () => {
     const [selectedStyle, setSelectedStyle] = useState('asil')
     const [isProcessing, setIsProcessing] = useState(false)
     const cardRef = useRef(null)

     const styles = [
          { id: 'asil', name: 'Asil Yeşil', color: 'bg-[#2D5A27]' },
          { id: 'krem', name: 'Krem Altın', color: 'bg-[#F0EAD6]' },
          { id: 'osmanli', name: 'Osmanlı', color: 'bg-[#3E2723]' },
          { id: 'gece', name: 'Gece', color: 'bg-[#1a1a1a]' },
          { id: 'sade', name: 'Sade', color: 'bg-white' },
          { id: 'lale', name: 'Lale Devri', color: 'bg-[#8B0000]' },
          { id: 'sultan', name: 'Sultan', color: 'bg-[#1a237e]' },
          { id: 'safir', name: 'Safir', color: 'bg-[#004d40]' },
          { id: 'toprak', name: 'Toprak', color: 'bg-[#4e342e]' },
     ]

     const getCardStyle = () => {
          switch (selectedStyle) {
               case 'krem': return 'bg-[#F0EAD6] text-[#3E2723] border-[#cda151]/30'
               case 'osmanli': return 'bg-[#3E2723] text-white border-[#cda151]/30'
               case 'gece': return 'bg-[#1a1a1a] text-white border-white/20'
               case 'sade': return 'bg-white text-gray-900 border-black/10'
               case 'lale': return 'bg-[#8B0000] text-white border-white/20'
               case 'sultan': return 'bg-[#1a237e] text-white border-white/20'
               case 'safir': return 'bg-[#004d40] text-white border-white/20'
               case 'toprak': return 'bg-[#4e342e] text-white border-white/20'
               default: return 'bg-botanical text-white border-primary/60'
          }
     }

     const handleDownload = async () => {
          if (!cardRef.current || isProcessing) return
          setIsProcessing(true)
          try {
               const canvas = await html2canvas(cardRef.current, {
                    scale: 3, // High quality
                    useCORS: true,
                    backgroundColor: null,
               })
               const image = canvas.toDataURL('image/png', 1.0)
               const link = document.createElement('a')
               link.download = `islami-gunluk-${new Date().getTime()}.png`
               link.href = image
               link.click()
          } catch (err) {
               console.error('İndirme hatası:', err)
               alert('Görüntü oluşturulurken bir hata oluştu.')
          } finally {
               setIsProcessing(false)
          }
     }

     const handleShare = async () => {
          if (!cardRef.current || isProcessing) return
          setIsProcessing(true)
          try {
               const canvas = await html2canvas(cardRef.current, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: null,
               })
               const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
               const file = new File([blob], 'islami-gunluk.png', { type: 'image/png' })

               if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                         files: [file],
                         title: 'İslami Günlük',
                         text: 'Günün ayeti/hadisi sizinle.'
                    })
               } else {
                    // Fallback to direct link download if sharing is not supported
                    handleDownload()
               }
          } catch (err) {
               console.error('Paylaşım hatası:', err)
          } finally {
               setIsProcessing(false)
          }
     }

     return (
          <div className="flex-1 flex flex-col w-full bg-background-light dark:bg-background-dark font-display antialiased overflow-x-hidden text-gray-900 dark:text-white">
               {/* Header */}
               <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5">
                    <Link to="/" className="text-accent-gold hover:text-accent-gold/80 transition-transform active:scale-95 p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                         <span className="material-symbols-outlined text-3xl">arrow_back</span>
                    </Link>
                    <h2 className="text-lg font-bold tracking-tight text-center">Paylaşım Stüdyosu</h2>
                    <div className="w-10"></div>
               </header>

               {/* Main Content */}
               <div className="flex-1 flex flex-col w-full max-w-lg mx-auto pb-[380px]">
                    {/* Preview Canvas Area */}
                    <div className="relative w-full px-8 py-8 flex flex-col items-center">
                         {/* Card Container for html2canvas */}
                         <div ref={cardRef} className="w-full">
                              <motion.div
                                   layout
                                   className={`group relative w-full aspect-[4/5] rounded-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-[6px] border-double flex flex-col items-center text-center overflow-hidden transform transition-all duration-500 ${getCardStyle()}`}
                              >
                                   {/* Silk Sheen Gradient Overlay */}
                                   <div className="absolute inset-0 bg-silk-sheen opacity-40 mix-blend-soft-light pointer-events-none"></div>

                                   {/* Ornamental Corners */}
                                   <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-accent-gold rounded-tl-xl opacity-80"></div>
                                   <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-accent-gold rounded-tr-xl opacity-80"></div>
                                   <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-accent-gold rounded-bl-xl opacity-80"></div>
                                   <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-accent-gold rounded-br-xl opacity-80"></div>

                                   {/* Card Content */}
                                   <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-8 py-10 gap-6">
                                        <span className="material-symbols-outlined text-accent-gold text-4xl opacity-80">format_quote</span>
                                        <p className="text-xl md:text-2xl leading-relaxed font-medium drop-shadow-sm px-4">
                                             Kolaylaştırınız, zorlaştırmayınız.<br />
                                             Müjdeleyiniz, nefret ettirmeyiniz.
                                        </p>
                                        {/* Divider */}
                                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-70 mt-2"></div>
                                   </div>

                                   {/* Card Footer */}
                                   <div className="relative z-10 w-full pb-6 flex flex-col items-center gap-1">
                                        <span className="text-accent-gold text-[11px] uppercase tracking-[0.2em] font-bold">İslami Günlük</span>
                                        <span className="opacity-60 text-[10px] italic font-light tracking-wide">Buhari, İlim, 11</span>
                                   </div>
                              </motion.div>
                         </div>
                         {/* Reflection/Ground Shadow */}
                         <div className="w-[80%] h-4 bg-black/40 blur-xl rounded-[100%] mt-[-10px]"></div>
                    </div>

                    {/* Style Selector */}
                    <div className="mt-2 px-4">
                         <h3 className="text-xl font-bold px-2 mb-4 text-text-primary dark:text-white/90">Kart Stilini Seç</h3>
                         <div className="flex overflow-x-auto gap-4 pb-6 px-2 scrollbar-hide snap-x no-scrollbar">
                              {styles.map((style) => (
                                   <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={`snap-center shrink-0 flex flex-col items-center gap-2 group focus:outline-none transition-all ${selectedStyle === style.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                   >
                                        <div className={`w-20 h-20 rounded-2xl border-2 p-1 transition-all ${selectedStyle === style.id ? 'border-accent-gold shadow-lg shadow-accent-gold/10 scale-105' : 'border-transparent'}`}>
                                             <div className={`w-full h-full rounded-xl relative overflow-hidden flex items-center justify-center ${style.color}`}>
                                                  <div className="absolute inset-0 bg-silk-sheen opacity-50"></div>
                                                  {selectedStyle === style.id && <span className="material-symbols-outlined text-accent-gold text-xl drop-shadow-md">check</span>}
                                             </div>
                                        </div>
                                        <span className={`text-xs tracking-wide ${selectedStyle === style.id ? 'text-accent-gold font-bold' : 'text-text-secondary font-medium'}`}>{style.name}</span>
                                   </button>
                              ))}
                         </div>
                    </div>
               </div>

               {/* Flash Designer Optimized Action Module */}
               <div className="fixed bottom-[84px] left-0 w-full z-40 px-6 pointer-events-none">
                    <div className="max-w-md mx-auto pointer-events-auto">
                         <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="relative mb-6 rounded-[2.5rem] bg-[#1a2b1a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
                         >
                              {/* Loading Overlay */}
                              {isProcessing && (
                                   <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                                        <div className="flex flex-col items-center gap-3">
                                             <div className="size-10 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin"></div>
                                             <span className="text-white text-xs font-bold uppercase tracking-widest">Hazırlanıyor...</span>
                                        </div>
                                   </div>
                              )}

                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent"></div>

                              <div className="p-7 space-y-6">
                                   <div className="flex gap-4">
                                        <button
                                             onClick={handleDownload}
                                             disabled={isProcessing}
                                             className="flex-[2.5] relative group overflow-hidden h-16 bg-accent-gold rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 active:scale-[0.98] shadow-2xl shadow-accent-gold/20 disabled:opacity-50"
                                        >
                                             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                             <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                                             <span className="material-symbols-outlined text-background-dark text-2xl font-bold">download</span>
                                             <span className="text-background-dark font-black tracking-tighter text-lg uppercase">Görüntüyü Kaydet</span>
                                        </button>

                                        <button
                                             onClick={handleShare}
                                             disabled={isProcessing}
                                             className="flex-1 size-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/90 hover:bg-white/10 active:scale-90 transition-all group disabled:opacity-50"
                                        >
                                             <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">share</span>
                                        </button>
                                   </div>

                                   <div className="flex items-center justify-between border-t border-white/5 pt-5 px-1">
                                        <div className="flex flex-col">
                                             <span className="text-[10px] font-black text-accent-gold uppercase tracking-[0.3em]">Hızlı Aktarım</span>
                                             <span className="text-white/40 text-[11px] font-medium">Sosyal Medya Formatları</span>
                                        </div>
                                        <div className="flex gap-3">
                                             {[
                                                  { icon: 'camera_alt', color: 'bg-white/5', action: handleDownload },
                                                  { icon: 'send', color: 'bg-white/5', action: handleShare },
                                                  { icon: 'grid_view', color: 'bg-white/5', action: handleShare }
                                             ].map((item, i) => (
                                                  <button
                                                       key={i}
                                                       onClick={item.action}
                                                       disabled={isProcessing}
                                                       className={`size-11 rounded-full ${item.color} flex items-center justify-center text-white/70 hover:text-accent-gold hover:bg-white/10 transition-all border border-white/5 active:scale-90 disabled:opacity-50`}
                                                  >
                                                       <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                                  </button>
                                             ))}
                                        </div>
                                   </div>
                              </div>
                         </motion.div>
                    </div>
               </div>
          </div>
     )
}

export default ShareStudio
