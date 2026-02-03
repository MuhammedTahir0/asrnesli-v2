// AsrNesli Register Page
// İslami-Lüks tasarımlı kayıt sayfası

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import GoogleButton from '../components/auth/GoogleButton'
import TestAccountButton from '../components/auth/TestAccountButton'
import { signUpWithEmail, signInWithGoogle, checkUsernameAvailable } from '../services/authService'

const Register = () => {
     const navigate = useNavigate()

     const [step, setStep] = useState(1) // 1: Temel bilgiler, 2: Profil bilgileri
     const [formData, setFormData] = useState({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          username: '',
          phone: ''
     })
     const [errors, setErrors] = useState({})
     const [loading, setLoading] = useState(false)
     const [googleLoading, setGoogleLoading] = useState(false)
     const [message, setMessage] = useState({ type: '', text: '' })
     const [usernameChecking, setUsernameChecking] = useState(false)
     const [usernameAvailable, setUsernameAvailable] = useState(null)

     // Username kontrolü (debounced)
     useEffect(() => {
          if (!formData.username || formData.username.length < 3) {
               setUsernameAvailable(null)
               return
          }

          const timer = setTimeout(async () => {
               setUsernameChecking(true)
               const { available } = await checkUsernameAvailable(formData.username)
               setUsernameAvailable(available)
               setUsernameChecking(false)
          }, 500)

          return () => clearTimeout(timer)
     }, [formData.username])

     const handleChange = (e) => {
          const { name, value } = e.target
          setFormData(prev => ({ ...prev, [name]: value }))

          // Hata temizle
          if (errors[name]) {
               setErrors(prev => ({ ...prev, [name]: '' }))
          }
     }

     const validateStep1 = () => {
          const newErrors = {}

          if (!formData.email) {
               newErrors.email = 'E-posta adresi gerekli'
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
               newErrors.email = 'Geçerli bir e-posta adresi girin'
          }

          if (!formData.password) {
               newErrors.password = 'Şifre gerekli'
          } else if (formData.password.length < 8) {
               newErrors.password = 'Şifre en az 8 karakter olmalı'
          }

          if (!formData.confirmPassword) {
               newErrors.confirmPassword = 'Şifre tekrarı gerekli'
          } else if (formData.password !== formData.confirmPassword) {
               newErrors.confirmPassword = 'Şifreler eşleşmiyor'
          }

          setErrors(newErrors)
          return Object.keys(newErrors).length === 0
     }

     const validateStep2 = () => {
          const newErrors = {}

          if (!formData.fullName) {
               newErrors.fullName = 'Ad soyad gerekli'
          } else if (formData.fullName.length < 3) {
               newErrors.fullName = 'Ad soyad en az 3 karakter olmalı'
          }

          if (!formData.username) {
               newErrors.username = 'Kullanıcı adı gerekli'
          } else if (formData.username.length < 3) {
               newErrors.username = 'Kullanıcı adı en az 3 karakter olmalı'
          } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
               newErrors.username = 'Sadece harf, rakam ve alt çizgi kullanılabilir'
          } else if (usernameAvailable === false) {
               newErrors.username = 'Bu kullanıcı adı zaten kullanılıyor'
          }

          if (!formData.phone) {
               newErrors.phone = 'Telefon numarası gerekli'
          } else if (!/^[0-9+\s()-]{10,}$/.test(formData.phone)) {
               newErrors.phone = 'Geçerli bir telefon numarası girin'
          }

          setErrors(newErrors)
          return Object.keys(newErrors).length === 0
     }

     const handleNextStep = () => {
          if (validateStep1()) {
               setStep(2)
          }
     }

     const handleSubmit = async (e) => {
          e.preventDefault()
          setMessage({ type: '', text: '' })

          if (!validateStep2()) return

          setLoading(true)

          const { data, error } = await signUpWithEmail({
               email: formData.email,
               password: formData.password,
               fullName: formData.fullName,
               username: formData.username,
               phone: formData.phone
          })

          setLoading(false)

          if (error) {
               let errorMessage = 'Kayıt yapılamadı. Lütfen tekrar deneyin.'

               if (error.message?.includes('already registered')) {
                    errorMessage = 'Bu e-posta adresi zaten kayıtlı.'
               }

               setMessage({ type: 'error', text: errorMessage })
               return
          }

          // Başarılı kayıt
          setMessage({
               type: 'success',
               text: 'Kayıt başarılı! E-posta adresinize doğrulama linki gönderildi.'
          })

          // 2 saniye sonra login sayfasına yönlendir
          setTimeout(() => {
               navigate('/login')
          }, 2000)
     }

     const handleGoogleSignIn = async () => {
          setGoogleLoading(true)
          setMessage({ type: '', text: '' })

          const { error } = await signInWithGoogle()

          if (error) {
               setGoogleLoading(false)
               setMessage({ type: 'error', text: 'Google ile kayıt yapılamadı.' })
          }
     }

     return (
          <AuthLayout
               title={step === 1 ? 'Hesap Oluştur' : 'Profil Bilgileri'}
               subtitle={step === 1 ? 'AsrNesli ailesine katılın' : 'Bilgilerinizi tamamlayın'}
          >
               {/* İlerleme göstergesi */}
               <div className="flex items-center justify-center gap-2 mb-6">
                    <div className={`size-2.5 rounded-full transition-all ${step >= 1 ? 'bg-[#C5A059]' : 'bg-gray-600'}`} />
                    <div className={`w-8 h-0.5 transition-all ${step >= 2 ? 'bg-[#C5A059]' : 'bg-gray-600'}`} />
                    <div className={`size-2.5 rounded-full transition-all ${step >= 2 ? 'bg-[#C5A059]' : 'bg-gray-600'}`} />
               </div>

               <TestAccountButton
                    onFill={(data) => {
                         setFormData(prev => ({ ...prev, ...data }))
                         // Eğer tüm veriler doluysa step 2'ye geçilebilir (kullanıcıya bırakıyoruz)
                    }}
                    type="register"
               />

               <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Mesaj */}
                    {message.text && (
                         <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'error'
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

                    {/* Step 1: Temel Bilgiler */}
                    {step === 1 && (
                         <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-5"
                         >
                              {/* E-posta */}
                              <AuthInput
                                   label="E-posta"
                                   type="email"
                                   name="email"
                                   value={formData.email}
                                   onChange={handleChange}
                                   placeholder="ornek@email.com"
                                   icon="mail"
                                   error={errors.email}
                                   required
                                   autoComplete="email"
                              />

                              {/* Şifre */}
                              <AuthInput
                                   label="Şifre"
                                   type="password"
                                   name="password"
                                   value={formData.password}
                                   onChange={handleChange}
                                   placeholder="En az 8 karakter"
                                   icon="lock"
                                   error={errors.password}
                                   required
                                   autoComplete="new-password"
                              />

                              {/* Şifre Tekrar */}
                              <AuthInput
                                   label="Şifre Tekrar"
                                   type="password"
                                   name="confirmPassword"
                                   value={formData.confirmPassword}
                                   onChange={handleChange}
                                   placeholder="Şifrenizi tekrar girin"
                                   icon="lock"
                                   error={errors.confirmPassword}
                                   required
                                   autoComplete="new-password"
                              />

                              {/* İleri Butonu */}
                              <motion.button
                                   type="button"
                                   onClick={handleNextStep}
                                   whileHover={{ scale: 1.01 }}
                                   whileTap={{ scale: 0.99 }}
                                   className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2D5A27] to-[#3d7a37] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#2D5A27]/20 hover:shadow-[#2D5A27]/40 transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                   <span>Devam Et</span>
                                   <span className="material-symbols-outlined text-lg">arrow_forward</span>
                              </motion.button>

                              {/* Ayraç */}
                              <div className="flex items-center gap-4">
                                   <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
                                   <span className="text-xs text-gray-500 uppercase tracking-wider">veya</span>
                                   <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
                              </div>

                              {/* Google Butonu */}
                              <GoogleButton
                                   onClick={handleGoogleSignIn}
                                   loading={googleLoading}
                                   text="Google ile Kayıt Ol"
                              />
                         </motion.div>
                    )}

                    {/* Step 2: Profil Bilgileri */}
                    {step === 2 && (
                         <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-5"
                         >
                              {/* Ad Soyad */}
                              <AuthInput
                                   label="Ad Soyad"
                                   type="text"
                                   name="fullName"
                                   value={formData.fullName}
                                   onChange={handleChange}
                                   placeholder="Adınız Soyadınız"
                                   icon="person"
                                   error={errors.fullName}
                                   required
                                   autoComplete="name"
                              />

                              {/* Kullanıcı Adı */}
                              <div className="relative">
                                   <AuthInput
                                        label="Kullanıcı Adı"
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="kullanici_adi"
                                        icon="alternate_email"
                                        error={errors.username}
                                        required
                                        autoComplete="username"
                                   />
                                   {/* Username durumu */}
                                   {formData.username.length >= 3 && (
                                        <div className="absolute right-4 top-9 flex items-center">
                                             {usernameChecking ? (
                                                  <div className="size-4 border-2 border-gray-500 border-t-[#C5A059] rounded-full animate-spin" />
                                             ) : usernameAvailable === true ? (
                                                  <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                             ) : usernameAvailable === false ? (
                                                  <span className="material-symbols-outlined text-red-500 text-lg">cancel</span>
                                             ) : null}
                                        </div>
                                   )}
                              </div>

                              {/* Telefon */}
                              <AuthInput
                                   label="Telefon"
                                   type="tel"
                                   name="phone"
                                   value={formData.phone}
                                   onChange={handleChange}
                                   placeholder="+90 5XX XXX XX XX"
                                   icon="phone"
                                   error={errors.phone}
                                   required
                                   autoComplete="tel"
                              />

                              {/* Butonlar */}
                              <div className="flex gap-3">
                                   <motion.button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="flex-1 py-3.5 rounded-xl border border-gray-600 text-gray-300 font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
                                   >
                                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                                        <span>Geri</span>
                                   </motion.button>

                                   <motion.button
                                        type="submit"
                                        disabled={loading || usernameChecking}
                                        whileHover={{ scale: loading ? 1 : 1.01 }}
                                        whileTap={{ scale: loading ? 1 : 0.99 }}
                                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#2D5A27] to-[#3d7a37] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#2D5A27]/20 hover:shadow-[#2D5A27]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                   >
                                        {loading ? (
                                             <>
                                                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                  <span>Kaydediliyor...</span>
                                             </>
                                        ) : (
                                             <>
                                                  <span>Kayıt Ol</span>
                                                  <span className="material-symbols-outlined text-lg">how_to_reg</span>
                                             </>
                                        )}
                                   </motion.button>
                              </div>
                         </motion.div>
                    )}

                    {/* Login Linki */}
                    <p className="text-center text-sm text-gray-400">
                         Zaten hesabınız var mı?{' '}
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

export default Register
