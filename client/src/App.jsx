import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <h1>Discover Page</h1>
              <p>Welcome to AgriLink - Your connection to fresh local farms!</p>
            </>
          } />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact-us" element={<h1>Contact Us Page</h1>} />
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route path="/register" element={<h1>Register Page</h1>} />
          <Route path="/for-farmers" element={<h1>For Farmers Page</h1>} />
          <Route path="/cart" element={<h1>Shopping Cart</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
