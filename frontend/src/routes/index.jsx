import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/LandingPage';
import ComplaintSubmission from '../pages/ComplaintSubmission';
import ComplaintTracking from '../pages/ComplaintTracking';
import AdminDashboard from '../pages/AdminDashboard';
import AIMonitoring from '../pages/AIMonitoring';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<ComplaintSubmission />} />
        <Route path="/track" element={<ComplaintTracking />} />
      </Route>

      {/* Admin / Dashboard Pages */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ai-monitoring" element={<AIMonitoring />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
