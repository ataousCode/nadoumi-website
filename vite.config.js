import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Raise the chunk warning threshold to 600kb (default 500kb)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: React runtime — cached separately, never changes
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Admin bundle: only loaded when an admin visits
          'admin': [
            './src/pages/admin/Dashboard.jsx',
            './src/pages/admin/ApplicationsInbox.jsx',
            './src/pages/admin/ApplicationDetailPage.jsx',
            './src/pages/admin/Scholarships.jsx',
            './src/pages/admin/Universities.jsx',
            './src/pages/admin/Students.jsx',
            './src/pages/admin/Settings.jsx',
          ],
          // Student bundle: only loaded when a student logs in
          'student': [
            './src/pages/student/StudentDashboard.jsx',
            './src/pages/student/MyApplications.jsx',
            './src/pages/student/ApplicationDetail.jsx',
            './src/pages/student/StudentProfile.jsx',
            './src/pages/student/ApplyScholarship.jsx',
          ],
        },
      },
    },
  },
});
