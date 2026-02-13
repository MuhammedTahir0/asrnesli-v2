// AsrNesli Auth Context - Stabilized Version
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getProfile, upsertProfile, signOut as signOutService } from '../services/authService'
import { syncService } from '../services/syncService'

const AuthContext = createContext({})

export const useAuth = () => {
     const context = useContext(AuthContext)
     if (!context) throw new Error('useAuth must be used within AuthProvider')
     return context
}

export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null)
     const [profile, setProfile] = useState(null)
     const [session, setSession] = useState(null)
     const [loading, setLoading] = useState(true)
     const [initialized, setInitialized] = useState(false)
     const [logoutLoading, setLogoutLoading] = useState(false)

     const loadProfile = async (userId, currentUser = null) => {
          if (!userId) return setProfile(null)
          try {
               const { data, error } = await getProfile(userId)
               if (!error && data) {
                    setProfile(data)
               } else if (currentUser) {
                    const { full_name, avatar_url, email } = currentUser.user_metadata || {}
                    const username = `${email?.split('@')[0]}${Math.floor(Math.random() * 1000)}`
                    const { data: created } = await upsertProfile(userId, {
                         full_name: full_name || '',
                         avatar_url: avatar_url || '',
                         username,
                         email: currentUser.email
                    })
                    if (created) setProfile(created)
               }
          } catch (err) {
               console.error('loadProfile error:', err)
          }
     }

     // KRİTİK DÜZELTME: Bloklamayan Logout
     const logout = async () => {
          setLogoutLoading(true)

          // 1. Önce local state'leri temizle (UI anında tepki vermeli)
          setUser(null)
          setProfile(null)
          setSession(null)

          // 2. Storage'ı manuel temizle (Supabase'in takılma ihtimaline karşı)
          try {
               localStorage.clear()
               sessionStorage.clear()
          } catch (e) {
               console.warn('Storage temizleme hatası:', e)
          }

          // 3. Supabase signOut işlemini arka planda çalıştır (AWAIT ETMİYORUZ)
          signOutService().catch(err => console.error('Background SignOut error:', err))

          setLogoutLoading(false)
          return true
     }

     useEffect(() => {
          let mounted = true

          const init = async () => {
               try {
                    const { data: { session: s } } = await supabase.auth.getSession()
                    if (!mounted) return
                    if (s?.user) {
                         setSession(s)
                         setUser(s.user)
                         await loadProfile(s.user.id, s.user)

                         // Offline kuyruğu işle
                         syncService.processQueue(s.user.id)
                    }
               } finally {

                    if (mounted) {
                         setLoading(false)
                         setInitialized(true)
                    }
               }
          }

          init()

          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
               if (!mounted) return

               if (s?.user) {
                    setSession(s)
                    setUser(s.user)
                    if (event === 'SIGNED_IN') loadProfile(s.user.id, s.user)
               } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setProfile(null)
                    setSession(null)
               }

               setLoading(false)
               setInitialized(true)
          })

          return () => {
               mounted = false
               subscription?.unsubscribe()
          }
     }, [])

     const value = {
          user, profile, session, loading, initialized,
          isAuthenticated: !!user,
          logoutLoading, logout,
          refreshProfile: () => user?.id && loadProfile(user.id),
          setProfile
     }

     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
