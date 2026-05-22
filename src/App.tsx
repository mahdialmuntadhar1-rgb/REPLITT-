import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { useAuthStore } from './store/authStore';
import { Loader2 } from 'lucide-react';
import { AdminRoute } from './components/auth/AdminRoute';
import { BuildModeEditor } from './components/BuildModeEditor/BuildModeEditor';
import { EditModeToggle } from './components/BuildModeEditor/EditModeToggle';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { isInitialized } = useAuthStore();
  useAuth(); // Initialize auth listener

  if (!isInitialized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F7F7F5]">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <h1 className="text-xl font-black text-primary tracking-tight uppercase">SHAKU MAKU</h1>
        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mt-1">Initializing Platform...</p>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="bottom-right" reverseOrder={false} />
      <EditModeToggle />
      <Routes>
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="*" 
          element={
            <div className="bg-[#F7F7F5]">
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/feed" element={<Home />} />
                  <Route path="/directory" element={<Home />} />
                </Routes>
              </Layout>
              {/* Build Mode is global for admins */}
              <BuildModeEditor />
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}





