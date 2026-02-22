"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo">
          <Link href="/">
            <Image
              src="/assets/brand-logo-purple.png"
              alt="Slowink logo"
              width={140}
              height={45}
              className="logo-img"
              style={{ objectFit: 'contain', marginBottom: '10px' }}
            />
          </Link>
          <p>Slow thoughts with Inky.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Explore</h4>
            <Link href="/#about">About</Link>
            <Link href="/resources">Resources</Link>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://www.instagram.com/slowink.id/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@slowink.id" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://shopee.co.id/" target="_blank" rel="noopener noreferrer">Shopee</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Slowink. Handcrafted with care by <a href="https://www.tiktok.com/@slowink.id" target="_blank" rel="noopener noreferrer" className="author-link">author</a>.
        </p>
      </div>

      <style jsx>{`
        .footer {
          background-color: #fafafa;
          padding: 80px 0 40px 0;
          border-top: 1px solid #eee;
        }
        .footer-container {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 40px;
          margin-bottom: 60px;
        }
        .footer-logo {
          text-align: left;
        }
        .footer-logo .logo-img {
          margin-left: -15px;
          margin-bottom: 10px;
        }
        .footer-logo p {
          margin-top: 10px;
          color: var(--accent);
          font-weight: 600;
        }
        .footer-links {
          display: flex;
          gap: 80px;
        }
        .footer-col h4 {
          margin-bottom: 20px;
          color: var(--secondary);
          font-size: 1.1rem;
        }
        .footer-col a {
          display: block;
          margin-bottom: 12px;
          color: var(--text-light);
          font-size: 0.95rem;
          transition: var(--transition);
        }
        .footer-col a:hover {
          color: var(--secondary);
          transform: translateX(5px);
        }
        .footer-bottom {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid #eee;
          color: var(--text-light);
          font-size: 0.9rem;
        }
        .author-link {
          color: var(--secondary);
          font-weight: 600;
          text-decoration: underline;
        }
        .author-link:hover {
          color: var(--accent);
        }

        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
            text-align: center;
            align-items: center;
            padding: 0 20px;
          }
          .footer-logo {
            text-align: center;
          }
          .footer-logo .logo-img {
            margin-left: 0;
          }
          .footer-links {
            flex-direction: column;
            gap: 30px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
