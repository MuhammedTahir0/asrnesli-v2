// AsrNesli Settings Page
// Uygulama ayarlarını yönetme sayfası

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { haptic } from '../utils/haptic'
import { toast } from 'react-hot-toast'

const Settings = () => {
     const navigate = useNavigate()
     const { user } = useAuth()
     const [loading, setLoading] = useState(true)
     const [saving, setSaving] = useState(false)
     const [settings, setSettings] = useState({
          dashboard_visibility: {
               verse: true,
               hadith: true,
               ilmihal: true,
               names_of_allah: true,
               story: true,
               prayer: true,
               wisdom: true,
               checklist: true,
               religious_info: true
          }
     })

     useEffect(() => {
          fetchSettings()
     }, [user])

     const fetchSettings = async () => {
          if (!user) return
          try {
               const { data, error } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

               if (error && error.code !== 'PGRST116') throw error

               if (data) {
                    setSettings(prev => ({
                         dashboard_visibility: {
                              ...prev.dashboard_visibility,
                              ...(data.dashboard_visibility || {})
                         }
                    }))
               }
          } catch (error) {
               console.error('Settings fetch error:', error)
          } finally {
               setLoading(false)
          }
     }

     const toggleVisibility = async (key) => {
          haptic('light')

          setSettings(prev => {
               const newVisibility = {
                    ...prev.dashboard_visibility,
                    [key]: !prev.dashboard_visibility[key]
               }

               // Async save
               saveToSupabase(newVisibility)

               return {
                    ...prev,
                    dashboard_visibility: newVisibility
               }
          })
     }

     const saveToSupabase = async (newVisibility) => {
          if (!user) return
          try {
               const { error } = await supabase
                    .from('user_settings')
                    .upsert({
                         user_id: user.id,
                         dashboard_visibility: newVisibility,
                         updated_at: new Date().toISOString()
                    })

               if (error) throw error
          } catch (error) {
               console.error('Save error:', error)
               toast.error('Ayarlar kaydedilemedi')
          }
     }

     const sections = [
          { key: 'verse', label: 'Günün Ayeti', icon: 'menu_book' },
          { key: 'hadith', label: 'Günün Hadisi', icon: 'format_quote' },
          { key: 'ilmihal', label: 'İlmihal Rehberi', icon: 'help_center' },
          { key: 'names_of_allah', label: 'Esma-ül Hüsna', icon: 'hotel_class' },
          { key: 'story', label: 'Dini Hikayeler', icon: 'auto_stories' },
          { key: 'prayer', label: 'Dualar & Zikirler', icon: 'front_hand' },
          { key: 'wisdom', label: 'Hikmethane', icon: 'psychology_alt' },
          { key: 'checklist', label: 'Amel Defteri', icon: 'checklist' },
          { key: 'religious_info', label: 'Dini Bilgiler', icon: 'article' },
     ]

     if (loading) {
          return (
               <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                    <div className="size-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin" />
               </div>
          )
     }

     return (
          <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
               {/* Header */}
               <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-b border-black/5 dark:border-accent-gold/10">
                    <div className="flex items-center gap-4 p-4">
                         <button
                              onClick={() => {
                                   haptic('light')
                                   navigate(-1)
                              }}
                              className="size-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                         >
                              <span className="material-symbols-outlined text-primary dark:text-accent-gold">arrow_back</span>
                         </button>
                         <h1 className="text-2xl font-bold text-primary dark:text-accent-gold">Ayarlar</h1>
                    </div>
               </header>

               <div className="p-4 max-w-lg mx-auto space-y-8">
                    {/* Görünürlük Ayarları */}
                    <section>
                         <div className="flex items-center gap-2 mb-4 px-2">
                              <span className="material-symbols-outlined text-accent-gold">dashboard_customize</span>
                              <h2 className="text-lg font-bold text-primary dark:text-accent-gold">Ana Ekran Kartları</h2>
                         </div>
                         <p className="text-sm text-text-secondary dark:text-accent-gold/60 mb-6 px-2">
                              Ana sayfanızda hangi içeriklerin görünmesini istediğinizi seçin.
                         </p>

                         <div className="bg-surface-light dark:bg-surface-dark rounded-3xl border border-black/5 dark:border-accent-gold/20 overflow-hidden shadow-sm">
                              {sections.map((section, index) => (
                                   <div
                                        key={section.key}
                                        className={`flex items-center justify-between p-4 ${index !== sections.length - 1 ? 'border-b border-black/5 dark:border-accent-gold/10' : ''}`}
                                   >
                                        <div className="flex items-center gap-4">
                                             <div className="size-10 rounded-2xl bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                                                  <span className="material-symbols-outlined">{section.icon}</span>
                                             </div>
                                             <span className="font-bold text-primary dark:text-accent-gold/90">{section.label}</span>
                                        </div>

                                        <button
                                             onClick={() => toggleVisibility(section.key)}
                                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${settings.dashboard_visibility[section.key] ? 'bg-accent-gold' : 'bg-gray-300 dark:bg-white/10'}`}
                                        >
                                             <span
                                                  className={`inline-block size-4 transform rounded-full bg-white transition duration-200 ease-in-out ${settings.dashboard_visibility[section.key] ? 'translate-x-6' : 'translate-x-1'}`}
                                             />
                                        </button>
                                   </div>
                              ))}
                         </div>
                    </section>

                    {/* Bilgi Notu */}
                    <div className="p-4 rounded-2xl bg-accent-gold/5 border border-accent-gold/20 flex gap-4">
                         <span className="material-symbols-outlined text-accent-gold">info</span>
                         <p className="text-xs text-text-secondary dark:text-accent-gold/70 leading-relaxed">
                              Değişiklikleriniz anında kaydedilir ve ana ekranınıza yansıtılır. Bazı zorunlu bildirimler bu ayarlardan etkilenmez.
                         </p>
                    </div>
               </div>
          </div>
     )
}

export default Settings
