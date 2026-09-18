import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import OTPPage from './pages/auth/OTPPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import PlatformAnalyticsPage from './pages/officer/PlatformAnalyticsPage';
import ScanProductPage from './pages/officer/ScanProductPage';
import ReportGenerationPage from './pages/officer/ReportGenerationPage';
import HelpPage from './pages/common/HelpPage';
import DownloadExtensionPage from './pages/common/DownloadExtensionPage';

import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/auth/otp" element={<OTPPage />} />

            {/* Dashboard Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Officer Routes with Persistent Layout */}
            <Route element={<DashboardLayout role="officer" />}>
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/officer/platform-analytics" element={<PlatformAnalyticsPage />} />
              <Route path="/officer/scan-product" element={<ScanProductPage />} />
              <Route path="/officer/violations" element={<ReportGenerationPage />} />
              <Route path="/officer/download-extension" element={<DownloadExtensionPage />} />
              <Route path="/download-extension" element={<DownloadExtensionPage />} />
              <Route path="/officer/help" element={<HelpPage />} />
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
