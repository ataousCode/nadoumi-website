import Navbar from './component/common/Navbar.jsx'
import Footer from './component/common/Footer.jsx'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import ScrollToTop from './component/common/ScrollToTop.jsx'
import Services from './pages/services/Services.jsx'
import ImportExportPage from './pages/services/ImportExportPage.jsx'
import StudentAdmissionPage from './pages/services/StudentAdmissionPage.jsx'
import ApplicationFormPage from './pages/services/ApplicationFormPage.jsx'
import TranslationPage from './pages/services/TranslationPage.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import Categories from './pages/admin/Categories.jsx'
import ApplicationsInbox from './pages/admin/ApplicationsInbox.jsx'
import ApplicationDetailPage from './pages/admin/ApplicationDetailPage.jsx'
import ProtectedRoute from './component/admin/ProtectedRoute.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastContainer from './component/common/ToastContainer.jsx'
import WhatsAppFloat from './component/common/WhatsAppFloat.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white font-sans text-black">
        <header>
          <Navbar />
        </header>
        <main className="flex-1 pt-14">
          {/* Scroll to top on route changes */}
          <ScrollToTop />
          <ToastContainer />
          <WhatsAppFloat />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/import-export" element={<ImportExportPage />} />
          <Route path="/services/student-admission" element={<StudentAdmissionPage />} />
          <Route path="/services/translation" element={<TranslationPage />} />
          <Route path="/services/apply" element={<ApplicationFormPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute fallback={<AdminLogin />}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute fallback={<AdminLogin />}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute fallback={<AdminLogin />}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute fallback={<AdminLogin />}>
                <ApplicationsInbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications/:id"
            element={
              <ProtectedRoute fallback={<AdminLogin />}>
                <ApplicationDetailPage />
              </ProtectedRoute>
            }
          />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </ToastProvider>
  )
}

export default App