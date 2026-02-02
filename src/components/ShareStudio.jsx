import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import html2canvas from 'html2canvas'

const ShareStudio = () => {
     const location = useLocation()
     const [isProcessing, setIsProcessing] = useState(false)
     const cardRef = useRef(null)
     const fileInputRef = useRef(null)

     // State
     const [content, setContent] = useState({
          text: 'Kolaylaştırınız, zorlaştırmayınız. Müjdeleyiniz, nefret ettirmeyiniz.',
          source: 'Hz. Muhammed (s.a.v)',
          image: null
     })
     const [activeTab, setActiveTab] = useState('style') // style, size, edit
     const [aspectRatio, setAspectRatio] = useState('story') // story, portrait, square
     const [template, setTemplate] = useState('nature') // minimal, nature, classic, modern

     // Load content from navigation state if available
     useEffect(() => {
          if (location.state) {
               setContent(prev => ({
                    ...prev,
                    text: location.state.text || prev.text,
                    source: location.state.source || prev.source
               }))
          }
     }, [location.state])

     // Template Configurations
     const templates = {
          minimal: {
               id: 'minimal',
               name: 'Nur',
               icon: 'light_mode',
               container: 'bg-[#FDFBF7] text-gray-800',
               overlay: null,
               text: 'font-serif text-3xl italic leading-relaxed text-[#2c3e50]',
               source: 'text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase mt-6',
               decoration: (
                    <div className="absolute inset-4 border border-[#C5A059]/20 rounded-sm pointer-events-none" />
               )
          },
          nature: {
               id: 'nature',
               name: 'Doğa',
               icon: 'landscape',
               container: 'bg-gray-900 text-white relative overflow-hidden',
               overlay: 'absolute inset-0 bg-black/30 z-0',
               text: 'relative z-10 font-medium text-2xl md:text-3xl leading-relaxed drop-shadow-md text-center px-4',
               source: 'relative z-10 text-xs font-medium tracking-wide opacity-90 mt-4',
               decoration: null
          },
          classic: {
               id: 'classic',
               name: 'Hat',
               icon: 'history_edu',
               container: 'bg-[#1F2937] text-[#E5E7EB]',
               overlay: `absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]`,
               text: 'font-serif text-2xl leading-loose text-[#D1D5DB] px-8 border-l-2 border-[#C5A059] pl-6 italic',
               source: 'text-xs text-[#C5A059] font-bold mt-6 self-start pl-8',
               decoration: (
                    <>
                         <div className="absolute top-0 inset-x-0 h-1 bg-[#C5A059]/50" />
                         <div className="absolute bottom-0 inset-x-0 h-1 bg-[#C5A059]/50" />
                    </>
               )
          },
          modern: {
               id: 'modern',
               name: 'Gece',
               icon: 'dark_mode',
               container: 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#000000] text-white',
               overlay: null,
               text: 'font-sans font-bold text-3xl md:text-4xl tracking-tight leading-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent',
               source: 'text-xs font-bold px-3 py-1 bg-white/10 rounded-full mt-6 backdrop-blur-md',
               decoration: (
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-green/20 blur-[100px] rounded-full" />
               )
          }
     }

     const aspectRatios = {
          story: { w: 1080, h: 1920, label: 'Hikaye', aspect: 'aspect-[9/16]' },
          portrait: { w: 1080, h: 1350, label: 'Gönderi', aspect: 'aspect-[4/5]' },
          square: { w: 1080, h: 1080, label: 'Kare', aspect: 'aspect-square' }
     }

     const handleImageUpload = (e) => {
          const file = e.target.files?.[0]
          if (file) {
               const reader = new FileReader()
               reader.onloadend = () => {
                    setContent(prev => ({ ...prev, image: reader.result }))
                    setTemplate('nature') // Switch to nature template for image
               }
               reader.readAsDataURL(file)
          }
     }

     const generateCanvas = async () => {
          if (!cardRef.current) return null
          // Temporarily remove transform/scale for clean capture if needed, 
          // or rely on html2canvas scaling.
          return await html2canvas(cardRef.current, {
               scale: 2,
               useCORS: true,
               backgroundColor: null,
               logging: false
          })
     }

     const handleDownload = async () => {
          if (isProcessing) return
          setIsProcessing(true)
          try {
               const canvas = await generateCanvas()
               if (!canvas) return
               const image = canvas.toDataURL('image/png', 1.0)
               const link = document.createElement('a')
               link.download = `asr-nesli-${Date.now()}.png`
               link.href = image
               link.click()
          } catch (err) {
               console.error('Hata:', err)
          } finally {
               setIsProcessing(false)
          }
     }

     const handleShare = async () => {
          if (isProcessing) return
          setIsProcessing(true)
          try {
               const canvas = await generateCanvas()
               if (!canvas) return
               const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
               const file = new File([blob], 'share.png', { type: 'image/png' })
               if (navigator.share) {
                    await navigator.share({
                         files: [file],
                         title: 'Asr Nesli Paylaşım',
                         text: content.text
                    })
               } else {
                    handleDownload()
               }
          } catch (err) {
               console.error('Hata:', err)
          } finally {
               setIsProcessing(false)
          }
     }

     return (
          <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark font-display overflow-hidden">
               {/* Header */}
               <header className="shrink-0 flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                    <Link to="/" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                         <span className="material-symbols-outlined text-2xl dark:text-white">close</span>
                    </Link>
                    <h1 className="text-sm font-bold uppercase tracking-widest dark:text-white">Stüdyo</h1>
                    <button
                         onClick={handleDownload}
                         className="text-accent-green dark:text-primary font-bold text-sm hover:opacity-80 disabled:opacity-50"
                         disabled={isProcessing}
                    >
                         Kaydet
                    </button>
               </header>

               {/* Canvas Area */}
               <div className="flex-1 relative bg-gray-100 dark:bg-[#121212] flex items-center justify-center p-8 overflow-hidden">
                    <div className="relative z-10 shadow-2xl shadow-black/20">
                         <div
                              ref={cardRef}
                              className={`relative flex flex-col items-center justify-center p-8 transition-all duration-500 overflow-hidden ${aspectRatios[aspectRatio].aspect} w-full max-h-[60vh] md:max-h-[70vh] aspect-auto-important ${templates[template].container}`}
                              style={{
                                   width: 'auto', // Dynamic width based on height constraint
                                   aspectRatio: aspectRatios[aspectRatio].aspect.replace('aspect-', '').replace('[', '').replace(']', '').replace('/', '/'),
                                   backgroundImage: (template === 'nature' && content.image) ? `url(${content.image})` : undefined,
                                   backgroundSize: 'cover',
                                   backgroundPosition: 'center'
                              }}
                         >
                              {/* Default Nature Image if none selected */}
                              {template === 'nature' && !content.image && (
                                   <div className="absolute inset-0 z-0">
                                        <img src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1000&auto=format&fit=crop" alt="Nature" className="w-full h-full object-cover" />
                                   </div>
                              )}

                              {/* Overlays & Decorations */}
                              {templates[template].overlay && <div className={templates[template].overlay}></div>}
                              {templates[template].decoration}

                              {/* Content */}
                              <div className="relative z-20 w-full flex flex-col items-center text-center">
                                   <p className={templates[template].text}>
                                        {content.text}
                                   </p>
                                   <div className={templates[template].source}>
                                        {content.source}
                                   </div>
                              </div>

                              {/* Footer Branding */}
                              <div className="absolute bottom-6 flex flex-col items-center opacity-60 z-20">
                                   <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Asr Nesli</span>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Controls */}
               <div className="shrink-0 bg-surface-light dark:bg-[#1a1c1a] border-t border-black/5 dark:border-white/5 pb-safe z-30">
                    {/* Tab Selection */}
                    <div className="flex border-b border-black/5 dark:border-white/5">
                         {[
                              { id: 'style', icon: 'palette', label: 'Stil' },
                              { id: 'size', icon: 'aspect_ratio', label: 'Boyut' },
                              { id: 'edit', icon: 'edit_note', label: 'Düzenle' },
                         ].map(tab => (
                              <button
                                   key={tab.id}
                                   onClick={() => setActiveTab(tab.id)}
                                   className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-accent-green dark:text-primary' : 'text-text-secondary'}`}
                              >
                                   <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                                   <span className="text-[10px] font-bold uppercase">{tab.label}</span>
                              </button>
                         ))}
                    </div>

                    {/* Tab Content */}
                    <div className="h-48 p-4 overflow-y-auto">
                         <AnimatePresence mode="wait">
                              {activeTab === 'style' && (
                                   <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="grid grid-cols-4 gap-3"
                                   >
                                        {Object.values(templates).map((t) => (
                                             <button
                                                  key={t.id}
                                                  onClick={() => setTemplate(t.id)}
                                                  className={`flex flex-col items-center gap-2 group ${template === t.id ? 'opacity-100' : 'opacity-60'}`}
                                             >
                                                  <div className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all ${template === t.id ? 'border-accent-green dark:border-primary' : 'border-transparent bg-gray-100 dark:bg-white/5'}`}>
                                                       <span className="material-symbols-outlined text-2xl">{t.icon}</span>
                                                  </div>
                                                  <span className="text-xs font-medium dark:text-white">{t.name}</span>
                                             </button>
                                        ))}
                                   </motion.div>
                              )}

                              {activeTab === 'size' && (
                                   <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex gap-4 justify-center items-center h-full"
                                   >
                                        {Object.entries(aspectRatios).map(([key, config]) => (
                                             <button
                                                  key={key}
                                                  onClick={() => setAspectRatio(key)}
                                                  className={`flex flex-col items-center gap-2 group ${aspectRatio === key ? 'opacity-100' : 'opacity-50'}`}
                                             >
                                                  <div className={`border-2 rounded-lg transition-all ${aspectRatio === key ? 'border-accent-green dark:border-primary bg-accent-green/10' : 'border-gray-300 dark:border-white/20'}`}
                                                       style={{ width: '40px', aspectRatio: config.w / config.h }}
                                                  ></div>
                                                  <span className="text-xs font-medium dark:text-white">{config.label}</span>
                                             </button>
                                        ))}
                                   </motion.div>
                              )}

                              {activeTab === 'edit' && (
                                   <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-4"
                                   >
                                        <textarea
                                             value={content.text}
                                             onChange={(e) => setContent({ ...content, text: e.target.value })}
                                             className="w-full h-20 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-green dark:text-white resize-none"
                                             placeholder="Metninizi buraya yazın..."
                                        />
                                        <div className="flex gap-3">
                                             <input
                                                  value={content.source}
                                                  onChange={(e) => setContent({ ...content, source: e.target.value })}
                                                  className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 h-10 text-sm focus:outline-none focus:border-accent-green dark:text-white"
                                                  placeholder="Kaynak / Yazar"
                                             />
                                             <button
                                                  onClick={() => fileInputRef.current?.click()}
                                                  className="px-4 h-10 bg-accent-green dark:bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-2"
                                             >
                                                  <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
                                                  Görsel
                                             </button>
                                             <input
                                                  type="file"
                                                  ref={fileInputRef}
                                                  onChange={handleImageUpload}
                                                  accept="image/*"
                                                  className="hidden"
                                             />
                                        </div>
                                   </motion.div>
                              )}
                         </AnimatePresence>
                    </div>
               </div>
          </div>
     )
}

export default ShareStudio
