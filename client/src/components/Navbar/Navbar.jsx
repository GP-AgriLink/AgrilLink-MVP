import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  return (
    <header className={styles.navbar}>
      {/* Logo Area */}
      <Link to="/" className={styles.logoArea}>
        <span className={styles.iconContainer}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 3.75c5.25.75 9 5.25 9.75 9.75.75-4.5 4.5-9 9.75-9.75-.75 5.25-3.75 9-9.75 11.25 2.25 1.5 5.25 3.75 6 6-4.5-1.5-7.5-3.75-9-6-1.5 2.25-4.5 4.5-9 6 .75-2.25 3.75-4.5 6-6C8.25 12.75 5.25 9 4.5 3.75Z"></path>
          </svg>
        </span>
        <span className={styles.textContainer}>
          <span className={styles.brandLine1}>AgriLink</span>
          <span className={styles.brandLine2}>Fresh Produce, Nearby</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className={styles.navLinks}>
        <Link to="/" className={`${styles.navLink} ${styles.activeLink} ${styles.discover}`}>
          Discover
        </Link>
        <Link to="/about" className={`${styles.navLink} ${styles.about}`}>
          About
        </Link>
        <Link to="/contact-us" className={`${styles.navLink} ${styles.contactUs}`}>
          Contact Us
        </Link>
      </nav>

      {/* User Actions Area */}
      <div className={styles.userActions}>
        <div className={styles.authButtons}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M20 21a8 8 0 0 0-16 0"></path>
        </svg>
        <Link to="/login" className={styles.loginButton}>
          Login
        </Link>
        <span>/</span>
        <Link to="/register" className={styles.registerButton}>
          Sign Up
          </Link></div>
        <Link to="/for-farmers" className={styles.ctaButton}>
          For Farmers
        </Link>
        <Link to="/cart" className={styles.cartButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <span className={styles.notificationBadge}>0</span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
