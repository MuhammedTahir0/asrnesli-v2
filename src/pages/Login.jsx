// AsrNesli Login Page
// İslami-Lüks tasarımlı giriş sayfası

import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import GoogleButton from '../components/auth/GoogleButton'
import TestAccountButton from '../components/auth/TestAccountButton'
import { signInWithEmail, signInWithGoogle } from '../services/authService'

const Login = () => {
     const navigate = useNavigate()
     const location = useLocation()
     const from = location.state?.from?.pathname || '/'

     const [formData, setFormData] = useState({
          email: '',
          password: '',
          rememberMe: false
     })
     const [errors, setErrors] = useState({})
     const [loading, setLoading] = useState(false)
     const [googleLoading, setGoogleLoading] = useState(false)
     const [message, setMessage] = useState({ type: '', text: '' })

     const handleChange = (e) => {
          const { name, value, type, checked } = e.target
          setFormData(prev => ({
               ...prev,
               [name]: type === 'checkbox' ? checked : value
          }))
          // Hata temizle
          if (errors[name]) {
               setErrors(prev => ({ ...prev, [name]: '' }))
          }
     }

     const validate = () => {
          const newErrors = {}

          if (!formData.email) {
               newErrors.email = 'E-posta adresi gerekli'
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
               newErrors.email = 'Geçerli bir e-posta adresi girin'
          }

          if (!formData.password) {
               newErrors.password = 'Şifre gerekli'
          }

          setErrors(newErrors)
          return Object.keys(newErrors).length === 0
     }

     const handleSubmit = async (e) => {
          e.preventDefault()
          setMessage({ type: '', text: '' })

          if (!validate()) return

          setLoading(true)

          const { data, error } = await signInWithEmail({
               email: formData.email,
               password: formData.password,
               rememberMe: formData.rememberMe
          })

          setLoading(false)

          if (error) {
               console.error('HATA DETAYI:', error);
               let errorMessage = error.message || 'Giriş yapılamadı.';

               if (error.message?.includes('Invalid login')) {
                    errorMessage = 'E-posta veya şifre hatalı.'
               } else if (error.message?.includes('Email not confirmed')) {
                    errorMessage = 'E-posta adresinizi doğrulamanız gerekiyor.'
               }

               setMessage({ type: 'error', text: errorMessage })
               return
          }

          // Başarılı giriş
          navigate(from, { replace: true })
     }

     const handleGoogleSignIn = async () => {
          setGoogleLoading(true)
          setMessage({ type: '', text: '' })

          const { error } = await signInWithGoogle()

          if (error) {
               setGoogleLoading(false)
               setMessage({ type: 'error', text: 'Google ile giriş yapılamadı.' })
          }
          // Google OAuth redirect yapacak, loading devam edecek
     }

     const handleFill = (data) => {
          setFormData(prev => ({
               ...prev,
               ...data
          }))
     }

     return (
          <AuthLayout
               title="Hoş Geldiniz"
               subtitle="Hesabınıza giriş yapın"
          >
               <TestAccountButton onFill={handleFill} type="login" />

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
                         placeholder="••••••••"
                         icon="lock"
                         error={errors.password}
                         required
                         autoComplete="current-password"
                    />

                    {/* Beni Hatırla & Şifremi Unuttum */}
                    <div className="flex items-center justify-between">
                         <label className="flex items-center gap-2 cursor-pointer group">
                              <div className="relative">
                                   <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                   />
                                   <div className="size-5 rounded border border-[#2D5A27]/50 bg-[#1a2a1a] peer-checked:bg-[#2D5A27] peer-checked:border-[#C5A059]/50 transition-all flex items-center justify-center">
                                        {formData.rememberMe && (
                                             <span className="material-symbols-outlined text-white text-sm">check</span>
                                        )}
                                   </div>
                              </div>
                              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                   Beni Hatırla
                              </span>
                         </label>

                         <Link
                              to="/forgot-password"
                              className="text-sm text-[#C5A059] hover:text-[#E8D5A3] transition-colors"
                         >
                              Şifremi Unuttum
                         </Link>
                    </div>

                    {/* Giriş Butonu */}
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
                                   <span>Giriş yapılıyor...</span>
                              </>
                         ) : (
                              <>
                                   <span>Giriş Yap</span>
                                   <span className="material-symbols-outlined text-lg">login</span>
                              </>
                         )}
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
                    />

                    {/* Kayıt Linki */}
                    <p className="text-center text-sm text-gray-400">
                         Hesabınız yok mu?{' '}
                         <Link
                              to="/register"
                              className="text-[#C5A059] hover:text-[#E8D5A3] font-medium transition-colors"
                         >
                              Kayıt Ol
                         </Link>
                    </p>
               </form>
          </AuthLayout>
     )
}

export default Login
