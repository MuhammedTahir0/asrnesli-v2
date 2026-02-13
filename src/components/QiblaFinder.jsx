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
               <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background-light dark:bg-background-dark">
                    <div className="animate-pulse size-24 rounded-full border-4 border-accent-gold/20 flex items-center justify-center">
                         <span className="material-symbols-outlined text-accent-gold text-4xl">explore</span>
                    </div>
                    <p className="mt-4 text-primary dark:text-accent-gold font-bold">Harita Hazırlanıyor...</p>
               </div>
          )
     }

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark p-8 overflow-hidden relative">
               <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>

               {/* Header */}
               <header className="flex items-center gap-4 mb-12 relative z-10 w-full">
                    <button
                         onClick={() => navigate(-1)}
                         className="size-10 shrink-0 rounded-full bg-surface-light dark:bg-surface-dark border border-accent-gold/20 flex items-center justify-center text-primary dark:text-white"
                    >
                         <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex-1 pr-10 text-center">
                         <h2 className="text-2xl font-bold text-primary dark:text-white mb-1">Kıble Bulucu</h2>
                         <p className="text-[10px] text-text-secondary dark:text-gray-400 font-bold uppercase tracking-widest leading-tight">Telefonunuzu düz tutun</p>
                    </div>
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
                    <div className="relative size-80 rounded-full border-[2px] border-accent-gold/20 shadow-soft bg-surface-light dark:bg-surface-dark flex items-center justify-center z-10 overflow-hidden">
                         <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-islamic-pattern"></div>

                         {/* Circle Gradients */}
                         <div className="absolute inset-4 rounded-full border border-accent-gold/5 bg-gradient-to-br from-accent-gold/5 to-transparent"></div>
                         <div className="absolute inset-12 rounded-full border border-accent-gold/5"></div>
                         <div className="absolute inset-24 rounded-full border border-accent-gold/5"></div>

                         {/* Qibla Marker (Fixed Relative to Compass) */}
                         <motion.div
                              animate={{ rotate: qiblaAngle - deviceHeading }}
                              transition={{ type: 'spring', damping: 20, stiffness: 60 }}
                              className="absolute inset-4 z-20"
                         >
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                   <div className="size-12 rounded-full bg-accent-gold flex items-center justify-center shadow-lg shadow-accent-gold/30 border-4 border-white dark:border-surface-dark">
                                        <span className="material-symbols-outlined text-white text-2xl">mosque</span>
                                   </div>
                                   <div className="w-1 h-20 bg-gradient-to-t from-transparent via-accent-gold/30 to-accent-gold -mt-1" />
                              </div>
                         </motion.div>

                         {/* Compass Needle (Static, shows device heading) */}
                         <div className="absolute inset-0 flex items-center justify-center">
                              <div className="size-3 bg-primary dark:bg-white rounded-full shadow-lg z-30 border-2 border-accent-gold/30" />
                              <div className="w-0.5 h-32 bg-gradient-to-b from-primary dark:from-white to-transparent absolute top-1/2 -translate-y-full z-20 opacity-50" />
                         </div>

                         {/* Degree Marks */}
                         {[0, 90, 180, 270].map(deg => (
                              <div key={deg} className="absolute inset-8 pointer-events-none" style={{ transform: `rotate(${deg}deg)` }}>
                                   <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-bold text-accent-gold/40 uppercase tracking-widest">
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
                                   className="px-10 py-4 bg-accent-gold text-white rounded-2xl font-bold shadow-lg shadow-accent-gold/20 flex items-center gap-3 transition-all active:scale-95 border border-white/20"
                              >
                                   <span className="material-symbols-outlined">sensors</span>
                                   <span className="uppercase tracking-widest text-xs">Pusulayı Etkinleştir</span>
                              </button>
                         ) : (
                              <motion.div
                                   animate={{ scale: isAligned ? 1.05 : 1 }}
                                   className={`px-10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border ${isAligned ? 'bg-accent-gold text-white border-white/20 shadow-xl shadow-accent-gold/30' : 'bg-surface-light dark:bg-surface-dark text-text-secondary dark:text-gray-400 border-accent-gold/20 shadow-soft'}`}
                              >
                                   {isAligned ? 'Kıbleye Yöneldiniz' : 'Telefonu Döndürün'}
                              </motion.div>
                         )}
                    </div>
               </div>

               {/* Hint Area */}
               <div className="mt-auto p-6 rounded-[2rem] bg-surface-light dark:bg-surface-dark border border-accent-gold/20 shadow-soft relative z-10">
                    <div className="flex items-start gap-4">
                         <div className="size-10 shrink-0 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                              <span className="material-symbols-outlined">info</span>
                         </div>
                         <div>
                              <p className="text-xs font-bold text-primary dark:text-white mb-1 uppercase tracking-wider">Mıknatıslardan Uzak Durun</p>
                              <p className="text-[11px] text-text-secondary dark:text-gray-400 leading-relaxed font-medium">Pusulanın doğru çalışması için telefonunuzun yakınında mıknatıs veya büyük metal kütleler bulunmadığından emin olun.</p>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default QiblaFinder
