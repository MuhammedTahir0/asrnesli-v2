import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toPng, toBlob } from 'html-to-image'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { consumeToken, grantToken } from '../services/authService'

// Data imports
import { templates, templateCategories } from '../data/templates'
import { fonts, fontCategories, fontSizes, textAlignments, getGoogleFontsUrl } from '../data/fonts'
import { colorPalettes, gradients } from '../data/colors'
import { backgrounds, backgroundCategories } from '../data/backgrounds'
import { platformSizes, platformGroups } from '../data/sizes'
import { stickers, stickerCategories } from '../data/stickers'

const ShareStudio = () => {
     const location = useLocation()
     const navigate = useNavigate()
     const { user, profile, setProfile } = useAuth()
     const [isProcessing, setIsProcessing] = useState(false)
     const [adRewardLoading, setAdRewardLoading] = useState(false)
     const [showAdPanel, setShowAdPanel] = useState(false)
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
     const [selectedGradient, setSelectedGradient] = useState(null)
     const [selectedBackground, setSelectedBackground] = useState(null)
     const [customColors, setCustomColors] = useState(null)


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
     const [fontFilter, setFontFilter] = useState('all')
     const [stickerFilter, setStickerFilter] = useState('all')
     const [addedStickers, setAddedStickers] = useState([])


     const ADSENSE_CLIENT = 'ca-pub-8915311494926639'
     const ADSENSE_SLOT = import.meta.env.VITE_ADSENSE_SLOT || ''

     const tokens = Number.isFinite(profile?.tokens) ? profile.tokens : 0
     const isProfileReady = !!profile
     const canSpendToken = isProfileReady && tokens > 0

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

     useEffect(() => {
          if (!showAdPanel || !ADSENSE_SLOT) return
          try {
               window.adsbygoogle = window.adsbygoogle || []
               window.adsbygoogle.push({})
          } catch (err) {
               console.warn('AdSense yükleme hatası:', err)
          }
     }, [showAdPanel, ADSENSE_SLOT])

     useEffect(() => {
          if (tokens > 0) setShowAdPanel(false)
     }, [tokens])

     // Get current configurations
     const currentTemplate = templates[template]
     const currentSize = platformSizes.find(s => s.id === selectedSize)
     const currentFont = fonts.find(f => f.id === selectedFont) || fonts[0]
     const currentFontSize = fontSizes.find(s => s.id === fontSize) || fontSizes[1]

     // Filtered data
     const filteredTemplates = templateFilter === 'all'
          ? Object.values(templates)
          : Object.values(templates).filter(t => t.category === templateFilter)

     const filteredBackgrounds = bgFilter === 'all'
          ? backgrounds
          : backgrounds.filter(b => b.category === bgFilter)

     const filteredFonts = fontFilter === 'all'
          ? fonts
          : fonts.filter(f => f.category === fontFilter)

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

     const handlePaletteSelect = (palette) => {
          setSelectedPalette(palette.id)
          setSelectedGradient(null)
          setCustomColors({
               background: palette.background,
               text: palette.text,
               accent: palette.accent,
               primary: palette.primary,
               secondary: palette.secondary
          })
     }

     const handleGradientSelect = (gradient) => {
          setSelectedGradient(gradient.id)
          setSelectedPalette(null)
          setTemplate('gradient')
          setCustomColors(null)
     }

     const handleAddSticker = (sticker) => {
          const newSticker = {
               id: `sticker-${Date.now()}-${Math.random()}`,
               emoji: sticker.emoji,
               x: 50,
               y: 50,
               size: 48
          }
          setAddedStickers(prev => [...prev, newSticker])
     }

     const handleRemoveSticker = (stickerId) => {
          setAddedStickers(prev => prev.filter(s => s.id !== stickerId))
     }

     const extractTokens = (data) => {
          if (Array.isArray(data)) {
               const first = data[0]
               if (first && typeof first.tokens === 'number') return first.tokens
          }
          if (data && typeof data === 'object' && typeof data.tokens === 'number') {
               return data.tokens
          }
          if (typeof data === 'number') return data
          return null
     }

     const updateTokens = (nextTokens) => {
          if (typeof nextTokens !== 'number') return
          setProfile(prev => ({ ...(prev || {}), tokens: nextTokens }))
     }

     const ensureTokenAccess = () => {
          if (!user) {
               toast.error('Devam etmek için giriş yapmalısınız.')
               return false
          }
          if (!isProfileReady) {
               toast.error('Token bilgileriniz yükleniyor.')
               return false
          }
          if (tokens <= 0) {
               toast.error('Token yetersiz.')
               setShowAdPanel(true)
               return false
          }
          return true
     }

     const consumeAndSyncToken = async () => {
          const { data, error } = await consumeToken()
          if (error) {
               toast.error('Token düşürülemedi. Lütfen tekrar deneyin.')
               return null
          }
          const nextTokens = extractTokens(data)
          updateTokens(nextTokens)
          return nextTokens
     }

     const grantAndSyncToken = async () => {
          const { data, error } = await grantToken(1)
          if (error) {
               toast.error('Reklam doğrulanamadı. Lütfen tekrar deneyin.')
               return null
          }
          const nextTokens = extractTokens(data)
          updateTokens(nextTokens)
          return nextTokens
     }

     const generateImage = async () => {
          if (!cardRef.current) return null
          
          // Font'un yüklenmesini bekle
          if (currentFont && currentFont.family !== 'inherit') {
               try {
                    await document.fonts.ready
                    await document.fonts.load(`16px "${currentFont.family}"`)
               } catch (err) {
                    console.warn('Font yükleme hatası:', err)
               }
          }
          
          return await toPng(cardRef.current, {
               pixelRatio: 2,
               cacheBust: true,
               fontEmbedCSS: currentFont?.family ? `@import url('${getGoogleFontsUrl([currentFont])}');` : ''
          })
     }

     const downloadImage = (dataUrl) => {
          const link = document.createElement('a')
          link.download = `asr-nesli-${Date.now()}.png`
          link.href = dataUrl
          link.click()
     }

     const shareImage = async () => {
          if (!cardRef.current) return false
          try {
               // Font'un yüklenmesini bekle
               if (currentFont && currentFont.family !== 'inherit') {
                    try {
                         await document.fonts.ready
                         await document.fonts.load(`16px "${currentFont.family}"`)
                    } catch (err) {
                         console.warn('Font yükleme hatası:', err)
                    }
               }
               
               const blob = await toBlob(cardRef.current, {
                    pixelRatio: 2,
                    cacheBust: true,
                    fontEmbedCSS: currentFont?.family ? `@import url('${getGoogleFontsUrl([currentFont])}');` : ''
               })
               const file = new File([blob], 'share.png', { type: 'image/png' })
               if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                         files: [file],
                         title: 'Asr Nesli Paylaşım',
                         text: content.text
                    })
                    return true
               }
               // Fallback to download
               const dataUrl = await toPng(cardRef.current, {
                    pixelRatio: 2,
                    fontEmbedCSS: currentFont?.family ? `@import url('${getGoogleFontsUrl([currentFont])}');` : ''
               })
               downloadImage(dataUrl)
               return true
          } catch (err) {
               console.error('Share error:', err)
               return false
          }
     }

     const handleDownload = async () => {
          if (isProcessing) return
          if (!ensureTokenAccess()) return
          setIsProcessing(true)
          try {
               const dataUrl = await generateImage()
               if (!dataUrl) return
              const nextTokens = await consumeAndSyncToken()
              if (nextTokens === null) return
              downloadImage(dataUrl)
          } catch (err) {
               console.error('Export hatası:', err)
          } finally {
               setIsProcessing(false)
          }
     }

     const handleShare = async () => {
          if (isProcessing) return
          if (!ensureTokenAccess()) return
          setIsProcessing(true)
          try {
              const nextTokens = await consumeAndSyncToken()
              if (nextTokens === null) return
              const success = await shareImage()
              if (!success) {
                   await grantAndSyncToken()
              }
          } catch (err) {
               console.error('Paylaşım hatası:', err)
          } finally {
               setIsProcessing(false)
          }
     }

     const handleAdReward = async () => {
          if (adRewardLoading) return
          if (!user) {
               toast.error('Token kazanmak için giriş yapmalısınız.')
               return
          }
          setAdRewardLoading(true)
          try {
               const nextTokens = await grantAndSyncToken()
               if (typeof nextTokens === 'number') {
                    toast.success('+1 token eklendi.')
               }
          } catch (err) {
               console.error('Token ödül hatası:', err)
          } finally {
               setAdRewardLoading(false)
          }
     }

     // Get background image URL
     const getBackgroundImage = () => {
          if (content.image) return content.image
          if (selectedBackground) return selectedBackground.url
          if (currentTemplate.defaultBg) return currentTemplate.defaultBg
          return null
     }

     // Get canvas style with custom colors
     const getCanvasStyle = () => {
          const style = {
               aspectRatio: currentSize.aspect,
               maxHeight: '55vh',
               width: 'auto',
               fontFamily: currentFont?.family || 'inherit'
          }

          const bgImage = getBackgroundImage()
          if (bgImage) {
               style.backgroundImage = `url(${bgImage})`
               style.backgroundSize = 'cover'
               style.backgroundPosition = 'center'
          }

          if (customColors) {
               style.backgroundColor = customColors.background
               style.color = customColors.text
          } else if (selectedGradient) {
               const gradient = gradients.find(g => g.id === selectedGradient)
               if (gradient) {
                    style.background = `linear-gradient(to bottom right, var(--tw-gradient-stops))`
                    style.backgroundImage = null
               }
          }

          return style
     }

     // Tab definitions
     const tabs = [
          { id: 'template', icon: 'palette', label: 'Şablon' },
          { id: 'size', icon: 'aspect_ratio', label: 'Boyut' },
          { id: 'font', icon: 'text_fields', label: 'Yazı' },
          { id: 'color', icon: 'colorize', label: 'Renk' },
          { id: 'background', icon: 'image', label: 'Arka Plan' },
          { id: 'sticker', icon: 'mood', label: 'Sticker' },
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
                         disabled={isProcessing || !canSpendToken}
                    >
                         <span className="material-symbols-outlined text-lg">save</span>
                         Kaydet
                    </button>
               </header>

               {/* Token Warning Banner */}
               {isProfileReady && tokens === 0 && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 shadow-lg">
                         <div className="flex items-center justify-between gap-3 text-white">
                              <div className="flex items-center gap-2">
                                   <span className="material-symbols-outlined text-2xl animate-pulse">error</span>
                                   <div>
                                        <p className="font-bold text-sm">Token Bitti!</p>
                                        <p className="text-xs opacity-90">İndirme ve paylaşım için token gereklidir.</p>
                                   </div>
                              </div>
                              <button
                                   onClick={() => {
                                        setActiveTab('watermark')
                                        setTimeout(() => setShowAdPanel(true), 300)
                                   }}
                                   className="flex-shrink-0 px-4 py-2 bg-white text-orange-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-all"
                              >
                                   Token Al
                              </button>
                         </div>
                    </div>
               )}

               {/* Canvas Area */}
               <div className="flex-1 relative bg-gray-100 dark:bg-[#121212] flex items-center justify-center p-4 overflow-hidden">
                    <div className="relative z-10 shadow-2xl shadow-black/30 rounded-lg overflow-hidden">
                         <div
                              ref={cardRef}
                              className={`relative flex flex-col items-center justify-center p-6 transition-all duration-300 overflow-hidden ${selectedGradient ? 'bg-gradient-to-br ' + gradients.find(g => g.id === selectedGradient)?.value : currentTemplate.container}`}
                              style={getCanvasStyle()}
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
                              {currentTemplate.overlay === 'mosque-silhouette' && (
                                   <div className="absolute bottom-0 inset-x-0 h-32 opacity-20">
                                        <svg viewBox="0 0 1080 200" className="w-full h-full" fill="currentColor">
                                             <path d="M0,200 L0,100 Q270,80 540,90 Q810,80 1080,100 L1080,200 Z" />
                                             <ellipse cx="540" cy="50" rx="40" ry="60" />
                                             <rect x="520" y="70" width="40" height="130" />
                                             <rect x="480" y="120" width="120" height="80" />
                                        </svg>
                                   </div>
                              )}
                              {currentTemplate.overlay === 'lanterns' && (
                                   <div className="absolute inset-0">
                                        {[...Array(8)].map((_, i) => (
                                             <div
                                                  key={i}
                                                  className="absolute text-4xl opacity-10 animate-pulse"
                                                  style={{
                                                       left: `${10 + i * 12}%`,
                                                       top: `${5 + (i % 2) * 10}%`,
                                                       animationDelay: `${i * 0.3}s`
                                                  }}
                                             >
                                                  🏮
                                             </div>
                                        ))}
                                   </div>
                              )}
                              {currentTemplate.overlay === 'gradient-overlay' && (
                                   <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-purple-900/30" />
                              )}
                              {currentTemplate.overlay === 'geometric-pattern' && (
                                   <div className="absolute inset-0 opacity-5">
                                        <div className="w-full h-full" style={{
                                             backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px),
                                                  repeating-linear-gradient(-45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)`
                                        }} />
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
                              {currentTemplate.decoration === 'glow-warm' && (
                                   <div className="absolute inset-0 bg-gradient-radial from-amber-400/10 via-transparent to-transparent" />
                              )}
                              {currentTemplate.decoration === 'crescent' && (
                                   <div className="absolute top-6 right-6 text-4xl opacity-30">☪️</div>
                              )}
                              {currentTemplate.decoration === 'sun-rays' && (
                                   <div className="absolute inset-0 overflow-hidden">
                                        {[...Array(12)].map((_, i) => (
                                             <div
                                                  key={i}
                                                  className="absolute top-1/2 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-amber-300/20 to-transparent"
                                                  style={{
                                                       transform: `rotate(${i * 30}deg) translateY(-50%)`,
                                                       transformOrigin: 'center center'
                                                  }}
                                             />
                                        ))}
                                   </div>
                              )}
                              {currentTemplate.decoration === 'moon' && (
                                   <div className="absolute top-6 right-6 text-4xl opacity-40">🌙</div>
                              )}
                              {currentTemplate.decoration === 'border-geometric' && (
                                   <div className="absolute inset-4 border-2 border-[#C5A059]/30 pointer-events-none z-10" style={{
                                        clipPath: 'polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)'
                                   }} />
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
                                        className="absolute z-20 cursor-pointer hover:scale-110 transition-transform"
                                        style={{
                                             left: `${sticker.x}%`,
                                             top: `${sticker.y}%`,
                                             fontSize: `${sticker.size}px`,
                                             transform: 'translate(-50%, -50%)'
                                        }}
                                        onClick={() => handleRemoveSticker(sticker.id)}
                                        title="Kaldırmak için tıkla"
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
                    {/* Token Bar */}
                    <div className="px-3 pt-3">
                         <div className="relative overflow-hidden rounded-2xl border border-[#C5A059]/25 bg-gradient-to-br from-[#13110b] via-[#1a1c1a] to-[#0f0f0d] text-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
                              <div className="relative flex items-center justify-between gap-4">
                                   <div>
                                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059]/80">Token Durumu</p>
                                        <p className="text-lg font-semibold">
                                             {isProfileReady ? `${tokens} token kaldı` : 'Token yükleniyor...'}
                                        </p>
                                        <p className="text-[11px] text-white/60">Her indirme/paylaşım 1 token.</p>
                                   </div>
                              </div>
                              {isProfileReady && tokens <= 0 && (
                                   <div className="relative mt-3 rounded-xl border border-[#C5A059]/20 bg-black/30 p-3">
                                        <p className="text-[11px] text-white/70 mb-2">Token bitti. Reklam izleyerek devam edebilirsiniz.</p>
                                        <button
                                             onClick={() => setShowAdPanel(prev => !prev)}
                                             className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E7D3A1] text-[#1a1c1a] text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#C5A059]/20"
                                        >
                                             Reklam İzle ve Token Kazan
                                        </button>
                                        {showAdPanel && (
                                             <div className="mt-3 space-y-2">
                                                  {ADSENSE_SLOT ? (
                                                       <ins
                                                            className="adsbygoogle block"
                                                            style={{ display: 'block' }}
                                                            data-ad-client={ADSENSE_CLIENT}
                                                            data-ad-slot={ADSENSE_SLOT}
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"
                                                       />
                                                  ) : (
                                                       <div className="text-[10px] text-white/60">Reklam alanı hazırlanıyor.</div>
                                                  )}
                                                  <button
                                                       onClick={handleAdReward}
                                                       disabled={adRewardLoading}
                                                       className="w-full py-2 rounded-lg border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest disabled:opacity-60"
                                                  >
                                                       {adRewardLoading ? 'Kontrol ediliyor...' : '+1 Token Kazan'}
                                                  </button>
                                             </div>
                                        )}
                                   </div>
                              )}
                         </div>
                    </div>
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
                                        <div className="overflow-x-auto no-scrollbar">
                                             <div className="flex gap-2 pb-1 min-w-max pr-3">
                                                  {templateCategories.map(cat => (
                                                       <button
                                                            key={cat.id}
                                                            onClick={() => setTemplateFilter(cat.id)}
                                                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${templateFilter === cat.id
                                                                 ? 'bg-accent-green text-white'
                                                                 : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                                                 }`}
                                                       >
                                                            {cat.name}
                                                       </button>
                                                  ))}
                                             </div>
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
                                        className="p-3 space-y-4"
                                   >
                                        {platformGroups.map(group => (
                                             <div key={group.id}>
                                                  <h3 className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                                                       {group.name}
                                                  </h3>
                                                  <div className="grid grid-cols-3 gap-2">
                                                       {platformSizes.filter(s => s.platform === group.id).map((size) => (
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
                                             </div>
                                        ))}
                                   </motion.div>
                              )}

                              {/* Font Tab */}
                              {activeTab === 'font' && (
                                   <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="p-3 space-y-4"
                                   >
                                        {/* Font Category Filter */}
                                        <div className="overflow-x-auto no-scrollbar">
                                             <div className="flex gap-2 pb-1 min-w-max pr-3">
                                                  {fontCategories.map(cat => (
                                                       <button
                                                            key={cat.id}
                                                            onClick={() => setFontFilter(cat.id)}
                                                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${fontFilter === cat.id
                                                                 ? 'bg-accent-green text-white'
                                                                 : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                                                 }`}
                                                       >
                                                            {cat.name}
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                        {/* Font Selection */}
                                        <div>
                                             <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Yazı Tipi</label>
                                             <div className="grid grid-cols-2 gap-2">
                                                  {filteredFonts.map(font => (
                                                       <button
                                                            key={font.id}
                                                            onClick={() => setSelectedFont(font.id)}
                                                            className={`px-3 py-2 rounded-lg text-sm transition-all ${selectedFont === font.id
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
                                                       onClick={() => handlePaletteSelect(palette)}
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
                                                       onClick={() => handleGradientSelect(grad)}
                                                       className={`aspect-[2/1] rounded-lg bg-gradient-to-br ${grad.value} ring-2 transition-all ${selectedGradient === grad.id ? 'ring-accent-green scale-105' : 'ring-transparent'}`}
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
                                        <div className="overflow-x-auto no-scrollbar">
                                             <div className="flex gap-2 pb-1 min-w-max pr-3">
                                                  {stickerCategories.map(cat => (
                                                       <button
                                                            key={cat.id}
                                                            onClick={() => setStickerFilter(cat.id)}
                                                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${stickerFilter === cat.id
                                                                 ? 'bg-accent-green text-white'
                                                                 : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                                                 }`}
                                                       >
                                                            {cat.name}
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                        {/* Sticker Grid */}
                                        <div className="grid grid-cols-6 gap-2">
                                             {filteredStickers.map(sticker => (
                                                  <button
                                                       key={sticker.id}
                                                       onClick={() => handleAddSticker(sticker)}
                                                       className="aspect-square rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-accent-green/10 hover:scale-110 transition-all flex items-center justify-center text-3xl"
                                                       title={sticker.name}
                                                  >
                                                       {sticker.emoji}
                                                  </button>
                                             ))}
                                        </div>
                                        {addedStickers.length > 0 && (
                                             <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                                  Sticker'ı kaldırmak için üzerine tıklayın
                                             </p>
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
                         {!canSpendToken && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] text-[#C5A059] bg-black/70 border border-[#C5A059]/30 px-2 py-1 rounded-full">
                                   Token bitti. Reklam izleyerek devam edin.
                              </div>
                         )}
                         <button
                              onClick={handleDownload}
                              disabled={isProcessing || !canSpendToken}
                              className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                         >
                              <span className="material-symbols-outlined text-lg">download</span>
                              İndir
                         </button>
                         <button
                              onClick={handleShare}
                              disabled={isProcessing || !canSpendToken}
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
