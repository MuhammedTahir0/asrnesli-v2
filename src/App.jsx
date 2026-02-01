import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './components/Home'
import Categories from './components/Categories'
import ShareStudio from './components/ShareStudio'
import AdminPanel from './components/AdminPanel'
import PrayerTimes from './components/PrayerTimes'
import QiblaFinder from './components/QiblaFinder'
import QuranDetail from './components/details/QuranDetail'
import HadithDetail from './components/details/HadithDetail'
import FiqhDetail from './components/details/FiqhDetail'
import EsmaDetail from './components/details/EsmaDetail'
import PrayerDetail from './components/details/PrayerDetail'
import HajjDetail from './components/details/HajjDetail'
import ContentReader from './components/details/ContentReader'

// Geçici boş sayfalar (Hala geliştirilmekte olanlar için)
const Placeholder = ({ title }) => (
     <div className="flex-1 flex items-center justify-center p-8 text-center bg-background-light dark:bg-background-dark">
          <div className="space-y-4">
               <div className="size-16 mx-auto rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green">
                    <span className="material-symbols-outlined text-[32px]">construction</span>
               </div>
               <h2 className="text-xl font-bold">{title} Yakında Burada</h2>
               <p className="text-text-secondary text-sm">Bu sayfa şu an geliştirme aşamasındadır.</p>
          </div>
     </div>
)

function App() {
     return (
          <Router>
               <Layout>
                    <Routes>
                         <Route path="/" element={<Home />} />
                         <Route path="/categories" element={<Categories />} />
                         <Route path="/share" element={<ShareStudio />} />
                         <Route path="/admin" element={<AdminPanel />} />
                         <Route path="/prayer" element={<PrayerTimes />} />
                         <Route path="/qibla" element={<QiblaFinder />} />
                         <Route path="/categories/quran" element={<QuranDetail />} />
                         <Route path="/categories/hadith" element={<HadithDetail />} />
                         <Route path="/categories/fiqh" element={<FiqhDetail />} />
                         <Route path="/categories/esma" element={<EsmaDetail />} />
                         <Route path="/categories/prayers" element={<PrayerDetail />} />
                         <Route path="/categories/hajj" element={<HajjDetail />} />
                         <Route path="/profile" element={<Placeholder title="Profil" />} />
                    </Routes>
               </Layout>
          </Router>
     )
}

export default App
