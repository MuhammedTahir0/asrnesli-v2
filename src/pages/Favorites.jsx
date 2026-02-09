import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getFavorites, toggleFavorite } from '../services/favoriteService'
import { toast } from 'react-hot-toast'

const Favorites = () => {
     const navigate = useNavigate()
     const { user } = useAuth()
     const [favorites, setFavorites] = useState([])
     const [loading, setLoading] = useState(true)
     const [activeTab, setActiveTab] = useState('all')

     useEffect(() => {
          const fetchFavorites = async () => {
               if (user) {
                    const { data, error } = await getFavorites(user.id)
                    if (error) {
                         toast.error('Favoriler yüklenirken bir hata oluştu.')
                    } else {
                         setFavorites(data || [])
                    }
               }
               setLoading(false)
          }
          fetchFavorites()
     }, [user])

     const tabs = [
          { id: 'all', name: 'Tümü', icon: 'apps' },
          { id: 'Esma-ül Hüsna', name: 'Esmaül Hüsna', icon: 'auto_awesome' },
          { id: 'Dualar ve Zikirler', name: 'Dualar', icon: 'prayer_times' },
          { id: 'Hadis Koleksiyonu', name: 'Hadisler', icon: 'menu_book' },
          { id: 'Kur\'an-ı Kerim', name: 'Ayetler', icon: 'menu_book' },
     ]

     const filteredFavorites = activeTab === 'all'
          ? favorites
          : favorites.filter(f => f.content_type === activeTab)

     const handleRemove = async (e, fav) => {
          e.stopPropagation()
          const { action, error } = await toggleFavorite(user.id, {
               content_id: fav.content_id,
               content_type: fav.content_type
          })

          if (error) {
               toast.error('Bir hata oluştu.')
          } else {
               setFavorites(prev => prev.filter(f => f.id !== fav.id))
               toast.success('Favorilerden çıkarıldı.')
          }
     }

     if (loading) {
          return (
               <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold" />
               </div>
          )
     }

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               {/* Header */}
               <header className="px-6 pt-8 pb-4 shrink-0">
                    <div className="flex items-center gap-4 mb-6">
                         <button
                              onClick={() => navigate(-1)}
                              className="size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary"
                         >
                              <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <h1 className="text-2xl font-bold text-primary dark:text-white">Favorilerim</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                         {tabs.map(tab => (
                              <button
                                   key={tab.id}
                                   onClick={() => setActiveTab(tab.id)}
                                   className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all text-xs font-bold uppercase tracking-wider border ${activeTab === tab.id
                                             ? 'bg-accent-gold border-accent-gold text-white shadow-lg shadow-accent-gold/20'
                                             : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-text-secondary'
                                        }`}
                              >
                                   <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                   {tab.name}
                              </button>
                         ))}
                    </div>
               </header>

               {/* Content list */}
               <main className="px-6 flex-1">
                    <AnimatePresence mode="popLayout">
                         {filteredFavorites.length > 0 ? (
                              <div className="grid grid-cols-1 gap-4 mt-4">
                                   {filteredFavorites.map((fav, idx) => (
                                        <motion.div
                                             key={fav.id}
                                             layout
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             exit={{ opacity: 0, scale: 0.9 }}
                                             transition={{ delay: idx * 0.05 }}
                                             onClick={() => navigate('/categories/reader', {
                                                  state: {
                                                       id: fav.content_id,
                                                       title: fav.meta_data.title,
                                                       subtitle: fav.content_type,
                                                       content: fav.meta_data.content,
                                                       arabic: fav.meta_data.arabic,
                                                       source: fav.meta_data.source
                                                  }
                                             })}
                                             className="p-5 rounded-3xl bg-white dark:bg-[#1a1c1a] border border-gray-100 dark:border-white/5 flex items-center justify-between group cursor-pointer hover:border-accent-gold/30 transition-all shadow-sm"
                                        >
                                             <div className="flex-1 pr-4">
                                                  <div className="flex items-center gap-3 mb-1">
                                                       <span className="px-2 py-0.5 rounded-md bg-accent-gold/10 text-accent-gold text-[9px] font-black uppercase tracking-widest">
                                                            {fav.content_type}
                                                       </span>
                                                       <h4 className="font-bold text-base text-primary dark:text-white line-clamp-1 group-hover:text-accent-gold transition-colors">
                                                            {fav.meta_data.title}
                                                       </h4>
                                                  </div>
                                                  <p className="text-xs text-text-secondary dark:text-gray-400 line-clamp-1">
                                                       {fav.meta_data.content}
                                                  </p>
                                             </div>
                                             <button
                                                  onClick={(e) => handleRemove(e, fav)}
                                                  className="size-10 rounded-xl bg-red-500/5 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                             >
                                                  <span className="material-symbols-outlined text-xl">delete</span>
                                             </button>
                                        </motion.div>
                                   ))}
                              </div>
                         ) : (
                              <div className="flex flex-col items-center justify-center py-20 text-center">
                                   <div className="size-20 rounded-full bg-accent-gold/5 flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-4xl text-accent-gold opacity-20">bookmark</span>
                                   </div>
                                   <h3 className="text-lg font-bold text-primary dark:text-white mb-2">Henüz favori yok</h3>
                                   <p className="text-sm text-text-secondary dark:text-gray-400 max-w-[240px]">
                                        Beğendiğiniz içerikleri kaydederek burada görüntüleyebilirsiniz.
                                   </p>
                              </div>
                         )}
                    </AnimatePresence>
               </main>
          </div>
     )
}

export default Favorites
