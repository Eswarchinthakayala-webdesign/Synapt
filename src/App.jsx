import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./layout/app-layout";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LiveStream } from "./pages/LiveStream";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StreamerDashboard from "./pages/StreamerDashboard";

// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
        );
    }
    
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user?.role)) return <Navigate to="/live" replace />;
    return children;
};

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="synapt-theme">
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/live" element={<LiveStream />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute roles={['streamer']}>
                                        <StreamerDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;