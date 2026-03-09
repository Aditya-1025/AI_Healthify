import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SymptomProvider } from './context/SymptomContext';
import { AppointmentsProvider } from './context/AppointmentsContext';
import { AIUIProvider } from './context/AIUIContext';
import { NotificationProvider } from './context/NotificationContext';
import { DoctorNotificationProvider } from './context/DoctorNotificationContext';
import { UserProfileProvider } from './context/UserProfileContext';

/* ── Shared pages ── */
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

/* ── Doctor portal ── */
import DoctorLayout from './portals/doctor/DoctorLayout';
import DoctorDashboard from './portals/doctor/pages/Dashboard';
import Patients from './portals/doctor/pages/Patients';
import PatientDetails from './portals/doctor/pages/PatientDetails';
import Appointments from './portals/doctor/pages/Appointments';
import DoctorPrescriptions from './portals/doctor/pages/Prescriptions';
import PrescriptionDetails from './portals/doctor/pages/PrescriptionDetails';
import DoctorNotifications from './portals/doctor/pages/DoctorNotifications';
import DoctorProfile from './portals/doctor/pages/DoctorProfile';

/* ── Patient portal ── */
import PatientLayout from './portals/patient/PatientLayout';
import PatientDashboard from './portals/patient/pages/PatientDashboard';
import SymptomChecker from './portals/patient/pages/SymptomChecker';
import MyAppointments from './portals/patient/pages/MyAppointments';
import Medications from './portals/patient/pages/Medications';
import Prescriptions from './portals/patient/pages/Prescriptions';
import HealthTrends from './portals/patient/pages/HealthTrends';
import Notifications from './portals/patient/pages/Notifications';
import PatientProfile from './portals/patient/pages/PatientProfile';


import './App.css';

/* ── Global floating AI assistant ── */
import FloatingAI from './components/ai/FloatingAI';

function App() {
  return (
    <AuthProvider>
      <SymptomProvider>
        <AppointmentsProvider>
          <NotificationProvider>
            <DoctorNotificationProvider>
              <UserProfileProvider>
                <AIUIProvider>
                  <Router>
                    <Routes>
                      {/* ── Landing (no sidebar) ── */}
                      <Route path="/" element={<Home />} />

                      {/* ── Auth ── */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />

                      {/* ── Doctor Portal ── */}
                      <Route path="/doctor" element={<DoctorLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DoctorDashboard />} />
                        <Route path="patients" element={<Patients />} />
                        <Route path="patients/:id" element={<PatientDetails />} />
                        <Route path="appointments" element={<Appointments />} />
                        <Route path="prescriptions" element={<DoctorPrescriptions />} />
                        <Route path="prescriptions/:id" element={<PrescriptionDetails />} />
                        <Route path="notifications" element={<DoctorNotifications />} />
                        <Route path="profile" element={<DoctorProfile />} />
                      </Route>

                      {/* ── Patient Portal ── */}
                      <Route path="/patient" element={<PatientLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<PatientDashboard />} />
                        <Route path="symptom-checker" element={<SymptomChecker />} />
                        <Route path="my-appointments" element={<MyAppointments />} />
                        <Route path="prescriptions" element={<Prescriptions />} />
                        <Route path="medications" element={<Medications />} />
                        <Route path="health-trends" element={<HealthTrends />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="profile" element={<PatientProfile />} />
                      </Route>

                      {/* ── Catch-all ── */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <FloatingAI />
                  </Router>
                </AIUIProvider>
              </UserProfileProvider>
            </DoctorNotificationProvider>
          </NotificationProvider>
        </AppointmentsProvider>
      </SymptomProvider>
    </AuthProvider>
  );
}

export default App;
