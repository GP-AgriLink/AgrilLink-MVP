import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import FarmerSignup from './pages/FarmRegister'
import FarmerLogin from './pages/FarmLogin'
import EditProfile from './pages/EditProfile';
import ForgotPasswordFlow from './pages/ForgotPasswordFlow';

function App() {
  return (
    <AuthProvider>
      <div className="app min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
        <Navbar />
        <main className="main-content w-5/6 mx-auto flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <div className="container mx-auto px-6 py-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Page</h1>
                  <p className="text-lg text-gray-700">Welcome to AgriLink - Your connection to fresh local farms!</p>
                </div>
              </>
            } />
            <Route path="/about" element={
              <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900">About Page</h1>
              </div>
            } />
            <Route path="/contact-us" element={
              <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900">Contact Us Page</h1>
              </div>
            } />

            {/* Auth Routes */}
            <Route path="/login" element={<FarmerLogin />} />
            <Route path="/register" element={<FarmerSignup />} />
            <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
            
            {/* Protected Routes */}
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />

            <Route path="/for-farmers" element={
              <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900">For Farmers Page</h1>
              </div>
            } />
            <Route path="/cart" element={
              <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App;