import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p>© 2025 AgriLink. Connecting you to the freshest local farms.</p>
        <div className={styles.footerLinks}>
          <a href="#privacy" className={styles.footerLink} aria-label="Read privacy policy">Privacy</a>
          <a href="#terms" className={styles.footerLink} aria-label="Review terms of service">Terms</a>
          <a href="#contact" className={styles.footerLink} aria-label="Contact AgriLink">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
