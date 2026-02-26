import React, { lazy, Suspense } from 'react'
import Navbar from './component/common/Navbar.jsx'
import Footer from './component/common/Footer.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import ScrollToTop from './component/common/ScrollToTop.jsx'
import ProtectedRoute from './component/admin/ProtectedRoute.jsx'
import StudentProtectedRoute from './component/student/StudentProtectedRoute.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastContainer from './component/common/ToastContainer.jsx'
import WhatsAppFloat from './component/common/WhatsAppFloat.jsx'
import WeChatFloat from './component/common/WeChatFloat.jsx'

// Public pages — loaded on first visit
const Home              = lazy(() => import('./pages/Home.jsx'))
const About             = lazy(() => import('./pages/About.jsx'))
const Contact           = lazy(() => import('./pages/Contact.jsx'))
const Scholarships      = lazy(() => import('./pages/Scholarships.jsx'))
const ScholarshipDetail = lazy(() => import('./pages/ScholarshipDetail.jsx'))
const UniversityDetail  = lazy(() => import('./pages/UniversityDetail.jsx'))
const Services          = lazy(() => import('./pages/services/Services.jsx'))
const ImportExportPage  = lazy(() => import('./pages/services/ImportExportPage.jsx'))
const TranslationPage   = lazy(() => import('./pages/services/TranslationPage.jsx'))
const NotFound          = lazy(() => import('./pages/NotFound.jsx'))

// Auth pages
const Login             = lazy(() => import('./pages/Login.jsx'))
const AdminLogin        = lazy(() => import('./pages/admin/AdminLogin.jsx'))

// Student pages — loaded only when student navigates there
const StudentRegister   = lazy(() => import('./pages/student/StudentRegister.jsx'))
const VerifyEmail       = lazy(() => import('./pages/student/VerifyEmail.jsx'))
const ForgotPassword    = lazy(() => import('./pages/student/ForgotPassword.jsx'))
const ResetPassword     = lazy(() => import('./pages/student/ResetPassword.jsx'))
const ApplyScholarship  = lazy(() => import('./pages/student/ApplyScholarship.jsx'))
const StudentDashboard  = lazy(() => import('./pages/student/StudentDashboard.jsx'))
const MyApplications    = lazy(() => import('./pages/student/MyApplications.jsx'))
const ApplicationDetail = lazy(() => import('./pages/student/ApplicationDetail.jsx'))
const StudentProfile    = lazy(() => import('./pages/student/StudentProfile.jsx'))

// Admin pages — loaded only when admin navigates there
const Dashboard            = lazy(() => import('./pages/admin/Dashboard.jsx'))
const ApplicationsInbox    = lazy(() => import('./pages/admin/ApplicationsInbox.jsx'))
const ApplicationDetailPage = lazy(() => import('./pages/admin/ApplicationDetailPage.jsx'))
const AdminScholarships    = lazy(() => import('./pages/admin/Scholarships.jsx'))
const Universities         = lazy(() => import('./pages/admin/Universities.jsx'))
const Students             = lazy(() => import('./pages/admin/Students.jsx'))
const Settings             = lazy(() => import('./pages/admin/Settings.jsx'))

// Minimal fallback — invisible spinner to avoid layout shift
function PageLoader() {
  return <div className="min-h-screen bg-white" aria-hidden="true" />
}

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
        {!isAdminRoute && (
          <header>
            <Navbar />
          </header>
        )}
        <main className={isAdminRoute ? "flex-1" : "flex-1 pt-14"}>
          {/* Scroll to top on route changes */}
          <ScrollToTop />
          <ToastContainer />
          {!isAdminRoute && (
            <>
              <WeChatFloat />
              <WhatsAppFloat />
            </>
          )}
          <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
          <Route path="/universities/:id" element={<UniversityDetail />} />
          
          {/* Authentication Routes (Public) */}
          <Route path="/login" element={<Login />} />
          <Route path="/student/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/verify-email" element={<VerifyEmail />} />
          <Route path="/student/forgot-password" element={<ForgotPassword />} />
          <Route path="/student/reset-password" element={<ResetPassword />} />
          
          {/* Student Protected Routes */}
          <Route
            path="/scholarships/:id/apply"
            element={
              <StudentProtectedRoute>
                <ApplyScholarship />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <StudentProtectedRoute>
                <StudentDashboard />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <StudentProtectedRoute>
                <MyApplications />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/student/applications/:id"
            element={
              <StudentProtectedRoute>
                <ApplicationDetail />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <StudentProtectedRoute>
                <StudentProfile />
              </StudentProtectedRoute>
            }
          />
          
          <Route path="/services" element={<Services />} />
          <Route path="/services/import-export" element={<ImportExportPage />} />
          <Route path="/services/translation" element={<TranslationPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <ApplicationsInbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/scholarships"
            element={
              <ProtectedRoute>
                <AdminScholarships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/universities"
            element={
              <ProtectedRoute>
                <Universities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          </Suspense>
      </main>
      {!isAdminRoute && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App