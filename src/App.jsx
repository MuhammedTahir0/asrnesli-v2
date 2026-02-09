import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import AuthGuard from './components/auth/AuthGuard'
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

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'

function App() {
     return (
          <AuthProvider>
               <Router>
                    <Toaster
                         position="top-center"
                         toastOptions={{
                              duration: 3000,
                              style: {
                                   background: '#1a1c1a',
                                   color: '#fff',
                                   border: '1px solid rgba(197, 160, 89, 0.2)',
                                   fontSize: '14px',
                                   padding: '12px 24px',
                                   borderRadius: '16px',
                                   fontFamily: 'Outfit, sans-serif'
                              },
                         }}
                    />
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
                                             <Route path="/categories/reader" element={<ContentReader />} />
                                             <Route path="/profile" element={<Profile />} />
                                             <Route path="/favorites" element={<Favorites />} />
                                        </Routes>
                                   </Layout>
                              </AuthGuard>
                         } />
                    </Routes>
               </Router>
          </AuthProvider>
     )
}

export default App
