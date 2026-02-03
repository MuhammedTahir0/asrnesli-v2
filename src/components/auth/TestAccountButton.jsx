// Development Helper: Test Hesabı Doldurucu
// Sadece geliştirme ortamında görünür

import React from 'react'
import { motion } from 'framer-motion'

const TestAccountButton = ({ onFill, type = 'login' }) => {
     // Sadece geliştirme modunda göster (prodüksiyonda gizli)
     if (!import.meta.env.DEV) return null

     const testUser = {
          email: 'test@asrnesli.com',
          password: 'password123',
          fullName: 'Test Kullanıcısı',
          username: 'test_user_' + Math.floor(Math.random() * 1000),
          phone: '5551234567'
     }

     const handleFill = () => {
          if (type === 'login') {
               onFill({
                    email: testUser.email,
                    password: testUser.password
               })
          } else {
               onFill({
                    email: testUser.email,
                    password: testUser.password,
                    confirmPassword: testUser.password,
                    fullName: testUser.fullName,
                    username: testUser.username,
                    phone: testUser.phone
               })
          }
     }

     return (
          <motion.button
               onClick={handleFill}
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-red-600/90 text-white p-3 rounded-l-xl shadow-xl border-l-4 border-white/20 backdrop-blur-sm group hover:pr-6 transition-all"
               title="Test Verilerini Doldur"
          >
               <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">bug_report</span>
                    <span className="text-xs font-bold w-0 overflow-hidden group-hover:w-auto transition-all whitespace-nowrap">
                         Test Verisi
                    </span>
               </div>
          </motion.button>
     )
}

export default TestAccountButton
