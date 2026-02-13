import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import AuthGuard from './components/auth/AuthGuard'
import Layout from './components/layout/Layout'

// Eagerly loaded (ana sayfa hızlı açılsın)
import Home from './components/Home'

// Lazy loaded pages
const Categories = lazy(() => import('./components/Categories'))
const ShareStudio = lazy(() => import('./components/ShareStudio'))
const AdminPanel = lazy(() => import('./components/AdminPanel'))
const PrayerTimes = lazy(() => import('./components/PrayerTimes'))
const QiblaFinder = lazy(() => import('./components/QiblaFinder'))
const QuranDetail = lazy(() => import('./components/details/QuranDetail'))
const HadithDetail = lazy(() => import('./components/details/HadithDetail'))
const FiqhDetail = lazy(() => import('./components/details/FiqhDetail'))
const EsmaDetail = lazy(() => import('./components/details/EsmaDetail'))
const PrayerDetail = lazy(() => import('./components/details/PrayerDetail'))
const HajjDetail = lazy(() => import('./components/details/HajjDetail'))
const ContentReader = lazy(() => import('./components/details/ContentReader'))
const QuranReader = lazy(() => import('./components/details/QuranReader'))
const Settings = lazy(() => import('./components/Settings'))

// Auth Pages (lazy)
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const Favorites = lazy(() => import('./pages/Favorites'))
const AdReward = lazy(() => import('./pages/AdReward'))

import { SpeedInsights } from "@vercel/speed-insights/react"

// Loading fallback
const PageLoader = () => (
     <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          color: 'var(--color-gold, #c5a059)'
     }}>
          <div style={{
               width: 36,
               height: 36,
               border: '3px solid rgba(197, 160, 89, 0.2)',
               borderTop: '3px solid var(--color-gold, #c5a059)',
               borderRadius: '50%',
               animation: 'spin 0.8s linear infinite'
          }} />
     </div>
)

function App() {
     return (
          <AuthProvider>
               <SpeedInsights />
               <Router>
                    <Toaster
                         position="top-center"
                         toastOptions={{
                              duration: 3000,
                              style: {
                                   background: 'var(--color-background-dark)',
                                   color: 'var(--color-surface-light)',
                                   border: '1px solid rgba(197, 160, 89, 0.2)',
                                   fontSize: '14px',
                                   padding: '12px 24px',
                                   borderRadius: '16px',
                                   fontFamily: 'Outfit, sans-serif'
                              },
                         }}
                    />
                    <Suspense fallback={<PageLoader />}>
                         <Routes>
                              {/* Auth Sayfaları - Layout olmadan, giriş yapmamış kullanıcılar için */}
                              <Route path="/login" element={
                                   <AuthGuard requireAuth={false}>
                                        <Login />
                                   </AuthGuard>
                              } />
                              <Route path="/register" element={
                                   <AuthGuard requireAuth={false}>
                                        <Register />
                                   </AuthGuard>
                              } />
                              <Route path="/forgot-password" element={
                                   <AuthGuard requireAuth={false}>
                                        <ForgotPassword />
                                   </AuthGuard>
                              } />
                              <Route path="/reset-password" element={
                                   <AuthGuard requireAuth={false}>
                                        <ResetPassword />
                                   </AuthGuard>
                              } />

                              {/* Korumalı Sayfalar - Auth gerekli */}
                              <Route path="/*" element={
                                   <AuthGuard requireAuth={true}>
                                        <Layout>
                                             <Suspense fallback={<PageLoader />}>
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
                                                        <Route path="/categories/quran-reader" element={<QuranReader />} />
                                                        <Route path="/categories/reader" element={<ContentReader />} />
                                                       <Route path="/profile" element={<Profile />} />
                                                       <Route path="/favorites" element={<Favorites />} />
                                                       <Route path="/ad-reward" element={<AdReward />} />
                                                       <Route path="/settings" element={<Settings />} />
                                                  </Routes>
                                             </Suspense>
                                        </Layout>
                                   </AuthGuard>
                              } />
                         </Routes>
                    </Suspense>
               </Router>
          </AuthProvider>
     )
}

export default App
