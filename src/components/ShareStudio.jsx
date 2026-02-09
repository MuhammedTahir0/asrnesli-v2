import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'

// Data imports
import { templates, templateCategories } from '../data/templates'
import { fonts, fontSizes, textAlignments, getGoogleFontsUrl } from '../data/fonts'
import { colorPalettes, gradients } from '../data/colors'
import { backgrounds, backgroundCategories } from '../data/backgrounds'
import { stickers, stickerCategories } from '../data/stickers'
import { platformSizes, platformGroups } from '../data/sizes'

const ShareStudio = () => {
     const location = useLocation()
     const navigate = useNavigate()
     const [isProcessing, setIsProcessing] = useState(false)
     const cardRef = useRef(null)
     const fileInputRef = useRef(null)

     // Content State
     const [content, setContent] = useState({
          text: 'Kolaylaştırınız, zorlaştırmayınız. Müjdeleyiniz, nefret ettirmeyiniz.',
          source: 'Hz. Muhammed (s.a.v)',
          image: null
     })

     // Design State
     const [template, setTemplate] = useState('nature')
     const [selectedSize, setSelectedSize] = useState('ig-story')
     const [selectedFont, setSelectedFont] = useState('default')
     const [fontSize, setFontSize] = useState('md')
     const [textAlign, setTextAlign] = useState('center')
     const [selectedPalette, setSelectedPalette] = useState(null)
     const [selectedBackground, setSelectedBackground] = useState(null)
     const [addedStickers, setAddedStickers] = useState([])

     // Watermark State
     const [watermark, setWatermark] = useState({
          enabled: true,
          text: 'Asr Nesli',
          position: 'bottom-center'
     })

     // UI State
     const [activeTab, setActiveTab] = useState('template')
     const [templateFilter, setTemplateFilter] = useState('all')
     const [bgFilter, setBgFilter] = useState('all')
     const [stickerFilter, setStickerFilter] = useState('all')

     // Load content from navigation state
     useEffect(() => {
          if (location.state) {
               setContent(prev => ({
                    ...prev,
                    text: location.state.text || prev.text,
                    source: location.state.source || prev.source,
                    arabic: location.state.arabic || ''
               }))
          }
     }, [location.state])

     // Load Google Fonts
     useEffect(() => {
          const font = fonts.find(f => f.id === selectedFont)
          if (font?.googleFont) {
               const existingLink = document.querySelector(`link[data-font="${font.id}"]`)
               if (!existingLink) {
                    const link = document.createElement('link')
                    link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`
                    link.rel = 'stylesheet'
                    link.setAttribute('data-font', font.id)
                    document.head.appendChild(link)
               }
          }
     }, [selectedFont])

     // Get current configurations
     const currentTemplate = templates[template]
     const currentSize = platformSizes.find(s => s.id === selectedSize)
     const currentFont = fonts.find(f => f.id === selectedFont)
     const currentFontSize = fontSizes.find(s => s.id === fontSize)

     // Filtered data
     const filteredTemplates = templateFilter === 'all'
          ? Object.values(templates)
          : Object.values(templates).filter(t => t.category === templateFilter)

     const filteredBackgrounds = bgFilter === 'all'
          ? backgrounds
          : backgrounds.filter(b => b.category === bgFilter)

     const filteredStickers = stickerFilter === 'all'
          ? stickers
          : stickers.filter(s => s.category === stickerFilter)

     // Handlers
     const handleImageUpload = (e) => {
          const file = e.target.files?.[0]
          if (file) {
               const reader = new FileReader()
               reader.onloadend = () => {
                    setContent(prev => ({ ...prev, image: reader.result }))
                    setSelectedBackground(null)
                    setTemplate('nature')
               }
               reader.readAsDataURL(file)
          }
     }

     const handleBackgroundSelect = (bg) => {
          setSelectedBackground(bg)
          setContent(prev => ({ ...prev, image: null }))
          setTemplate('nature')
     }

     const handleAddSticker = (sticker) => {
          setAddedStickers(prev => [...prev, {
               ...sticker,
               id: `${sticker.id}-${Date.now()}`,
               x: 50,
               y: 50,
               scale: 1
          }])
     }

     const handleRemoveSticker = (stickerId) => {
          setAddedStickers(prev => prev.filter(s => s.id !== stickerId))
     }

     const generateCanvas = async () => {
          if (!cardRef.current) return null
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
               console.error('Export hatası:', err)
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
               console.error('Paylaşım hatası:', err)
          } finally {
               setIsProcessing(false)
          }
     }

     // Get background image URL
     const getBackgroundImage = () => {
          if (content.image) return content.image
          if (selectedBackground) return selectedBackground.url
          if (currentTemplate.defaultBg) return currentTemplate.defaultBg
          return null
     }

     // Tab definitions
     const tabs = [
          { id: 'template', icon: 'palette', label: 'Şablon' },
          { id: 'size', icon: 'aspect_ratio', label: 'Boyut' },
          { id: 'font', icon: 'text_fields', label: 'Yazı' },
          { id: 'color', icon: 'colorize', label: 'Renk' },
          { id: 'background', icon: 'image', label: 'Arka Plan' },
          { id: 'sticker', icon: 'emoji_emotions', label: 'Sticker' },
          { id: 'watermark', icon: 'branding_watermark', label: 'Damga' },
          { id: 'edit', icon: 'edit_note', label: 'Metin' }
     ]

     return (
          <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark font-display overflow-hidden">
               {/* Header */}
               <header className="shrink-0 flex items-center justify-between p-3 border-b border-black/5 dark:border-white/5 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                    <button
                         onClick={() => navigate(-1)}
                         className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                         <span className="material-symbols-outlined text-xl dark:text-white">arrow_back</span>
                    </button>
                    <h1 className="text-sm font-bold uppercase tracking-widest dark:text-white">Stüdyo</h1>
                    <button
                         onClick={handleDownload}
                         className="text-accent-green dark:text-primary font-bold text-sm hover:opacity-80 disabled:opacity-50 flex items-center gap-1"
                         disabled={isProcessing}
                    >
                         <span className="material-symbols-outlined text-lg">save</span>
                         Kaydet
                    </button>
               </header>

               {/* Canvas Area */}
               <div className="flex-1 relative bg-gray-100 dark:bg-[#121212] flex items-center justify-center p-4 overflow-hidden">
                    <div className="relative z-10 shadow-2xl shadow-black/30 rounded-lg overflow-hidden">
                         <div
                              ref={cardRef}
                              className={`relative flex flex-col items-center justify-center p-6 transition-all duration-300 overflow-hidden ${currentTemplate.container}`}
                              style={{
                                   aspectRatio: currentSize.aspect,
                                   maxHeight: '55vh',
                                   width: 'auto',
                                   fontFamily: currentFont?.family || 'inherit',
                                   backgroundImage: getBackgroundImage() ? `url(${getBackgroundImage()})` : undefined,
                                   backgroundSize: 'cover',
                                   backgroundPosition: 'center'
                              }}
                         >
                              {/* Overlay */}
                              {currentTemplate.overlay === 'arabesque' && (
                                   <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
                              )}
                              {currentTemplate.overlay === 'stars' && (
                                   <div className="absolute inset-0">
                                        {[...Array(20)].map((_, i) => (
                                             <div
                                                  key={i}
                                                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                                  style={{
                                                       left: `${Math.random() * 100}%`,
                                                       top: `${Math.random() * 100}%`,
                                                       animationDelay: `${Math.random() * 2}s`
                                                  }}
                                             />
                                        ))}
                                   </div>
                              )}
                              {getBackgroundImage() && (
                                   <div className="absolute inset-0 bg-black/40 z-0" />
                              )}

                              {/* Decorations */}
                              {currentTemplate.decoration === 'border' && (
                                   <div className="absolute inset-4 border border-[#C5A059]/20 rounded-sm pointer-events-none z-10" />
                              )}
                              {currentTemplate.decoration === 'lines' && (
                                   <>
                                        <div className="absolute top-0 inset-x-0 h-1 bg-[#C5A059]/50" />
                                        <div className="absolute bottom-0 inset-x-0 h-1 bg-[#C5A059]/50" />
                                   </>
                              )}
                              {currentTemplate.decoration === 'glow' && (
                                   <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-green/20 blur-[100px] rounded-full" />
                              )}
                              {currentTemplate.decoration === 'crescent' && (
                                   <div className="absolute top-6 right-6 text-4xl opacity-30">☪️</div>
                              )}

                              {/* Content */}
                              <div className={`relative z-20 w-full flex flex-col items-center text-${textAlign}`}>
                                   {content.arabic && (
                                        <p className="arabic-font text-3xl md:text-5xl leading-relaxed mb-4 text-center px-4"
                                             style={{ textAlign }}
                                        >
                                             {content.arabic}
                                        </p>
                                   )}
                                   <p className={`${currentTemplate.text} ${currentFontSize?.class || ''}`}
                                        style={{ textAlign }}
                                   >
                                        {content.text}
                                   </p>
                                   <div className={currentTemplate.source}>
                                        {content.source}
                                   </div>
                              </div>

                              {/* Stickers */}
                              {addedStickers.map(sticker => (
                                   <div
                                        key={sticker.id}
                                        className="absolute text-4xl cursor-move z-30"
                                        style={{
                                             left: `${sticker.x}%`,
                                             top: `${sticker.y}%`,
                                             transform: `translate(-50%, -50%) scale(${sticker.scale})`
                                        }}
                                        onClick={() => handleRemoveSticker(sticker.id)}
                                   >
                                        {sticker.emoji}
                                   </div>
                              ))}

                              {/* Watermark */}
                              {watermark.enabled && (
                                   <div className={`absolute z-20 opacity-60 ${watermark.position === 'bottom-center' ? 'bottom-4 left-1/2 -translate-x-1/2' :
                                        watermark.position === 'bottom-left' ? 'bottom-4 left-4' :
                                             watermark.position === 'bottom-right' ? 'bottom-4 right-4' :
                                                  watermark.position === 'top-left' ? 'top-4 left-4' : 'top-4 right-4'
                                        }`}>
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{watermark.text}</span>
                                   </div>
                              )}
                         </div>
                    </div>
               </div>

               {/* Controls */}
               <div className="shrink-0 bg-surface-light dark:bg-[#1a1c1a] border-t border-black/5 dark:border-white/5 pb-safe z-30">
                    {/* Tab Bar - Scrollable */}
                    <div className="overflow-x-auto no-scrollbar border-b border-black/5 dark:border-white/5">
                         <div className="flex min-w-max">
                              {tabs.map(tab => (
                                   <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-shrink-0 px-4 py-2.5 flex flex-col items-center gap-0.5 transition-colors ${activeTab === tab.id
                                             ? 'text-accent-green dark:text-primary border-b-2 border-accent-green dark:border-primary'
                                             : 'text-text-secondary'
                                             }`}
                                   >
                                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                        <span className="text-[9px] font-bold uppercase">{tab.label}</span>
                                   </button>
                              ))}
                         </div>
                    </div>

                    {/* Tab Content */}
                    <div className="h-44 overflow-y-auto no-scrollbar">
                         <AnimatePresence mode="wait">
                              {/* Template Tab */}
                              {activeTab === 'template' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3 space-y-3"
                                   >
                                        {/* Category Filter */}
                                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                             {templateCategories.map(cat => (
                                                  <button
                                                       key={cat.id}
                                                       onClick={() => setTemplateFilter(cat.id)}
                                                       className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${templateFilter === cat.id
                                                            ? 'bg-accent-green text-white'
                                                            : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                                            }`}
                                                  >
                                                       {cat.name}
                                                  </button>
                                             ))}
                                        </div>
                                        {/* Template Grid */}
                                        <div className="grid grid-cols-4 gap-2">
                                             {filteredTemplates.map((t) => (
                                                  <button
                                                       key={t.id}
                                                       onClick={() => setTemplate(t.id)}
                                                       className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${template === t.id ? 'bg-accent-green/10 ring-2 ring-accent-green' : 'hover:bg-gray-100 dark:hover:bg-white/5'
                                                            }`}
                                                  >
                                                       <div className={`w-full aspect-square rounded-lg flex items-center justify-center ${t.container}`}>
                                                            <span className="material-symbols-outlined text-xl">{t.icon}</span>
                                                       </div>
                                                       <span className="text-[10px] font-medium dark:text-white truncate w-full text-center">{t.name}</span>
                                                  </button>
                                             ))}
                                        </div>
                                   </motion.div>
                              )}

                              {/* Size Tab */}
                              {activeTab === 'size' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3"
                                   >
                                        <div className="grid grid-cols-3 gap-2">
                                             {platformSizes.map((size) => (
                                                  <button
                                                       key={size.id}
                                                       onClick={() => setSelectedSize(size.id)}
                                                       className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selectedSize === size.id
                                                            ? 'bg-accent-green/10 ring-2 ring-accent-green'
                                                            : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                                            }`}
                                                  >
                                                       <div
                                                            className={`border-2 rounded transition-all ${selectedSize === size.id ? 'border-accent-green' : 'border-gray-300 dark:border-white/20'
                                                                 }`}
                                                            style={{ width: '24px', aspectRatio: size.aspect }}
                                                       />
                                                       <span className="text-[10px] font-bold dark:text-white text-center leading-tight">{size.name}</span>
                                                  </button>
                                             ))}
                                        </div>
                                   </motion.div>
                              )}

                              {/* Font Tab */}
                              {activeTab === 'font' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3 space-y-4"
                                   >
                                        {/* Font Selection */}
                                        <div>
                                             <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Yazı Tipi</label>
                                             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                                  {fonts.slice(0, 8).map(font => (
                                                       <button
                                                            key={font.id}
                                                            onClick={() => setSelectedFont(font.id)}
                                                            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all ${selectedFont === font.id
                                                                 ? 'bg-accent-green text-white'
                                                                 : 'bg-gray-100 dark:bg-white/10 dark:text-white'
                                                                 }`}
                                                            style={{ fontFamily: font.family }}
                                                       >
                                                            {font.name}
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                        {/* Font Size */}
                                        <div>
                                             <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Boyut</label>
                                             <div className="flex gap-2">
                                                  {fontSizes.map(size => (
                                                       <button
                                                            key={size.id}
                                                            onClick={() => setFontSize(size.id)}
                                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${fontSize === size.id
                                                                 ? 'bg-accent-green text-white'
                                                                 : 'bg-gray-100 dark:bg-white/10 dark:text-white'
                                                                 }`}
                                                       >
                                                            {size.name}
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                        {/* Alignment */}
                                        <div>
                                             <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Hizalama</label>
                                             <div className="flex gap-2">
                                                  {textAlignments.map(align => (
                                                       <button
                                                            key={align.id}
                                                            onClick={() => setTextAlign(align.id)}
                                                            className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${textAlign === align.id
                                                                 ? 'bg-accent-green text-white'
                                                                 : 'bg-gray-100 dark:bg-white/10 dark:text-white'
                                                                 }`}
                                                       >
                                                            <span className="material-symbols-outlined text-lg">{align.icon}</span>
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                   </motion.div>
                              )}

                              {/* Color Tab */}
                              {activeTab === 'color' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3 space-y-3"
                                   >
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block">Renk Paleti</label>
                                        <div className="grid grid-cols-5 gap-2">
                                             {colorPalettes.map(palette => (
                                                  <button
                                                       key={palette.id}
                                                       onClick={() => setSelectedPalette(palette.id)}
                                                       className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all ${selectedPalette === palette.id ? 'ring-accent-green scale-105' : 'ring-transparent'
                                                            }`}
                                                       style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}
                                                       title={palette.name}
                                                  />
                                             ))}
                                        </div>
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mt-3">Gradientler</label>
                                        <div className="grid grid-cols-4 gap-2">
                                             {gradients.map(grad => (
                                                  <button
                                                       key={grad.id}
                                                       className={`aspect-[2/1] rounded-lg bg-gradient-to-br ${grad.value}`}
                                                       title={grad.name}
                                                  />
                                             ))}
                                        </div>
                                   </motion.div>
                              )}

                              {/* Background Tab */}
                              {activeTab === 'background' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3 space-y-3"
                                   >
                                        {/* Category Filter */}
                                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                             {backgroundCategories.map(cat => (
                                                  <button
                                                       key={cat.id}
                                                       onClick={() => setBgFilter(cat.id)}
                                                       className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${bgFilter === cat.id
                                                            ? 'bg-accent-green text-white'
                                                            : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                                            }`}
                                                  >
                                                       {cat.name}
                                                  </button>
                                             ))}
                                        </div>
                                        {/* Background Grid */}
                                        <div className="grid grid-cols-4 gap-2">
                                             {/* Upload Button */}
                                             <button
                                                  onClick={() => fileInputRef.current?.click()}
                                                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center gap-1 hover:border-accent-green transition-colors"
                                             >
                                                  <span className="material-symbols-outlined text-xl text-gray-400">add_photo_alternate</span>
                                                  <span className="text-[9px] font-bold text-gray-400">Yükle</span>
                                             </button>
                                             {filteredBackgrounds.map(bg => (
                                                  <button
                                                       key={bg.id}
                                                       onClick={() => handleBackgroundSelect(bg)}
                                                       className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all ${selectedBackground?.id === bg.id ? 'ring-accent-green scale-105' : 'ring-transparent'
                                                            }`}
                                                  >
                                                       <img src={bg.thumbnail} alt={bg.name} className="w-full h-full object-cover" loading="lazy" />
                                                  </button>
                                             ))}
                                        </div>
                                        <input
                                             type="file"
                                             ref={fileInputRef}
                                             onChange={handleImageUpload}
                                             accept="image/*"
                                             className="hidden"
                                        />
                                   </motion.div>
                              )}

                              {/* Sticker Tab */}
                              {activeTab === 'sticker' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3 space-y-3"
                                   >
                                        {/* Category Filter */}
                                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                             {stickerCategories.map(cat => (
                                                  <button
                                                       key={cat.id}
                                                       onClick={() => setStickerFilter(cat.id)}
                                                       className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${stickerFilter === cat.id
                                                            ? 'bg-accent-green text-white'
                                                            : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                                            }`}
                                                  >
                                                       {cat.name}
                                                  </button>
                                             ))}
                                        </div>
                                        {/* Sticker Grid */}
                                        <div className="grid grid-cols-8 gap-2">
                                             {filteredStickers.map(sticker => (
                                                  <button
                                                       key={sticker.id}
                                                       onClick={() => handleAddSticker(sticker)}
                                                       className="aspect-square rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                                                       title={sticker.name}
                                                  >
                                                       {sticker.emoji}
                                                  </button>
                                             ))}
                                        </div>
                                        {addedStickers.length > 0 && (
                                             <p className="text-[10px] text-gray-500 text-center">Silmek için sticker'a tıklayın</p>
                                        )}
                                   </motion.div>
                              )}

                              {/* Watermark Tab */}
                              {activeTab === 'watermark' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3 space-y-4"
                                   >
                                        {/* Toggle */}
                                        <div className="flex items-center justify-between">
                                             <span className="text-sm font-medium dark:text-white">Watermark Göster</span>
                                             <button
                                                  onClick={() => setWatermark(prev => ({ ...prev, enabled: !prev.enabled }))}
                                                  className={`w-12 h-6 rounded-full transition-colors ${watermark.enabled ? 'bg-accent-green' : 'bg-gray-300 dark:bg-white/20'}`}
                                             >
                                                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${watermark.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                             </button>
                                        </div>
                                        {/* Text Input */}
                                        <div>
                                             <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Metin</label>
                                             <input
                                                  value={watermark.text}
                                                  onChange={(e) => setWatermark(prev => ({ ...prev, text: e.target.value }))}
                                                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 h-10 text-sm dark:text-white"
                                                  placeholder="Watermark metni"
                                             />
                                        </div>
                                        {/* Position */}
                                        <div>
                                             <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Konum</label>
                                             <div className="grid grid-cols-3 gap-2">
                                                  {['top-left', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                                                       <button
                                                            key={pos}
                                                            onClick={() => setWatermark(prev => ({ ...prev, position: pos }))}
                                                            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${watermark.position === pos
                                                                 ? 'bg-accent-green text-white'
                                                                 : 'bg-gray-100 dark:bg-white/10 dark:text-white'
                                                                 }`}
                                                       >
                                                            {pos.replace('-', ' ').replace('top', 'Üst').replace('bottom', 'Alt').replace('left', 'Sol').replace('right', 'Sağ').replace('center', 'Orta')}
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                   </motion.div>
                              )}

                              {/* Edit Tab */}
                              {activeTab === 'edit' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3 space-y-3"
                                   >
                                        <textarea
                                             value={content.text}
                                             onChange={(e) => setContent(prev => ({ ...prev, text: e.target.value }))}
                                             className="w-full h-20 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-green dark:text-white resize-none"
                                             placeholder="Metninizi buraya yazın..."
                                        />
                                        <input
                                             value={content.source}
                                             onChange={(e) => setContent(prev => ({ ...prev, source: e.target.value }))}
                                             className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 h-10 text-sm focus:outline-none focus:border-accent-green dark:text-white"
                                             placeholder="Kaynak / Yazar"
                                        />
                                   </motion.div>
                              )}
                         </AnimatePresence>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 p-3 border-t border-black/5 dark:border-white/5">
                         <button
                              onClick={handleDownload}
                              disabled={isProcessing}
                              className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                         >
                              <span className="material-symbols-outlined text-lg">download</span>
                              İndir
                         </button>
                         <button
                              onClick={handleShare}
                              disabled={isProcessing}
                              className="flex-1 py-3 rounded-xl bg-accent-green text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                         >
                              <span className="material-symbols-outlined text-lg">share</span>
                              Paylaş
                         </button>
                    </div>
               </div>
          </div>
     )
}

export default ShareStudio
