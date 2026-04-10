import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./context/ToastContext.jsx";
import Navbar from "./components/common/Navbar/index.jsx";
import Footer from "./components/common/Footer.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import ToastContainer from "./components/common/ToastContainer.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

import Home from "./pages/Home.jsx";
import Scholarships from "./pages/Scholarships.jsx";
import Application from "./pages/Application.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Universities from "./pages/Universities.jsx";
import UniversityProfile from "./pages/UniversityProfile.jsx";
import Programs from "./pages/Programs.jsx";
import ScholarshipProfile from "./pages/ScholarshipProfile.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

// Educational Guides
import CityGuides from "./pages/Guides/CityGuides.jsx";
import ApplicationGuide from "./pages/Guides/ApplicationGuide.jsx";
import VisaInfo from "./pages/Guides/VisaInfo.jsx";
import LivingInChina from "./pages/Guides/LivingInChina.jsx";
import FAQ from "./pages/Guides/FAQ.jsx";

import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Student/Profile.jsx";
import ApplicationsPage from "./pages/Student/ApplicationsPage.jsx";
import MessagesPage from "./pages/Student/MessagesPage.jsx";
import FloatingContactButton from "./components/common/FloatingContactButton.jsx";

// Admin Portal
import AdminProtect from "./components/common/AdminProtect.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminProfile from "./pages/Admin/Profile.jsx";
import AdminMessagesPage from "./pages/Admin/MessagesPage.jsx";
import AdminApplicationsList from "./pages/Admin/ApplicationsList.jsx";
import AdminApplicationDetail from "./pages/Admin/ApplicationDetail.jsx";
import AdminUniversitiesList from "./pages/Admin/UniversitiesList.jsx";
import NewUniversity from "./pages/Admin/NewUniversity.jsx";
import EditUniversity from "./pages/Admin/EditUniversity.jsx";
import AdminScholarshipsList from "./pages/Admin/ScholarshipsList.jsx";
import NewScholarship from "./pages/Admin/NewScholarship.jsx";
import EditScholarship from "./pages/Admin/EditScholarship.jsx";

function PageLoader() {
  return <div className="min-h-screen bg-white" aria-hidden="true" />;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/login", "/forgot-password", "/reset-password", "/admin/login"].includes(
    location.pathname,
  );
  const isStudentPortal = [
    "/profile",
    "/applications",
    "/messages",
  ].includes(location.pathname);

  const isAdminPortal = location.pathname.startsWith("/admin");

  const showGlobalElements = !isAuthPage && !isStudentPortal && !isAdminPortal;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 font-sans text-black">
      {showGlobalElements && (
        <header>
          <Navbar />
        </header>
      )}
      <main className="flex-1">
        <ScrollToTop />
        <ToastContainer />
        {showGlobalElements && (
          <>
            <FloatingContactButton type="wechat" />
            <FloatingContactButton type="whatsapp" />
          </>
        )}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/scholarships/:id" element={<ScholarshipProfile />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/universities/:id" element={<UniversityProfile />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/application" element={<Application />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Educational Guides */}
            <Route path="/guides/city-guides" element={<CityGuides />} />
            <Route path="/guides/application-guide" element={<ApplicationGuide />} />
            <Route path="/guides/visa-info" element={<VisaInfo />} />
            <Route path="/guides/living-in-china" element={<LivingInChina />} />
            <Route path="/guides/faq" element={<FAQ />} />
            
            {/* Admin Login (Hidden) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Student Portal Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/messages" element={<MessagesPage />} />

            {/* Admin Portal Routes */}
            <Route 
              path="/admin/*" 
              element={
                <AdminProtect>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="profile" element={<AdminProfile />} />
                      <Route path="applications" element={<AdminApplicationsList />} />
                      <Route path="applications/:id" element={<AdminApplicationDetail />} />
                      <Route path="universities" element={<AdminUniversitiesList />} />
                      <Route path="universities/new" element={<NewUniversity />} />
                      <Route path="universities/:id" element={<EditUniversity />} />
                      <Route path="scholarships" element={<AdminScholarshipsList />} />
                      <Route path="scholarships/new" element={<NewScholarship />} />
                      <Route path="scholarships/:id" element={<EditScholarship />} />
                      <Route path="users" element={<div>User Management (Coming Soon)</div>} />
                      <Route path="messages" element={<AdminMessagesPage />} />
                    </Routes>
                  </AdminLayout>
                </AdminProtect>
              } 
            />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </Suspense>
      </main>
      {showGlobalElements && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
}

import LocaleProvider from "./i18n/LocaleProvider.jsx";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

export default App;