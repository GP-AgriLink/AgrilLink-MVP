import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import FarmerSignup from './pages/FarmRegister'
import FarmerLogin from './pages/FarmLogin'
import EditProfile from './pages/EditProfile';
import ForgotPasswordFlow from './pages/ForgotPasswordFlow';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <div className="app min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
        <Navbar />
        <main className="main-content w-5/6 mx-auto flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <div className="container mx-auto px-6 py-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to AgriLink
                  </h1>
                  <p className="text-lg text-gray-700 mb-8">
                    Your connection to fresh local farms!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
                        For Farmers
                      </h2>
                      <p className="text-gray-600 mb-4">
                        List your farm and connect with customers directly.
                      </p>
                      <a
                        href="/register"
                        className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
                      >
                        Get Started
                      </a>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
                        For Customers
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Discover and buy from local farms in your area.
                      </p>
                      <a
                        href="/discover"
                        className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
                      >
                        Browse Farms
                      </a>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/about" element={
              <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900">About Page</h1>
              </div>
            } />
            <Route path="/contact" element={
              <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900">Contact Page</h1>
              </div>
            } />

            {/* Auth Routes */}
            <Route path="/login" element={<FarmerLogin />} />
            <Route path="/register" element={<FarmerSignup />} />
            <Route path="/forgot-password" element={<ForgotPasswordFlow />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
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