import { supabase } from '../lib/supabaseClient'

/**
 * Esma-ül Hüsna listesini getirir
 * display_order'a göre sıralar
 */
export const getEsmaulHusna = async () => {
     try {
          const { data, error } = await supabase
               .from('names_of_allah')
               .select('*')
               .order('display_order', { ascending: true })

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          console.error('getEsmaulHusna error:', error)
          return { data: null, error }
     }
}

/**
 * Tek bir ismin detayını getirir
 */
export const getEsmaDetail = async (id) => {
     try {
          const { data, error } = await supabase
               .from('names_of_allah')
               .select('*')
               .eq('id', id)
               .single()

          if (error) throw error
          return { data, error: null }
     } catch (error) {
          console.error('getEsmaDetail error:', error)
          return { data: null, error }
     }
}
