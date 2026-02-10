import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoShareSocial } from 'react-icons/io5';
import {
     FaWhatsapp,
     FaInstagram,
     FaTelegram,
     FaTiktok,
     FaTwitter,
     FaFacebook,
     FaDownload
} from 'react-icons/fa';

const PreviewModal = ({ isOpen, onClose, image, onShare, isProcessing, text }) => {
     if (!isOpen) return null;

     const platforms = [
          { id: 'whatsapp', icon: FaWhatsapp, color: 'bg-[#25D366]', label: 'WhatsApp' },
          { id: 'instagram', icon: FaInstagram, color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', label: 'Instagram' },
          { id: 'tiktok', icon: FaTiktok, color: 'bg-black', label: 'TikTok' },
          { id: 'telegram', icon: FaTelegram, color: 'bg-[#0088cc]', label: 'Telegram' },
          { id: 'twitter', icon: FaTwitter, color: 'bg-[#1DA1F2]', label: 'X / Twitter' },
          { id: 'facebook', icon: FaFacebook, color: 'bg-[#1877F2]', label: 'Facebook' },
          { id: 'download', icon: FaDownload, color: 'bg-gray-600', label: 'İndir' },
     ];

     return (
          <AnimatePresence>
               <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                    onClick={onClose}
               >
                    {/* Close Button */}
                    <motion.button
                         initial={{ y: -20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110]"
                         onClick={onClose}
                    >
                         <IoClose size={28} />
                    </motion.button>

                    {/* Main Content Area */}
                    <div
                         className="relative w-full max-w-4xl flex-1 flex flex-col items-center justify-center gap-8 mb-4 overflow-hidden"
                         onClick={(e) => e.stopPropagation()}
                    >
                         {/* Image Preview Container */}
                         <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="relative max-h-[70vh] w-auto shadow-2xl rounded-lg overflow-hidden border border-white/10"
                         >
                              {image ? (
                                   <img
                                        src={image}
                                        alt="Önizleme"
                                        className="max-h-[70vh] w-auto object-contain"
                                   />
                              ) : (
                                   <div className="size-64 flex flex-col items-center justify-center text-white/40 gap-4">
                                        <div className="size-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        <p className="text-sm font-medium">Görsel Hazırlanıyor...</p>
                                   </div>
                              )}
                         </motion.div>

                         {/* Sharing Section */}
                         <motion.div
                              initial={{ y: 40, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6"
                         >
                              <div className="flex items-center gap-2 mb-4">
                                   <IoShareSocial className="text-primary" />
                                   <h3 className="text-white font-bold text-sm uppercase tracking-widest">Paylaş ve Yayınla</h3>
                              </div>

                              <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
                                   {platforms.map((platform) => (
                                        <button
                                             key={platform.id}
                                             disabled={isProcessing}
                                             onClick={() => onShare(platform.id)}
                                             className="flex flex-col items-center gap-2 group min-w-[70px]"
                                        >
                                             <div className={`size-12 rounded-2xl ${platform.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                                  <platform.icon size={22} />
                                             </div>
                                             <span className="text-[10px] text-white/60 font-medium group-hover:text-white transition-colors">
                                                  {platform.label}
                                             </span>
                                        </button>
                                   ))}
                              </div>
                         </motion.div>
                    </div>

                    {/* Footer Info */}
                    <motion.p
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.4 }}
                         className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-4"
                    >
                         Asr Nesli • Premium Paylaşım Stüdyosu
                    </motion.p>
               </motion.div>
          </AnimatePresence>
     );
};

export default PreviewModal;
