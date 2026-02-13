import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { grantToken, trackAdEvent } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';


const AdReward = ({ onClose, onSuccess }) => {
     const navigate = useNavigate();
     const { profile, setProfile } = useAuth();
     const [countdown, setCountdown] = useState(5);
     const [canSkip, setCanSkip] = useState(false);
     const [isProcessing, setIsProcessing] = useState(false);

     useEffect(() => {
          trackAdEvent('impression');
     }, []);

     useEffect(() => {
          let timer;
          if (countdown > 0) {
               timer = setTimeout(() => setCountdown(countdown - 1), 1000);
          } else {
               setCanSkip(true);
          }
          return () => clearTimeout(timer);
     }, [countdown]);

     const handleExit = () => {
          if (onClose) {
               onClose();
          } else {
               navigate(-1);
          }
     };

     const handleReward = async () => {
          if (isProcessing) return;
          setIsProcessing(true);

          try {
               // If external handler provided, use it
               if (onSuccess) {
                    await onSuccess();
                    handleExit();
                    return;
               }

               const { data, error } = await grantToken(1);
               if (error) throw error;

               // Update local profile tokens
               const nextTokens = (data && typeof data.tokens === 'number') ? data.tokens : (profile?.tokens || 0) + 1;
               setProfile(prev => ({ ...prev, tokens: nextTokens }));

               // Track reward
               await trackAdEvent('reward');

               toast.success('Tebrikler! 1 Token kazandınız.', {
                    icon: '🪙',
                    style: {
                         borderRadius: '12px',
                         background: '#2D5A27',
                         color: '#fff',
                    },
               });

               // Return to previous page or close modal
               handleExit();
          } catch (err) {
               console.error('Reward error:', err);
               toast.error('Token eklenirken bir hata oluştu.');
          } finally {
               setIsProcessing(false);
          }
     };

     return (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 sm:p-12">
               {/* Background Decor */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-green/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C5A059]/10 rounded-full blur-[120px]" />
               </div>

               <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-md bg-[#1a1a1a] rounded-[32px] p-8 border border-white/5 shadow-2xl text-center overflow-hidden"
               >
                    {/* Decorative Pattern */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-green/50 to-transparent" />

                    <div className="mb-8">
                         <div className="w-20 h-20 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-green/20">
                              <span className="material-symbols-outlined text-4xl text-accent-green animate-bounce">
                                   database
                              </span>
                         </div>
                         <h2 className="text-2xl font-black text-white mb-2">Hediye Token Kazan</h2>
                         <p className="text-white/50 text-sm">Reklamı tamamla ve tasarımın için 1 token kazan.</p>
                    </div>

                    {/* Video Placeholder Area */}
                    <div className="aspect-video w-full bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center justify-center mb-8 relative group overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                         <span className="material-symbols-outlined text-6xl text-white/10 group-hover:scale-110 transition-transform duration-500">
                              play_circle
                         </span>
                         <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Reklam Alanı</p>

                         {/* Fake progress bar */}
                         <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                   initial={{ width: 0 }}
                                   animate={{ width: '100%' }}
                                   transition={{ duration: 5, ease: "linear" }}
                                   className="h-full bg-accent-green"
                              />
                         </div>
                    </div>

                    <div className="space-y-4">
                         <AnimatePresence mode="wait">
                              {!canSkip ? (
                                   <motion.div
                                        key="wait"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 text-sm font-bold flex items-center justify-center gap-3"
                                   >
                                        <span className="w-5 h-5 border-2 border-accent-green/30 border-t-accent-green rounded-full animate-spin" />
                                        <span>Reklamı geçmek için bekle: {countdown}s</span>
                                   </motion.div>
                              ) : (
                                   <motion.button
                                        key="skip"
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleReward}
                                        disabled={isProcessing}
                                        className="w-full py-4 rounded-2xl bg-accent-green text-[#0a1f0a] font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(74,222,128,0.2)] hover:shadow-[0_0_40px_rgba(74,222,128,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                   >
                                        {isProcessing ? (
                                             <span className="w-5 h-5 border-2 border-[#0a1f0a]/30 border-t-[#0a1f0a] rounded-full animate-spin" />
                                        ) : (
                                             <>
                                                  <span className="material-symbols-outlined">double_arrow</span>
                                                  REKLAMI GEÇ VE KAZAN
                                             </>
                                        )}
                                   </motion.button>
                              )}
                         </AnimatePresence>

                         <button
                              onClick={() => {
                                   trackAdEvent('skip');
                                   handleExit();
                              }}
                              className="text-white/20 hover:text-white/40 text-[10px] font-bold uppercase tracking-widest transition-colors"
                              disabled={isProcessing}
                         >
                              Vazgeç ve Kapat
                         </button>
                    </div>
               </motion.div>
          </div>
     );
};

export default AdReward;
