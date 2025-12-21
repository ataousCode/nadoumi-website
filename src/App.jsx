import Navbar from './component/common/Navbar.jsx'
import Footer from './component/common/Footer.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import ScrollToTop from './component/common/ScrollToTop.jsx'
import Services from './pages/services/Services.jsx'
import ImportExportPage from './pages/services/ImportExportPage.jsx'
import StudentAdmissionPage from './pages/services/StudentAdmissionPage.jsx'
import TranslationPage from './pages/services/TranslationPage.jsx'
import Login from './pages/Login.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import Categories from './pages/admin/Categories.jsx'
import ApplicationsInbox from './pages/admin/ApplicationsInbox.jsx'
import ApplicationDetailPage from './pages/admin/ApplicationDetailPage.jsx'
import AdminScholarships from './pages/admin/Scholarships.jsx'
import Universities from './pages/admin/Universities.jsx'
import Students from './pages/admin/Students.jsx'
import Settings from './pages/admin/Settings.jsx'
import ProtectedRoute from './component/admin/ProtectedRoute.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastContainer from './component/common/ToastContainer.jsx'
import WhatsAppFloat from './component/common/WhatsAppFloat.jsx'
import WeChatFloat from './component/common/WeChatFloat.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Scholarships from './pages/Scholarships.jsx'
import ScholarshipDetail from './pages/ScholarshipDetail.jsx'
import UniversityDetail from './pages/UniversityDetail.jsx'
import ApplyScholarship from './pages/student/ApplyScholarship.jsx'
import StudentRegister from './pages/student/StudentRegister.jsx'
import VerifyEmail from './pages/student/VerifyEmail.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import MyApplications from './pages/student/MyApplications.jsx'
import ApplicationDetail from './pages/student/ApplicationDetail.jsx'
import StudentProfile from './pages/student/StudentProfile.jsx'
import ForgotPassword from './pages/student/ForgotPassword.jsx'
import ResetPassword from './pages/student/ResetPassword.jsx'
import StudentProtectedRoute from './component/student/StudentProtectedRoute.jsx'
import NotFound from './pages/NotFound.jsx'

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
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
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
          <Route path="/services/student-admission" element={<StudentAdmissionPage />} />
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
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <Categories />
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