import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QiblaFinder = () => {
     const [qiblaAngle, setQiblaAngle] = useState(0)
     const [deviceHeading, setDeviceHeading] = useState(0)
     const [isAligned, setIsAligned] = useState(false)
     const [loading, setLoading] = useState(true)
     const [permissionGranted, setPermissionGranted] = useState(false)

     useEffect(() => {
          if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(
                    (position) => {
                         const { latitude, longitude } = position.coords
                         calculateQibla(latitude, longitude)
                         setLoading(false)
                    },
                    (error) => {
                         console.error('Konum hatası:', error)
                         // Varsayılan koordinatlar (Örn: İstanbul)
                         calculateQibla(41.0082, 28.9784)
                         setLoading(false)
                    }
               )
          }

          const handleOrientation = (event) => {
               if (event.webkitCompassHeading) {
                    // iOS cihazlar için
                    setDeviceHeading(event.webkitCompassHeading)
               } else if (event.alpha) {
                    // Android cihazlar için (Z-axis rotation)
                    // Not: Bu genellikle gerçek kuzeye göre değil, telefonun açıldığı andaki yönüne göredir.
                    // Tam doğru sonuç için Absolute Orientation kullanılır.
                    setDeviceHeading(360 - event.alpha)
               }
          }

          // Cihaz yönünü dinle
          window.addEventListener('deviceorientation', handleOrientation)
          return () => window.removeEventListener('deviceorientation', handleOrientation)
     }, [])

     useEffect(() => {
          // Kıble açısı ile cihazın baktığı açı arasındaki farkı kontrol et
          const diff = Math.abs(qiblaAngle - deviceHeading)
          setIsAligned(diff < 5 || diff > 355)
     }, [qiblaAngle, deviceHeading])

     const calculateQibla = (lat, lng) => {
          const kaabaLat = 21.4225
          const kaabaLng = 39.8262

          const y = Math.sin(degreeToRadian(kaabaLng - lng))
          const x = Math.cos(degreeToRadian(lat)) * Math.tan(degreeToRadian(kaabaLat)) -
               Math.sin(degreeToRadian(lat)) * Math.cos(degreeToRadian(kaabaLng - lng))

          let qibla = radianToDegree(Math.atan2(y, x))
          setQiblaAngle((qibla + 360) % 360)
     }

     const degreeToRadian = (deg) => deg * (Math.PI / 180)
     const radianToDegree = (rad) => rad * (180 / Math.PI)

     const requestPermission = () => {
          // iOS 13+ için özel izin isteği
          if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
               DeviceOrientationEvent.requestPermission()
                    .then(response => {
                         if (response === 'granted') setPermissionGranted(true)
                    })
                    .catch(console.error)
          } else {
               setPermissionGranted(true)
          }
     }

     if (loading) {
          return (
               <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background-light">
                    <div className="animate-pulse size-24 rounded-full border-4 border-accent-gold/20 flex items-center justify-center">
                         <span className="material-symbols-outlined text-accent-gold text-4xl">explore</span>
                    </div>
                    <p className="mt-4 text-primary font-bold">Harita Hazırlanıyor...</p>
               </div>
          )
     }

     return (
          <div className="flex-1 flex flex-col bg-background-light p-8 overflow-hidden">
               {/* Header */}
               <header className="text-center mb-12">
                    <h2 className="text-3xl font-black font-serif text-text-primary mb-2 tracking-tight">Kıble Bulucu</h2>
                    <p className="text-sm text-gray-400 font-medium">Uygulamadan en iyi sonucu almak için telefonunuzu düz tutun.</p>
               </header>

               {/* Compass Area */}
               <div className="flex-1 flex flex-col items-center justify-center relative">
                    {/* Glowing Aura when Aligned */}
                    <AnimatePresence>
                         {isAligned && (
                              <motion.div
                                   initial={{ opacity: 0, scale: 0.8 }}
                                   animate={{ opacity: 1, scale: 1.2 }}
                                   exit={{ opacity: 0, scale: 1.5 }}
                                   className="absolute size-80 rounded-full bg-accent-gold/10 blur-3xl z-0"
                              />
                         )}
                    </AnimatePresence>

                    {/* Compass Ring */}
                    <div className="relative size-80 rounded-full border-[10px] border-[#e3e1dd] shadow-2xl bg-white flex items-center justify-center z-10 overflow-hidden">
                         <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] rotate-45"></div>

                         {/* Qibla Marker (Fixed Relative to Compass) */}
                         <motion.div
                              animate={{ rotate: qiblaAngle - deviceHeading }}
                              transition={{ type: 'spring', damping: 15 }}
                              className="absolute inset-4 z-20"
                         >
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                   <div className="size-10 rounded-full bg-accent-gold flex items-center justify-center shadow-lg shadow-accent-gold/40">
                                        <span className="material-symbols-outlined text-white text-2xl">mosque</span>
                                   </div>
                                   <div className="w-1.5 h-16 bg-gradient-to-t from-transparent to-accent-gold -mt-2" />
                              </div>
                         </motion.div>

                         {/* Compass Needle (Static, shows device heading) */}
                         <div className="absolute inset-0 flex items-center justify-center">
                              <div className="size-4 bg-text-primary rounded-full shadow-lg z-30" />
                              <div className="w-1 h-32 bg-gradient-to-b from-text-primary to-transparent absolute top-1/2 -translate-y-full z-20" />
                         </div>

                         {/* Degree Marks */}
                         {[0, 90, 180, 270].map(deg => (
                              <div key={deg} className="absolute inset-8 pointer-events-none" style={{ transform: `rotate(${deg}deg)` }}>
                                   <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                        {deg === 0 ? 'K' : deg === 90 ? 'D' : deg === 180 ? 'G' : 'B'}
                                   </span>
                              </div>
                         ))}
                    </div>

                    {/* Feedback Button / Text */}
                    <div className="mt-16 text-center z-20">
                         {!permissionGranted ? (
                              <button
                                   onClick={requestPermission}
                                   className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center gap-3 transition-transform active:scale-95"
                              >
                                   <span className="material-symbols-outlined">sensors</span>
                                   <span>Pusulayı Etkinleştir</span>
                              </button>
                         ) : (
                              <motion.div
                                   animate={{ scale: isAligned ? 1.1 : 1 }}
                                   className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-colors border-2 ${isAligned ? 'bg-accent-gold text-white border-accent-gold shadow-2xl shadow-accent-gold/40' : 'bg-white text-gray-400 border-gray-100'}`}
                              >
                                   {isAligned ? 'Kıbleye Yöneldiniz' : 'Telefonu Döndürün'}
                              </motion.div>
                         )}
                    </div>
               </div>

               {/* Hint Area */}
               <div className="mt-auto p-8 rounded-[2rem] bg-background-light border border-[#e3e1dd]">
                    <div className="flex items-start gap-4">
                         <div className="size-10 shrink-0 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                              <span className="material-symbols-outlined">info</span>
                         </div>
                         <div>
                              <p className="text-xs font-bold text-text-primary mb-1">Mıknatıslardan Uzak Durun</p>
                              <p className="text-[11px] text-gray-400 leading-relaxed">Pusulanın doğru çalışması için telefonunuzun yakınında mıknatıs veya büyük metal kütleler bulunmadığından emin olun.</p>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default QiblaFinder
