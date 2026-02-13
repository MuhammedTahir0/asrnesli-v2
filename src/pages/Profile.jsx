// AsrNesli Profile Page
// Profil görüntüleme ve düzenleme sayfası

import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile, uploadAvatar } from '../services/authService'
import { syncService } from '../services/syncService'
import { supabase } from '../lib/supabaseClient'

const Profile = () => {
     const navigate = useNavigate()
     const { user, profile, refreshProfile, logout, logoutLoading } = useAuth()
     const fileInputRef = useRef(null)

     const [isEditing, setIsEditing] = useState(false)
     const [formData, setFormData] = useState({
          full_name: profile?.full_name || '',
          username: profile?.username || '',
          phone: profile?.phone || ''
     })
     const [loading, setLoading] = useState(false)
     const [avatarLoading, setAvatarLoading] = useState(false)
     const [message, setMessage] = useState({ type: '', text: '' })

     const handleChange = (e) => {
          const { name, value } = e.target
          setFormData(prev => ({ ...prev, [name]: value }))
     }

     const handleAvatarChange = async (e) => {
          const file = e.target.files?.[0]
          if (!file) return

          // Dosya boyutu kontrolü (max 2MB)
          if (file.size > 2 * 1024 * 1024) {
               setMessage({ type: 'error', text: 'Dosya boyutu maksimum 2MB olmalı' })
               return
          }

          setAvatarLoading(true)
          setMessage({ type: '', text: '' })

          const { error } = await uploadAvatar(user.id, file)

          setAvatarLoading(false)

          if (error) {
               setMessage({ type: 'error', text: 'Avatar yüklenemedi' })
               return
          }

          await refreshProfile()
          setMessage({ type: 'success', text: 'Avatar güncellendi' })
     }

     const handleSave = async () => {
          setLoading(true)
          setMessage({ type: '', text: '' })

          const { error } = await updateProfile(user.id, formData)

          setLoading(false)

          if (error) {
               setMessage({ type: 'error', text: 'Profil güncellenemedi' })
               return
          }

          await refreshProfile()

          // Senkronize et
          if (user?.id) {
               await syncService.syncPreferences(user.id, formData)
          }

          setIsEditing(false)
          setMessage({ type: 'success', text: 'Profil güncellendi' })
     }

     const handleLogout = async () => {
          try {
               await logout()
               navigate('/login', { replace: true })
          } catch (err) {
               console.error('Logout error in component:', err)
               navigate('/login', { replace: true })
          }
     }

     const [activityData, setActivityData] = useState([])
     const [activityLoading, setActivityLoading] = useState(true)

     const fetchActivity = async () => {
          if (!user) return
          try {
               const thirtyDaysAgo = new Date()
               thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
               const startDate = thirtyDaysAgo.toISOString().split('T')[0]

               const { data, error } = await supabase
                    .from('user_checklist_completions')
                    .select('completion_date, points')
                    .eq('user_id', user.id)
                    .gte('completion_date', startDate)

               if (error) throw error

               // Tarihe göre grupla
               const grouped = data.reduce((acc, curr) => {
                    const date = curr.completion_date
                    acc[date] = (acc[date] || 0) + curr.points
                    return acc
               }, {})

               // Son 30 günü diziye dök
               const days = []
               for (let i = 29; i >= 0; i--) {
                    const d = new Date()
                    d.setDate(d.getDate() - i)
                    const dateStr = d.toISOString().split('T')[0]
                    days.push({
                         date: dateStr,
                         points: grouped[dateStr] || 0,
                         dayName: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
                         dayNum: d.getDate()
                    })
               }
               setActivityData(days)
          } catch (err) {
               console.error('Activity fetch error:', err)
          } finally {
               setActivityLoading(false)
          }
     }

     React.useEffect(() => {
          fetchActivity()
     }, [user])

     return (
          <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
               {/* Header */}
               <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-b border-black/5 dark:border-accent-gold/10">
                    <div className="flex items-center justify-between p-4">
                         <button
                              onClick={() => navigate(-1)}
                              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                         >
                              <span className="material-symbols-outlined text-primary dark:text-accent-gold">arrow_back</span>
                         </button>
                         <h1 className="text-2xl font-bold text-primary dark:text-accent-gold">Profilim</h1>
                         <button
                              onClick={handleLogout}
                              className="p-2 rounded-full hover:bg-red-500/10 text-red-400 transition-colors"
                         >
                              <span className="material-symbols-outlined">logout</span>
                         </button>
                    </div>
               </header>

               <div className="p-4 max-w-lg mx-auto space-y-6">
                    {/* Avatar Bölümü */}
                    <motion.div
                         className="flex flex-col items-center"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                    >
                         <div className="relative">
                              <div className="size-28 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center border-4 border-accent-gold/30 overflow-hidden shadow-lg shadow-accent-gold/20">
                                   {profile?.avatar_url ? (
                                        <img
                                             src={profile.avatar_url}
                                             alt={profile.full_name}
                                             className="w-full h-full object-cover"
                                        />
                                   ) : (
                                        <span className="text-accent-gold text-4xl font-bold">
                                             {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                                        </span>
                                   )}

                                   {avatarLoading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                             <div className="size-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                   )}
                              </div>

                              {/* Avatar değiştir butonu */}
                              <button
                                   onClick={() => fileInputRef.current?.click()}
                                   className="absolute bottom-0 right-0 size-8 rounded-full bg-primary flex items-center justify-center border-2 border-white"
                              >
                                   <span className="material-symbols-outlined text-white text-lg">edit</span>
                              </button>

                              <input
                                   ref={fileInputRef}
                                   type="file"
                                   accept="image/*"
                                   onChange={handleAvatarChange}
                                   className="hidden"
                              />
                         </div>

                         <h2 className="mt-4 text-xl font-bold text-primary dark:text-accent-gold">{profile?.full_name || 'İsimsiz'}</h2>
                         <p className="text-accent-gold font-bold">@{profile?.username || 'kullanici'}</p>
                    </motion.div>

                    {/* Mesaj */}
                    {
                         message.text && (
                              <motion.div
                                   initial={{ opacity: 0, y: -10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className={`p-3 rounded-xl text-sm flex items-center gap-2 ${message.type === 'error'
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        }`}
                              >
                                   <span className="material-symbols-outlined text-lg">
                                        {message.type === 'error' ? 'error' : 'check_circle'}
                                   </span>
                                   {message.text}
                              </motion.div>
                         )
                    }

                    {/* Profil Bilgileri */}
                    <motion.div
                         className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-accent-gold/20 overflow-hidden shadow-sm"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                    >
                         <div className="p-4 border-b border-accent-gold/10 flex items-center justify-between bg-surface-subtle dark:bg-white/5">
                              <h3 className="font-bold text-primary dark:text-accent-gold">Hesap Bilgileri</h3>
                              <button
                                   onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                   disabled={loading}
                                   className="text-accent-gold text-sm font-medium flex items-center gap-1 hover:text-accent-gold-dark transition-colors"
                              >
                                   {loading ? (
                                        <div className="size-4 border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
                                   ) : (
                                        <span className="material-symbols-outlined text-lg">
                                             {isEditing ? 'save' : 'edit'}
                                        </span>
                                   )}
                                   {isEditing ? 'Kaydet' : 'Düzenle'}
                              </button>
                         </div>

                         <div className="p-4 space-y-4">
                              {/* E-posta (değiştirilemez) */}
                              <div>
                                   <label className="text-[10px] text-text-secondary dark:text-accent-gold/70 uppercase tracking-[0.15em] font-semibold">E-posta</label>
                                   <p className="text-primary dark:text-accent-gold mt-1 font-bold">{user?.email}</p>
                              </div>

                              {/* Ad Soyad */}
                              <div>
                                   <label className="text-[10px] text-text-secondary dark:text-accent-gold/70 uppercase tracking-[0.15em] font-semibold">Ad Soyad</label>
                                   {isEditing ? (
                                        <input
                                             name="full_name"
                                             value={formData.full_name}
                                             onChange={handleChange}
                                             className="w-full mt-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-primary dark:text-accent-gold focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/50"
                                        />
                                   ) : (
                                        <p className="text-primary dark:text-accent-gold mt-1 font-bold">{profile?.full_name || '-'}</p>
                                   )}
                              </div>

                              {/* Kullanıcı Adı */}
                              <div>
                                   <label className="text-[10px] text-text-secondary dark:text-accent-gold/70 uppercase tracking-[0.15em] font-semibold">Kullanıcı Adı</label>
                                   {isEditing ? (
                                        <input
                                             name="username"
                                             value={formData.username}
                                             onChange={handleChange}
                                             className="w-full mt-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-primary dark:text-accent-gold focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/50"
                                        />
                                   ) : (
                                        <p className="text-primary dark:text-accent-gold mt-1 font-bold">@{profile?.username || '-'}</p>
                                   )}
                              </div>

                              {/* Telefon */}
                              <div>
                                   <label className="text-[10px] text-text-secondary dark:text-accent-gold/70 uppercase tracking-[0.15em] font-semibold">Telefon</label>
                                   {isEditing ? (
                                        <input
                                             name="phone"
                                             value={formData.phone}
                                             onChange={handleChange}
                                             className="w-full mt-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-primary dark:text-accent-gold focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/50"
                                        />
                                   ) : (
                                        <p className="text-primary dark:text-accent-gold mt-1 font-bold">{profile?.phone || '-'}</p>
                                   )}
                              </div>

                              {/* Kayıt Tarihi */}
                              <div>
                                   <label className="text-[10px] text-text-secondary dark:text-accent-gold/70 uppercase tracking-[0.15em] font-semibold">Kayıt Tarihi</label>
                                   <p className="text-primary dark:text-accent-gold mt-1 font-bold">
                                        {(profile?.created_at || user?.created_at)
                                             ? new Date(profile?.created_at || user?.created_at).toLocaleDateString('tr-TR', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric'
                                             })
                                             : '-'
                                        }
                                   </p>
                              </div>
                         </div>
                    </motion.div>

                    {/* Amel Takvimi (Heatmap) */}
                    <motion.div
                         className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-accent-gold/20 overflow-hidden shadow-sm"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.15 }}
                    >
                         <div className="p-4 border-b border-accent-gold/10 flex items-center justify-between bg-surface-subtle dark:bg-white/5">
                              <h3 className="font-bold text-primary dark:text-accent-gold flex items-center gap-2">
                                   <span className="material-symbols-outlined text-accent-gold">calendar_month</span>
                                   Amel Takvimi
                              </h3>
                              <div className="flex gap-1">
                                   <div className="size-2 rounded bg-gray-100 dark:bg-white/5" />
                                   <div className="size-2 rounded bg-[#0a9396]/30" />
                                   <div className="size-2 rounded bg-[#0a9396]/60" />
                                   <div className="size-2 rounded bg-[#0a9396]" />
                              </div>
                         </div>

                         <div className="p-5">
                              {activityLoading ? (
                                   <div className="flex items-center justify-center py-10">
                                        <div className="size-8 border-3 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
                                   </div>
                              ) : (
                                   <div className="grid grid-cols-7 gap-2">
                                        {activityData.map((day, i) => {
                                             let colorClass = 'bg-gray-100 dark:bg-white/5';
                                             if (day.points > 0 && day.points < 30) colorClass = 'bg-[#0a9396]/20 text-[#0a9396]';
                                             if (day.points >= 30 && day.points < 60) colorClass = 'bg-[#0a9396]/50 text-white';
                                             if (day.points >= 60) colorClass = 'bg-[#0a9396] text-white';

                                             return (
                                                  <div key={i} className="flex flex-col items-center gap-1">
                                                       <span className="text-[8px] opacity-50 font-bold uppercase">{day.dayName}</span>
                                                       <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            className={`size-10 rounded-xl flex flex-col items-center justify-center transition-all ${colorClass} border border-black/5 dark:border-white/5`}
                                                       >
                                                            <span className="text-[10px] font-bold">{day.dayNum}</span>
                                                            {day.points > 0 && <span className="text-[7px] font-black">{day.points}</span>}
                                                       </motion.div>
                                                  </div>
                                             )
                                        })}
                                   </div>
                              )}
                              <p className="mt-4 text-[10px] text-center text-text-secondary dark:text-accent-gold/50">
                                   Son 30 günlük ibadet ve aktivite geçmişiniz
                              </p>
                         </div>
                    </motion.div>

                    {/* Hızlı Menü */}
                    <motion.div
                         className="space-y-3"
                         transition={{ delay: 0.2 }}
                    >
                         <button
                              onClick={() => navigate('/favorites')}
                              className="w-full p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-accent-gold/20 flex items-center justify-between group hover:border-accent-gold/40 hover:shadow-md transition-all"
                         >
                              <div className="flex items-center gap-4">
                                   <div className="size-10 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold shadow-sm group-hover:bg-accent-gold group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">bookmark</span>
                                   </div>
                                   <div className="text-left">
                                        <h4 className="font-bold text-primary dark:text-accent-gold/90">Favorilerim</h4>
                                        <p className="text-xs text-text-secondary dark:text-accent-gold/70">Kaydettiğiniz tüm içerikler</p>
                                   </div>
                              </div>
                              <span className="material-symbols-outlined text-accent-gold group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                         </button>

                         <button
                              onClick={() => navigate('/settings')}
                              className="w-full p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-accent-gold/20 flex items-center justify-between group hover:border-accent-gold/40 hover:shadow-md transition-all"
                         >
                              <div className="flex items-center gap-4">
                                   <div className="size-10 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold shadow-sm group-hover:bg-accent-gold group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">settings</span>
                                   </div>
                                   <div className="text-left">
                                        <h4 className="font-bold text-primary dark:text-accent-gold/90">Ayarlar</h4>
                                        <p className="text-xs text-text-secondary dark:text-accent-gold/70">Uygulama tercihlerinizi yönetin</p>
                                   </div>
                              </div>
                              <span className="material-symbols-outlined text-accent-gold group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                         </button>
                    </motion.div>

                    {/* Çıkış Yap Butonu */}
                    <motion.button
                         onClick={handleLogout}
                         disabled={logoutLoading}
                         whileHover={{ scale: logoutLoading ? 1 : 1.01 }}
                         whileTap={{ scale: logoutLoading ? 1 : 0.99 }}
                         className="w-full py-3.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wider hover:bg-red-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {logoutLoading ? (
                              <div className="size-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                         ) : (
                              <span className="material-symbols-outlined text-lg">logout</span>
                         )}
                         <span>{logoutLoading ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}</span>
                    </motion.button>
               </div >
          </div >
     )
}

export default Profile
