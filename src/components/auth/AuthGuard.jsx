// AsrNesli Auth Guard
// Korumalı rotalar için erişim kontrolü

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const AuthGuard = ({ children, requireAuth = true }) => {
     const { isAuthenticated, loading, initialized } = useAuth()
     const location = useLocation()

     // Auth henüz yüklenmedi
     if (!initialized || loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1a0a] via-[#0f2a0f] to-[#0a1a0a]">
                    <div className="text-center space-y-4">
                         <div className="size-12 mx-auto border-3 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
                         <p className="text-gray-400 text-sm">Oturum kontrol ediliyor...</p>
                    </div>
               </div>
          )
     }

     // Auth gerekli ama kullanıcı giriş yapmamış
     if (requireAuth && !isAuthenticated) {
          return <Navigate to="/login" state={{ from: location }} replace />
     }

     // Auth gerekli değil (login/register sayfaları) ama kullanıcı zaten giriş yapmış
     if (!requireAuth && isAuthenticated) {
          const from = location.state?.from?.pathname || '/'
          return <Navigate to={from} replace />
     }

     return children
}

export default AuthGuard
