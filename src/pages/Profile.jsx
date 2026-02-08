// AsrNesli Profile Page
// Profil görüntüleme ve düzenleme sayfası

import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile, uploadAvatar } from '../services/authService'

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
          setIsEditing(false)
          setMessage({ type: 'success', text: 'Profil güncellendi' })
     }

     const handleLogout = async () => {
          try {
               await logout()
               // Navigate zaten AuthGuard tarafından da tetiklenebilir ama manuel yapmak daha güvenli
               navigate('/login', { replace: true })
          } catch (err) {
               console.error('Logout error in component:', err)
               navigate('/login', { replace: true })
          }
     }

     return (
          <div className="min-h-screen bg-gradient-to-b from-[#0a1a0a] via-[#0f2a0f] to-[#0a1a0a] pb-20">
               {/* Header */}
               <header className="sticky top-0 z-50 bg-[#0a1a0a]/90 backdrop-blur-xl border-b border-[#C5A059]/10">
                    <div className="flex items-center justify-between p-4">
                         <button
                              onClick={() => navigate(-1)}
                              className="p-2 rounded-full hover:bg-white/5 transition-colors"
                         >
                              <span className="material-symbols-outlined text-white">arrow_back</span>
                         </button>
                         <h1 className="text-lg font-bold text-white">Profilim</h1>
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
                              <div className="size-28 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#1a3a1a] flex items-center justify-center border-4 border-[#C5A059]/30 overflow-hidden">
                                   {profile?.avatar_url ? (
                                        <img
                                             src={profile.avatar_url}
                                             alt={profile.full_name}
                                             className="w-full h-full object-cover"
                                        />
                                   ) : (
                                        <span className="text-[#C5A059] text-4xl font-bold">
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
                                   className="absolute bottom-0 right-0 size-10 rounded-full bg-[#2D5A27] border-2 border-[#0a1a0a] flex items-center justify-center hover:bg-[#3d7a37] transition-colors"
                              >
                                   <span className="material-symbols-outlined text-white text-lg">photo_camera</span>
                              </button>

                              <input
                                   ref={fileInputRef}
                                   type="file"
                                   accept="image/*"
                                   onChange={handleAvatarChange}
                                   className="hidden"
                              />
                         </div>

                         <h2 className="mt-4 text-xl font-bold text-white">{profile?.full_name || 'İsimsiz'}</h2>
                         <p className="text-[#C5A059]">@{profile?.username || 'kullanici'}</p>
                    </motion.div>

                    {/* Mesaj */}
                    {message.text && (
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
                    )}

                    {/* Profil Bilgileri */}
                    <motion.div
                         className="bg-[#0f1f0f]/80 rounded-2xl border border-[#C5A059]/20 overflow-hidden"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                    >
                         <div className="p-4 border-b border-[#C5A059]/10 flex items-center justify-between">
                              <h3 className="font-bold text-white">Hesap Bilgileri</h3>
                              <button
                                   onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                   disabled={loading}
                                   className="text-[#C5A059] text-sm font-medium flex items-center gap-1"
                              >
                                   {loading ? (
                                        <div className="size-4 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
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
                                   <label className="text-xs text-gray-500 uppercase tracking-wide">E-posta</label>
                                   <p className="text-white mt-1">{user?.email}</p>
                              </div>

                              {/* Ad Soyad */}
                              <div>
                                   <label className="text-xs text-gray-500 uppercase tracking-wide">Ad Soyad</label>
                                   {isEditing ? (
                                        <input
                                             name="full_name"
                                             value={formData.full_name}
                                             onChange={handleChange}
                                             className="w-full mt-1 bg-[#1a2a1a] border border-[#2D5A27]/30 rounded-lg px-3 py-2 text-white focus:border-[#C5A059]/50 focus:outline-none"
                                        />
                                   ) : (
                                        <p className="text-white mt-1">{profile?.full_name || '-'}</p>
                                   )}
                              </div>

                              {/* Kullanıcı Adı */}
                              <div>
                                   <label className="text-xs text-gray-500 uppercase tracking-wide">Kullanıcı Adı</label>
                                   {isEditing ? (
                                        <input
                                             name="username"
                                             value={formData.username}
                                             onChange={handleChange}
                                             className="w-full mt-1 bg-[#1a2a1a] border border-[#2D5A27]/30 rounded-lg px-3 py-2 text-white focus:border-[#C5A059]/50 focus:outline-none"
                                        />
                                   ) : (
                                        <p className="text-white mt-1">@{profile?.username || '-'}</p>
                                   )}
                              </div>

                              {/* Telefon */}
                              <div>
                                   <label className="text-xs text-gray-500 uppercase tracking-wide">Telefon</label>
                                   {isEditing ? (
                                        <input
                                             name="phone"
                                             value={formData.phone}
                                             onChange={handleChange}
                                             className="w-full mt-1 bg-[#1a2a1a] border border-[#2D5A27]/30 rounded-lg px-3 py-2 text-white focus:border-[#C5A059]/50 focus:outline-none"
                                        />
                                   ) : (
                                        <p className="text-white mt-1">{profile?.phone || '-'}</p>
                                   )}
                              </div>

                              {/* Kayıt Tarihi */}
                              <div>
                                   <label className="text-xs text-gray-500 uppercase tracking-wide">Kayıt Tarihi</label>
                                   <p className="text-white mt-1">
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

                    {/* Çıkış Yap Butonu */}
                    <motion.button
                         onClick={handleLogout}
                         disabled={logoutLoading}
                         whileHover={{ scale: logoutLoading ? 1 : 1.01 }}
                         whileTap={{ scale: logoutLoading ? 1 : 0.99 }}
                         className="w-full py-3.5 rounded-xl border border-red-500/30 text-red-400 font-bold text-sm uppercase tracking-wider hover:bg-red-500/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {logoutLoading ? (
                              <div className="size-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                         ) : (
                              <span className="material-symbols-outlined text-lg">logout</span>
                         )}
                         <span>{logoutLoading ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}</span>
                    </motion.button>
               </div>
          </div>
     )
}

export default Profile
