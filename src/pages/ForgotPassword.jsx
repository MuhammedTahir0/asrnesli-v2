// AsrNesli Forgot Password Page
// Şifre sıfırlama sayfası

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import { resetPassword } from '../services/authService'

const ForgotPassword = () => {
     const [email, setEmail] = useState('')
     const [error, setError] = useState('')
     const [loading, setLoading] = useState(false)
     const [sent, setSent] = useState(false)

     const handleSubmit = async (e) => {
          e.preventDefault()
          setError('')

          if (!email) {
               setError('E-posta adresi gerekli')
               return
          }

          if (!/\S+@\S+\.\S+/.test(email)) {
               setError('Geçerli bir e-posta adresi girin')
               return
          }

          setLoading(true)

          const { error: resetError } = await resetPassword(email)

          setLoading(false)

          if (resetError) {
               console.error('Reset password error:', resetError)
               // Rate limit hatası varsa daha açıklayıcı mesaj ver
               if (resetError.status === 429) {
                    setError('Çok fazla istek gönderildi. Lütfen bir dakika bekleyip tekrar deneyin.')
               } else {
                    setError(resetError.message || 'Şifre sıfırlama e-postası gönderilemedi.')
               }
               return
          }

          setSent(true)
     }

     if (sent) {
          return (
               <AuthLayout
                    title="E-posta Gönderildi"
                    subtitle="Şifre sıfırlama linki e-posta adresinize gönderildi"
               >
                    <div className="text-center space-y-6">
                         <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', damping: 15 }}
                              className="size-20 mx-auto rounded-full bg-[#2D5A27]/20 flex items-center justify-center"
                         >
                              <span className="material-symbols-outlined text-[#C5A059] text-4xl">mark_email_read</span>
                         </motion.div>

                         <p className="text-gray-400 text-sm">
                              <span className="text-white font-medium">{email}</span> adresine şifre sıfırlama linki gönderdik.
                              Lütfen gelen kutunuzu kontrol edin.
                         </p>

                         <div className="space-y-3">
                              <Link
                                   to="/login"
                                   className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#2D5A27] to-[#3d7a37] text-white font-bold text-sm uppercase tracking-wider shadow-lg text-center"
                              >
                                   Giriş Sayfasına Dön
                              </Link>

                              <button
                                   onClick={() => setSent(false)}
                                   className="text-sm text-[#C5A059] hover:text-[#E8D5A3] transition-colors"
                              >
                                   Farklı bir e-posta adresi dene
                              </button>
                         </div>
                    </div>
               </AuthLayout>
          )
     }

     return (
          <AuthLayout
               title="Şifremi Unuttum"
               subtitle="E-posta adresinizi girin, size sıfırlama linki gönderelim"
          >
               <form onSubmit={handleSubmit} className="space-y-5">
                    {/* E-posta */}
                    <AuthInput
                         label="E-posta"
                         type="email"
                         name="email"
                         value={email}
                         onChange={(e) => {
                              setEmail(e.target.value)
                              setError('')
                         }}
                         placeholder="ornek@email.com"
                         icon="mail"
                         error={error}
                         required
                         autoComplete="email"
                    />

                    {/* Gönder Butonu */}
                    <motion.button
                         type="submit"
                         disabled={loading}
                         whileHover={{ scale: loading ? 1 : 1.01 }}
                         whileTap={{ scale: loading ? 1 : 0.99 }}
                         className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2D5A27] to-[#3d7a37] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#2D5A27]/20 hover:shadow-[#2D5A27]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         {loading ? (
                              <>
                                   <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                   <span>Gönderiliyor...</span>
                              </>
                         ) : (
                              <>
                                   <span>Sıfırlama Linki Gönder</span>
                                   <span className="material-symbols-outlined text-lg">send</span>
                              </>
                         )}
                    </motion.button>

                    {/* Giriş Linki */}
                    <p className="text-center text-sm text-gray-400">
                         Şifrenizi hatırladınız mı?{' '}
                         <Link
                              to="/login"
                              className="text-[#C5A059] hover:text-[#E8D5A3] font-medium transition-colors"
                         >
                              Giriş Yap
                         </Link>
                    </p>
               </form>
          </AuthLayout>
     )
}

export default ForgotPassword
