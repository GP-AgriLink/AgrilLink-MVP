import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import FarmerSignup from './pages/FarmerSignup'
import FarmerLogin from './pages/FarmerLogin'
import EditProfile from './pages/EditProfile';
import ForgotPasswordFlow from './pages/ForgotPasswordFlow';

function App() {
  return (
    <div className="app min-h-screen flex flex-col">
      <Navbar />
      <main className="main-content flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <h1>Discover Page</h1>
              <p>Welcome to AgriLink - Your connection to fresh local farms!</p>
            </>
          } />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact-us" element={<h1>Contact Us Page</h1>} />

          {/* Auth Routes */}
          <Route path="/login" element={<FarmerLogin />} />
          <Route path="/register" element={<FarmerSignup />} />
          <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="/for-farmers" element={<h1>For Farmers Page</h1>} />
          <Route path="/cart" element={<h1>Shopping Cart</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;