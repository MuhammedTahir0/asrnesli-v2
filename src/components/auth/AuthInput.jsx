// AsrNesli Custom Auth Input
// İslami-Lüks tasarımlı input bileşeni

import React, { useState } from 'react'
import { motion } from 'framer-motion'

const AuthInput = ({
     label,
     type = 'text',
     name,
     value,
     onChange,
     placeholder,
     icon,
     error,
     required = false,
     autoComplete,
     disabled = false
}) => {
     const [isFocused, setIsFocused] = useState(false)
     const [showPassword, setShowPassword] = useState(false)

     const isPassword = type === 'password'
     const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

     return (
          <div className="space-y-1.5">
               {/* Label */}
               {label && (
                    <label
                         htmlFor={name}
                         className="block text-sm font-medium text-gray-300"
                    >
                         {label}
                         {required && <span className="text-[#C5A059] ml-1">*</span>}
                    </label>
               )}

               {/* Input Container */}
               <div className="relative">
                    {/* Glow efekti */}
                    <motion.div
                         className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059]/30 to-[#C5A059]/0"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: isFocused ? 1 : 0 }}
                         transition={{ duration: 0.2 }}
                    />

                    {/* Input wrapper */}
                    <div
                         className={`relative flex items-center bg-[#1a2a1a] rounded-xl border transition-all duration-300 ${error
                                   ? 'border-red-500/50'
                                   : isFocused
                                        ? 'border-[#C5A059]/50'
                                        : 'border-[#2D5A27]/30 hover:border-[#2D5A27]/50'
                              }`}
                    >
                         {/* Sol ikon */}
                         {icon && (
                              <span className="pl-4 text-gray-500">
                                   <span className="material-symbols-outlined text-xl">{icon}</span>
                              </span>
                         )}

                         {/* Input */}
                         <input
                              id={name}
                              name={name}
                              type={inputType}
                              value={value}
                              onChange={onChange}
                              onFocus={() => setIsFocused(true)}
                              onBlur={() => setIsFocused(false)}
                              placeholder={placeholder}
                              required={required}
                              autoComplete={autoComplete}
                              disabled={disabled}
                              className={`flex-1 bg-transparent px-4 py-3.5 text-white placeholder-gray-500 outline-none text-sm ${icon ? 'pl-2' : ''
                                   } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                         />

                         {/* Şifre göster/gizle butonu */}
                         {isPassword && (
                              <button
                                   type="button"
                                   onClick={() => setShowPassword(!showPassword)}
                                   className="pr-4 text-gray-500 hover:text-[#C5A059] transition-colors"
                              >
                                   <span className="material-symbols-outlined text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                   </span>
                              </button>
                         )}
                    </div>
               </div>

               {/* Hata mesajı */}
               {error && (
                    <motion.p
                         initial={{ opacity: 0, y: -5 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="text-xs text-red-400 flex items-center gap-1"
                    >
                         <span className="material-symbols-outlined text-sm">error</span>
                         {error}
                    </motion.p>
               )}
          </div>
     )
}

export default AuthInput
