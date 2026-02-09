import { supabase } from '../lib/supabaseClient'

/**
 * Kullanıcının favorilerini getirir
 * @param {string} userId
 */
export const getFavorites = async (userId) => {
     try {
          const { data, error } = await supabase
               .from('user_favorites')
               .select('*')
               .eq('user_id', userId)
               .order('created_at', { ascending: false })

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          console.error('getFavorites error:', error)
          return { data: null, error }
     }
}

/**
 * Favori ekler veya çıkarır (toggle)
 * @param {string} userId
 * @param {object} item { content_id, content_type, meta_data }
 */
export const toggleFavorite = async (userId, item) => {
     try {
          // Önce var mı diye kontrol et
          const { data: existing, error: checkError } = await supabase
               .from('user_favorites')
               .select('id')
               .eq('user_id', userId)
               .eq('content_id', item.content_id)
               .eq('content_type', item.content_type)
               .maybeSingle()

          if (checkError) throw checkError

          if (existing) {
               // Varsa sil (unfavorite)
               const { error: deleteError } = await supabase
                    .from('user_favorites')
                    .delete()
                    .eq('id', existing.id)

               if (deleteError) throw deleteError
               return { action: 'removed', error: null }
          } else {
               // Yoksa ekle (favorite)
               const { error: insertError } = await supabase
                    .from('user_favorites')
                    .insert([{
                         user_id: userId,
                         content_id: item.content_id,
                         content_type: item.content_type,
                         meta_data: item.meta_data || {}
                    }])

               if (insertError) throw insertError
               return { action: 'added', error: null }
          }
     } catch (error) {
          console.error('toggleFavorite error:', error)
          return { action: null, error }
     }
}

/**
 * Belirli bir içeriğin favori durumunu kontrol eder
 */
export const isFavorite = async (userId, contentId, contentType) => {
     try {
          if (!userId) return false
          const { data, error } = await supabase
               .from('user_favorites')
               .select('id')
               .eq('user_id', userId)
               .eq('content_id', contentId)
               .eq('content_type', contentType)
               .maybeSingle()

          if (error) throw error
          return !!data
     } catch (error) {
          console.error('isFavorite error:', error)
          return false
     }
}
