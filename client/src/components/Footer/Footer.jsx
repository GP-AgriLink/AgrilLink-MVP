import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="font-['Inter'] bg-white/80 border-t border-emerald-100/70 rounded-t-2xl pt-4 pb-4 shadow-[0_-4px_16px_rgba(6,78,59,0.7)]">
      <div className="flex flex-wrap justify-between items-center gap-4 max-w-6xl mx-auto px-6 text-emerald-900/70 text-sm">
        <p>© 2025 AgriLink. Connecting you to the freshest local farms.</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="text-emerald-900/70 cursor-pointer transition-colors hover:text-emerald-900 no-underline" aria-label="Read privacy policy">Privacy</Link>
          <Link to="/terms" className="text-emerald-900/70 cursor-pointer transition-colors hover:text-emerald-900 no-underline" aria-label="Review terms of service">Terms</Link>
          <Link to="/contact" className="text-emerald-900/70 cursor-pointer transition-colors hover:text-emerald-900 no-underline" aria-label="Contact AgriLink">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
