// AsrNesli Authentication Service
// Supabase Auth işlemleri

import { supabase } from '../lib/supabaseClient'

/**
 * E-posta ve şifre ile kayıt ol
 */
export const signUpWithEmail = async ({ email, password, fullName, username, phone }) => {
     try {
          // 1. Kullanıcı oluştur
          const { data: authData, error: authError } = await supabase.auth.signUp({
               email,
               password,
               options: {
                    data: {
                         full_name: fullName,
                         username: username
                    }
               }
          })

          if (authError) throw authError

          // 2. Profil oluştur (eğer kullanıcı oluşturulduysa)
          if (authData.user) {
               const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                         id: authData.user.id,
                         full_name: fullName,
                         username: username,
                         phone: phone,
                         email: email,
                         tokens: 5
                    })

               if (profileError) {
                    console.error('Profil oluşturma hatası:', profileError)
               }
          }

          return { data: authData, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * E-posta ve şifre ile giriş yap
 */
export const signInWithEmail = async ({ email, password, rememberMe = false }) => {
     try {
          const { data, error } = await supabase.auth.signInWithPassword({
               email,
               password
          })

          if (error) throw error

          // "Beni Hatırla" için session süresini uzat (varsayılan zaten 7 gün)
          // Supabase bunu otomatik yönetir

          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * Google OAuth ile giriş
 */
export const signInWithGoogle = async () => {
     try {
          const { data, error } = await supabase.auth.signInWithOAuth({
               provider: 'google',
               options: {
                    redirectTo: `${window.location.origin}/`
               }
          })

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * Çıkış yap
 */
export const signOut = async () => {
     try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          return { error: null }
     } catch (error) {
          return { error }
     }
}

/**
 * Şifre sıfırlama e-postası gönder
 */
export const resetPassword = async (email) => {
     try {
          const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
               redirectTo: `${window.location.origin}/reset-password`
          })

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * Yeni şifre belirle
 */
export const updatePassword = async (newPassword) => {
     try {
          const { data, error } = await supabase.auth.updateUser({
               password: newPassword
          })

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * Mevcut oturum bilgisini al
 */
export const getCurrentSession = async () => {
     try {
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) throw error
          return { session, error: null }
     } catch (error) {
          return { session: null, error }
     }
}

/**
 * Mevcut kullanıcı bilgisini al
 */
export const getCurrentUser = async () => {
     try {
          const { data: { user }, error } = await supabase.auth.getUser()
          if (error) throw error
          return { user, error: null }
     } catch (error) {
          return { user: null, error }
     }
}

/**
 * Kullanıcı profilini getir
 */
export const getProfile = async (userId) => {
     try {
          const { data, error } = await supabase
               .from('profiles')
               .select('*')
               .eq('id', userId)
               .single()

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * Profil güncelle
 */
export const updateProfile = async (userId, updates) => {
     try {
          const { data, error } = await supabase
               .from('profiles')
               .update({
                    ...updates,
                    updated_at: new Date().toISOString()
               })
               .eq('id', userId)
               .select()
               .single()

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * Profil oluştur veya güncelle (Upsert)
 * Google girişi sonrası profil oluşturmak için kullanılır
 */
export const upsertProfile = async (userId, updates) => {
     try {
          const { data, error } = await supabase
               .from('profiles')
               .upsert({
                    id: userId,
                    ...updates,
                    updated_at: new Date().toISOString()
               })
               .select()
               .single()

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * Avatar yükle
 */
export const uploadAvatar = async (userId, file) => {
     try {
          const fileExt = file.name.split('.').pop()
          const fileName = `${userId}-${Date.now()}.${fileExt}`
          const filePath = `avatars/${fileName}`

          const { error: uploadError } = await supabase.storage
               .from('avatars')
               .upload(filePath, file, { upsert: true })

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
               .from('avatars')
               .getPublicUrl(filePath)

          // Profili güncelle
          await updateProfile(userId, { avatar_url: publicUrl })

          return { url: publicUrl, error: null }
     } catch (error) {
          return { url: null, error }
     }
}

/**
 * Username kontrolü
 */
export const checkUsernameAvailable = async (username) => {
     try {
          const { data, error } = await supabase
               .from('profiles')
               .select('username')
               .eq('username', username)
               .maybeSingle()

          if (error) throw error
          return { available: !data, error: null }
     } catch (error) {
          return { available: false, error }
     }
}

/**
 * Token tüket (RPC)
 */
export const consumeToken = async () => {
     try {
          const { data, error } = await supabase.rpc('consume_token')
          if (error) throw error
          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

/**
 * Token artır (RPC)
 */
export const grantToken = async (amount = 1) => {
     try {
          const { data, error } = await supabase.rpc('grant_token', { amount })
          if (error) throw error
          return { data, error: null }
     } catch (error) {
          return { data: null, error }
     }
}

export default {
     signUpWithEmail,
     signInWithEmail,
     signInWithGoogle,
     signOut,
     resetPassword,
     updatePassword,
     getCurrentSession,
     getCurrentUser,
     getProfile,
     updateProfile,
     upsertProfile,
     uploadAvatar,
     checkUsernameAvailable,
     consumeToken,
     grantToken
}
