// AsrNesli Auth Context
// Uygulama genelinde kimlik doğrulama durumu yönetimi

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getProfile, upsertProfile } from '../services/authService'

const AuthContext = createContext({})

export const useAuth = () => {
     const context = useContext(AuthContext)
     if (!context) {
          throw new Error('useAuth hook must be used within AuthProvider')
     }
     return context
}

export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null)
     const [profile, setProfile] = useState(null)
     const [session, setSession] = useState(null)
     const [loading, setLoading] = useState(true)
     const [initialized, setInitialized] = useState(false)

     // Profil bilgisini yükle
     const loadProfile = async (userId, currentUser = null) => {
          if (!userId) {
               setProfile(null)
               return
          }

          const { data, error } = await getProfile(userId)

          // Profil varsa state'i güncelle
          if (!error && data) {
               setProfile(data)
          }
          // Profil yoksa ve user (metadata) varsa, profili oluştur (Google Login)
          else if (currentUser) {
               console.log('Profil bulunamadı, Google bilgilerinden oluşturuluyor...')

               const { full_name, avatar_url, email } = currentUser.user_metadata || {}

               // Username oluştur (email'den)
               const baseUsername = email ? email.split('@')[0] : 'user'
               const randomSuffix = Math.floor(Math.random() * 1000)
               const username = `${baseUsername}${randomSuffix}`

               const newProfile = {
                    full_name: full_name || '',
                    avatar_url: avatar_url || '',
                    username: username,
                    email: currentUser.email
               }

               const { data: createdProfile, error: createError } = await upsertProfile(userId, newProfile)

               if (!createError && createdProfile) {
                    setProfile(createdProfile)
                    console.log('Profil başarıyla oluşturuldu:', createdProfile)
               } else {
                    console.error('Profil oluşturulamadı:', createError)
               }
          }
     }

     // Oturum durumunu dinle
     useEffect(() => {
          // İlk oturum kontrolü
          const initializeAuth = async () => {
               try {
                    const { data: { session: currentSession } } = await supabase.auth.getSession()

                    setSession(currentSession)
                    setUser(currentSession?.user ?? null)

                    if (currentSession?.user) {
                         // User objesini de gönderiyoruz ki profil yoksa oluşturabilsin
                         await loadProfile(currentSession.user.id, currentSession.user)
                    }
               } catch (error) {
                    console.error('Auth initialization error:', error)
               } finally {
                    setLoading(false)
                    setInitialized(true)
               }
          }

          initializeAuth()

          // Auth değişikliklerini dinle
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
               async (event, currentSession) => {
                    setSession(currentSession)
                    setUser(currentSession?.user ?? null)

                    if (event === 'SIGNED_IN' && currentSession?.user) {
                         // User objesini de gönderiyoruz
                         await loadProfile(currentSession.user.id, currentSession.user)
                    } else if (event === 'SIGNED_OUT') {
                         setProfile(null)
                    }

                    setLoading(false)
               }
          )

          return () => {
               subscription?.unsubscribe()
          }
     }, [])

     // Profili yenile
     const refreshProfile = async () => {
          if (user?.id) {
               await loadProfile(user.id)
          }
     }

     const value = {
          user,
          profile,
          session,
          loading,
          initialized,
          isAuthenticated: !!user,
          refreshProfile
     }

     return (
          <AuthContext.Provider value={value}>
               {children}
          </AuthContext.Provider>
     )
}

export default AuthContext
