import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { haptic } from '../../utils/haptic';
import { toast } from 'react-hot-toast';

/**
 * StoryCard: Dini Hikayeler için Premium Kart
 */
export const StoryCard = ({ story }) => {
     if (!story) return null;
     return (
          <motion.article
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="group relative rounded-[2.5rem] bg-surface-light dark:bg-surface-dark shadow-soft border border-accent-gold/20 overflow-hidden"
          >
               <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3">
                         <div className="size-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <span className="material-symbols-outlined">auto_stories</span>
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Günün Hikayesi</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary dark:text-accent-gold font-display leading-tight">
                         {story.title}
                    </h3>
                    <p className="text-text-secondary dark:text-gray-400 text-sm line-clamp-4 leading-relaxed font-serif italic">
                         {story.content}
                    </p>
                    <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                         <span className="text-[10px] font-bold text-gray-400 tracking-wider">Kaynak: {story.source}</span>
                         <button className="text-xs font-bold text-accent-gold uppercase tracking-widest hover:opacity-80 transition-opacity">
                              Tamamını Oku
                         </button>
                    </div>
               </div>
          </motion.article>
     );
};

/**
 * DuaCard: Dualar ve Zikirler için Kart
 */
export const DuaCard = ({ prayer }) => {
     if (!prayer) return null;
     return (
          <motion.article
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="relative rounded-[2.5rem] bg-gradient-to-br from-[#ee6c4d]/5 to-[#ee6c4d]/10 border border-[#ee6c4d]/20 p-8 shadow-soft"
          >
               <div className="absolute top-6 right-6 opacity-10">
                    <span className="material-symbols-outlined text-6xl text-[#ee6c4d]">front_hand</span>
               </div>
               <div className="space-y-6">
                    <div className="space-y-2">
                         <h4 className="text-xs font-bold text-[#ee6c4d] uppercase tracking-widest">{prayer.title}</h4>
                         <p className="text-3xl text-primary dark:text-accent-gold calligraphy leading-loose text-right" dir="rtl">
                              {prayer.content_ar}
                         </p>
                    </div>
                    <p className="text-lg font-medium text-primary dark:text-accent-gold/90 font-serif italic">
                         "{prayer.content_tr}"
                    </p>
               </div>
          </motion.article>
     );
};

/**
 * WisdomCard: Hikmethane / Özlü Sözler
 */
export const WisdomCard = ({ wisdom }) => {
     if (!wisdom) return null;
     return (
          <motion.article
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="p-10 rounded-[3rem] bg-white dark:bg-surface-dark border-2 border-dashed border-accent-gold/20 flex flex-col items-center text-center gap-6"
          >
               <span className="material-symbols-outlined text-accent-gold opacity-30 text-4xl">format_quote</span>
               <p className="text-xl md:text-2xl font-medium text-primary dark:text-accent-gold font-serif leading-relaxed italic">
                    {wisdom.content}
               </p>
               <div className="space-y-1">
                    <div className="h-px w-12 bg-accent-gold/30 mx-auto mb-2"></div>
                    <p className="text-xs font-bold text-accent-gold uppercase tracking-widest">{wisdom.author}</p>
               </div>
          </motion.article>
     );
};

/**
 * ChecklistCard: Günlük Amel Defteri (Mini)
 */
export const ChecklistCard = ({ tasks, completedIds = [], onToggle }) => {
     const [localCompleted, setLocalCompleted] = React.useState(completedIds);

     React.useEffect(() => {
          setLocalCompleted(completedIds);
     }, [completedIds]);

     const handleToggle = async (task) => {
          // Haptik geri bildirim
          haptic('medium');

          // İyimser güncelleme (Optimistic UI)
          const isCompleted = localCompleted.includes(task.id);
          const newCompleted = isCompleted
               ? localCompleted.filter(id => id !== task.id)
               : [...localCompleted, task.id];

          setLocalCompleted(newCompleted);

          if (onToggle) {
               await onToggle(task);
          }
     };

     const progressCount = tasks?.filter(t => localCompleted.includes(t.id)).length || 0;

     return (
          <div className="bg-[#0a9396]/5 dark:bg-[#0a9396]/10 rounded-[2.5rem] p-8 border border-[#0a9396]/20">
               <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                         <span className="material-symbols-outlined text-[#0a9396]">checklist</span>
                         <h4 className="text-sm font-bold text-[#0a9396] uppercase tracking-widest">Günün Amelleri</h4>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{progressCount} / {tasks?.length || 0} Tamamlandı</span>
               </div>
               <div className="space-y-3">
                    {tasks && tasks.length > 0 ? tasks.map((task, i) => {
                         const isDone = localCompleted.includes(task.id);
                         return (
                              <motion.button
                                   key={task.id}
                                   whileTap={{ scale: 0.98 }}
                                   onClick={() => handleToggle(task)}
                                   className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isDone
                                        ? 'bg-[#0a9396]/10 border-[#0a9396]/30 shadow-inner'
                                        : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 shadow-sm'
                                        }`}
                              >
                                   <div className="flex items-center gap-3">
                                        <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-[#0a9396] border-[#0a9396]' : 'border-gray-300 dark:border-white/20'
                                             }`}>
                                             {isDone && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                                        </div>
                                        <span className={`text-sm font-semibold transition-colors ${isDone ? 'text-[#0a9396] line-through opacity-70' : 'dark:text-accent-gold'
                                             }`}>
                                             {task.task_name}
                                        </span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold ${isDone ? 'text-[#0a9396]' : 'text-accent-gold'}`}>
                                             +{task.points} Puan
                                        </span>
                                   </div>
                              </motion.button>
                         );
                    }) : (
                         <div className="text-center py-4 text-gray-400 text-xs">Aktivite bulunamadı</div>
                    )}
               </div>
               <Link
                    to="/profile"
                    className="w-full mt-6 py-4 bg-[#0a9396] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#0a9396]/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
               >
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    Amel Defterine Git
               </Link>
          </div>
     );
};

/**
 * InfoCard: Dini Bilgiler ve Faydalı Notlar
 */
export const InfoCard = ({ info }) => {
     if (!info) return null;
     return (
          <motion.article
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-primary/5 dark:bg-white/5 rounded-[2.5rem] p-8 border-l-4 border-primary shadow-soft"
          >
               <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <h4 className="text-sm font-bold text-primary dark:text-accent-gold uppercase tracking-widest">{info.title}</h4>
               </div>
               <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed font-serif">
                    {info.content}
               </p>
               {info.tags && info.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                         {info.tags.map((tag, i) => (
                              <span key={i} className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary">#{tag}</span>
                         ))}
                    </div>
               )}
          </motion.article>
     );
};
