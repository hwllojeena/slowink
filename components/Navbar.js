"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error logging out: " + error.message);
    } else {
      router.push('/login');
    }
  };

  const isLinkActive = (path) => pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo">
          <Link href="/">
            <Image
              src="/assets/brand-logo-purple.png"
              alt="Slowink logo"
              width={180}
              height={60}
              className="logo-img"
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="nav-links">
          <Link href="/#about" className="nav-link">About</Link>
          <Link href="/resources" className={`nav-link ${isLinkActive('/resources') ? 'active' : ''}`}>Resources</Link>
          {user ? (
            <>
              <Link href="/profile" className={`nav-link ${isLinkActive('/profile') ? 'active' : ''}`}>Profile</Link>
              <button onClick={handleLogout} className="nav-link btn-link">Log out</button>
            </>
          ) : (
            <Link href="/login" className="nav-link">Log in</Link>
          )}
          <Link href="https://shopee.co.id/" target="_blank" className="btn-primary">Get the Book</Link>
        </div>

        {/* Hamburger Button */}
        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <Link href="/#about" onClick={toggleMenu}>About</Link>
        <Link href="/resources" onClick={toggleMenu}>Resources</Link>
        {user ? (
          <>
            <Link href="/profile" onClick={toggleMenu}>Profile</Link>
            <button onClick={() => { handleLogout(); toggleMenu(); }} className="mobile-logout">Log out</button>
          </>
        ) : (
          <Link href="/login" onClick={toggleMenu}>Log in</Link>
        )}
        <Link href="https://shopee.co.id/" target="_blank" className="btn-primary" onClick={toggleMenu}>Get the Book</Link>
      </div>

      <style jsx>{`
        .navbar {
          position: relative;
          height: 60px;
          display: flex;
          align-items: center;
          z-index: 1000;
          background: #fafafa;
          margin-top: 20px;
          margin-bottom: 20px;
          border-radius: var(--rounded);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        .nav-link {
          font-weight: 500;
          color: var(--text);
          text-decoration: none;
          transition: var(--transition);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--secondary);
        }
        .nav-link.active {
          font-weight: 700;
        }
        .btn-link {
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
          padding: 0;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 20px;
          background: none;
          border: none;
          z-index: 1100;
        }
        .hamburger span {
          display: block;
          height: 3px;
          width: 100%;
          background: var(--secondary);
          border-radius: 10px;
          transition: var(--transition);
        }
        .hamburger.active span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }
        .mobile-nav {
          position: fixed;
          top: 0;
          right: -100%;
          width: 80%;
          height: 100vh;
          background: #fafafa;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 30px;
          transition: var(--transition);
          box-shadow: -10px 0 30px rgba(0,0,0,0.05);
          z-index: 1050;
        }
        .mobile-nav.open {
          right: 0;
        }
        .mobile-nav a, .mobile-logout {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--secondary);
          text-decoration: none;
        }
        .mobile-logout {
          background: none;
          border: none;
          font-family: inherit;
          cursor: pointer;
          padding: 0;
        }
        .mobile-nav .btn-primary {
          color: var(--white) !important;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .logo-img {
            width: 130px !important;
            height: auto !important;
          }
        }
      `}</style>
    </nav>
  );
}
