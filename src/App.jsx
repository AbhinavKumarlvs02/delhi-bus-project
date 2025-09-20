import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // Import ThemeProvider
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";

function App() {
  return (
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/driver" 
                element={
                  <ProtectedRoute requiredRole="driver">
                    <DriverDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/passenger" 
                element={
                  <ProtectedRoute requiredRole="passenger">
                    <PassengerDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
