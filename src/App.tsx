import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Stats } from './components/Stats';
import { Sustainability } from './components/Sustainability';
import { Clients } from './components/Clients';
import { Export } from './components/Export';
import { Newsletter } from './components/Newsletter';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

import { Shop } from './components/Shop';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { initialize, loading, isAdmin } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        {/* Landing page (composed sections) */}
        <Route
          path="/"
          element={
            <div className="min-h-screen">
              <Header />
              <main>
                <Hero />
                <About />
                <Stats />
                <Sustainability />
                <Clients />
                <Export />
                <Newsletter />
                <Contact />
              </main>
              <Footer />
            </div>
          }
        />
        {/* Individual pages for navigation */}
        <Route path="/about" element={<About />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/shop" element={<Shop isOpen={true} onClose={() => {}} />} />
        <Route path="/clients-partners" element={<Clients />} />
        <Route path="/export" element={<Export />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;