// AsrNesli Verify Email Page
// E-posta doğrulama bilgilendirme sayfası

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from '../components/auth/AuthLayout'

const VerifyEmail = () => {
     return (
          <AuthLayout
               title="E-postanızı Doğrulayın"
               subtitle="Kayıt işlemini tamamlamak için e-posta adresinizi doğrulamanız gerekiyor."
          >
               <div className="text-center space-y-6">
                    {/* İkon */}
                    <motion.div
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         transition={{ type: 'spring', damping: 15 }}
                         className="size-24 mx-auto rounded-full bg-gradient-to-br from-[#2D5A27] to-[#1a3a1a] border-4 border-[#C5A059]/30 flex items-center justify-center shadow-lg shadow-[#2D5A27]/20"
                    >
                         <span className="material-symbols-outlined text-[#C5A059] text-5xl">mail</span>
                    </motion.div>

                    <div className="space-y-2">
                         <p className="text-white font-medium">
                              Doğrulama linki gönderildi!
                         </p>
                         <p className="text-gray-400 text-sm">
                              Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin ve gönderdiğimiz linke tıklayarak hesabınızı aktifleştirin.
                         </p>
                    </div>

                    {/* Aksiyonlar */}
                    <div className="space-y-3 pt-4">
                         <Link
                              to="/login"
                              className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2D5A27] to-[#3d7a37] text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-[#2D5A27]/40 transition-all duration-300"
                         >
                              Giriş Yap
                         </Link>

                         <button
                              className="text-sm text-[#C5A059] hover:text-[#E8D5A3] transition-colors"
                              onClick={() => window.location.reload()}
                         >
                              E-postayı almadım, tekrar gönder
                         </button>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                         <p className="text-xs text-gray-500">
                              Sorun mu yaşıyorsunuz? <a href="mailto:destek@asrnesli.com" className="text-[#C5A059] hover:underline">Bize Ulaşın</a>
                         </p>
                    </div>
               </div>
          </AuthLayout>
     )
}

export default VerifyEmail
