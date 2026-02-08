// AsrNesli Reset Password Page
// Yeni şifre belirleme sayfası

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import { updatePassword } from '../services/authService'
import { useAuth } from '../contexts/AuthContext'

const ResetPassword = () => {
     const navigate = useNavigate()
     const { refreshProfile } = useAuth()
     const [password, setPassword] = useState('')
     const [confirmPassword, setConfirmPassword] = useState('')
     const [error, setError] = useState('')
     const [success, setSuccess] = useState(false)
     const [loading, setLoading] = useState(false)

     useEffect(() => {
          // URL'deki hata mesajlarını kontrol et
          const hash = window.location.hash
          if (hash && hash.includes('error=')) {
               const params = new URLSearchParams(hash.substring(1))
               const errorDesc = params.get('error_description')
               const errorCode = params.get('error_code')

               if (errorCode === 'otp_expired' || errorDesc?.includes('expired')) {
                    setError('Şifre sıfırlama linkinin süresi dolmuş. Lütfen tekrar link isteyin.')
               } else {
                    setError(errorDesc || 'Şifre sıfırlama linki geçersiz.')
               }
          }
     }, [])

     const handleSubmit = async (e) => {
          e.preventDefault()
          setError('')

          if (!password) {
               setError('Yeni şifre gerekli')
               return
          }

          if (password.length < 6) {
               setError('Şifre en az 6 karakter olmalıdır')
               return
          }

          if (password !== confirmPassword) {
               setError('Şifreler eşleşmiyor')
               return
          }

          setLoading(true)

          try {
               const { error: updateError } = await updatePassword(password)

               if (updateError) {
                    setError('Şifre güncellenemedi: ' + updateError.message)
                    setLoading(false)
                    return
               }

               setSuccess(true)

               // Profil bilgisini yenile (çünkü şifre değişince session güncellenir)
               await refreshProfile()

               // 2 saniye sonra ana sayfaya yönlendir
               setTimeout(() => {
                    navigate('/', { replace: true })
               }, 2000)

          } catch (err) {
               console.error('Reset password error:', err)
               setError('Beklenmedik bir hata oluştu.')
          } finally {
               setLoading(false)
          }
     }

     if (success) {
          return (
               <AuthLayout
                    title="Şifre Başarıyla Güncellendi"
                    subtitle="Yeni şifreniz kaydedildi, uygulamaya giriş yapılıyor..."
               >
                    <div className="text-center space-y-6">
                         <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="size-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
                         >
                              <span className="material-symbols-outlined text-emerald-500 text-4xl">check_circle</span>
                         </motion.div>

                         <div className="flex flex-col items-center gap-2">
                              <div className="size-5 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
                              <p className="text-gray-400 text-sm">Giriş yapılıyor, lütfen bekleyin...</p>
                         </div>
                    </div>
               </AuthLayout>
          )
     }

     if (error && !password) {
          return (
               <AuthLayout
                    title="Bağlantı Geçersiz"
                    subtitle="Şifre sıfırlama işlemi gerçekleşemedi"
               >
                    <div className="text-center space-y-6">
                         <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="size-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center"
                         >
                              <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                         </motion.div>

                         <p className="text-red-400 text-sm font-medium px-4">
                              {error}
                         </p>

                         <div className="space-y-3 px-4">
                              <Link
                                   to="/forgot-password"
                                   className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2D5A27] to-[#3d7a37] text-white font-bold text-sm uppercase tracking-wider"
                              >
                                   Yeni Link Gönder
                              </Link>
                              <Link to="/login" className="block text-sm text-gray-400">Giriş Sayfasına Dön</Link>
                         </div>
                    </div>
               </AuthLayout>
          )
     }

     return (
          <AuthLayout
               title="Yeni Şifre Belirle"
               subtitle="Güvenliğiniz için güçlü bir şifre seçin"
          >
               <form onSubmit={handleSubmit} className="space-y-5">
                    <AuthInput
                         label="Yeni Şifre"
                         type="password"
                         name="password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="••••••"
                         icon="lock"
                         required
                    />

                    <AuthInput
                         label="Şifre Tekrar"
                         type="password"
                         name="confirmPassword"
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         placeholder="••••••"
                         icon="lock_reset"
                         error={error}
                         required
                    />

                    <motion.button
                         type="submit"
                         disabled={loading}
                         whileHover={{ scale: loading ? 1 : 1.01 }}
                         whileTap={{ scale: loading ? 1 : 0.99 }}
                         className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2D5A27] to-[#3d7a37] text-white font-bold text-sm uppercase tracking-wider shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                         {loading ? (
                              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         ) : (
                              <>
                                   <span>Şifreyi Güncelle ve Başla</span>
                                   <span className="material-symbols-outlined text-lg">rocket_launch</span>
                              </>
                         )}
                    </motion.button>
               </form>
          </AuthLayout>
     )
}

export default ResetPassword
