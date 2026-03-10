"use client";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="main-content">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <Image
            src="/assets/ocean-bg.jpg"
            alt="Calm ocean background"
            fill
            className="hero-image"
            priority
          />
        </div>
        <div className="container hero-container">
          <div className="hero-content glass">
            <div className="mascot-container">
              <Image
                src="/assets/inky-hero.png"
                alt="Inky the Octopus"
                width={200}
                height={200}
                className="mascot"
              />
            </div>
            <h1 className="hero-title">Slow thoughts with Inky</h1>
            <p className="hero-subtitle">
              A coloring book that reminds you everything is okay~<br />
              Gentle illustrations and motivational quotes to help you slow down and breathe.
            </p>
            <div className="hero-btns">
              <a href="https://shopee.co.id/slowink_art" target="_blank" className="btn-primary">Start Coloring</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container about-container">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="section-title">A Space for Slow Thoughts</h2>
              <p className="about-p">
                In a world that never stops moving, Slowink is your invitation to pause. Founded on the principles of slow-living and self-care, our coloring books are more than just patterns. They are companions for your quiet moments.
              </p>
              <p className="about-p">
                With Inky by your side, every page is a safe, non-judgmental space to explore your thoughts and find calm in the simple act of coloring.
              </p>
            </div>
            <div className="about-visual glass">
              <Image
                src="/assets/inky-new.png"
                alt="Inky mascot"
                width={420}
                height={420}
                className="about-mascot"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="coloring" className="showcase">
        <div className="container showcase-container">
          <div className="showcase-header">
            <h2 className="section-title">Gentle Illustrations, Kind Words</h2>
            <p className="section-subtitle">
              Each page features an original illustration of Inky, paired with a motivational quote to lift your spirit.
            </p>
          </div>
          <div className="showcase-grid">
            <div className="showcase-item glass">
              <div className="preview-container">
                <Image
                  src="/assets/rest-without-guilt-v2.png"
                  alt="Rest Without Guilt Coloring Page"
                  width={400}
                  height={400}
                  className="preview-image"
                />
              </div>
              <div className="showcase-info">
                <h3>"Rest Without Guilt"</h3>
                <p>A permission slip to pause without needing to earn it or justify yourself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Self-care Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="features-header">
            <h2 className="section-title">Why Slow Coloring?</h2>
            <p className="section-subtitle">
              Discover the gentle power of taking your time. Self-care isn't
              about being perfect; it's about being present.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass">
              <div className="feature-icon">🌿</div>
              <h3>Mindfulness</h3>
              <p>Focus on the stroke of your pen and the flow of color to calm your mind.</p>
            </div>
            <div className="feature-card glass">
              <div className="feature-icon">✨</div>
              <h3>Self-Expression</h3>
              <p>No right or wrong colors. Just your unique expression on the page.</p>
            </div>
            <div className="feature-card glass">
              <div className="feature-icon">🌊</div>
              <h3>Stress Relief</h3>
              <p>Let the repetitive motion of coloring wash away the day's tension.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-book" className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to slow down?</h2>
            <p>Join Inky on a journey of calm and creativity.</p>
            <a href="https://shopee.co.id/slowink_art" target="_blank" className="btn-primary">Order Your Copy Now 🍊</a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Styles for the page */}
      <style jsx global>{`
        .section-title {
          font-size: 2.2rem;
          margin-bottom: 24px;
          text-align: center;
        }
        .section-subtitle {
          font-size: 1.1rem;
          color: var(--text-light);
          max-width: 700px;
          margin: 0 auto 48px auto;
          text-align: center;
        }

        .features {
          background-color: var(--white);
        }
        .features-header {
           margin-bottom: 50px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }
        .feature-card {
          padding: 40px 30px;
          text-align: center;
          transition: var(--transition);
        }
        .feature-card:hover {
          transform: translateY(-10px);
        }
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }
        .feature-card h3 {
          margin-bottom: 15px;
          font-size: 1.4rem;
        }
        .feature-card p {
          color: var(--text-light);
        }

        .about {
          background-color: var(--white);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .about-text {
          text-align: left;
        }
        .about-text .section-title {
          text-align: left;
        }
        .about-p {
          font-size: 1.1rem;
          margin-bottom: 20px;
          color: var(--text-light);
        }
        .about-visual {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .showcase {
          background-color: #f0f7f9;
        }
        .showcase-grid {
          display: flex;
          justify-content: center;
        }
        .showcase-item {
          max-width: 500px;
          padding: 24px;
          text-align: center;
        }
        .preview-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .preview-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .showcase-info h3 {
          margin-bottom: 10px;
          font-size: 1.3rem;
        }

        .cta-section {
          background: linear-gradient(135deg, #fcefed 0%, #e6d2d9 100%);
          text-align: center;
          padding: 100px 0;
        }
        .cta-content {
          padding: 80px 40px;
          max-width: 700px;
          margin: 0 auto;
        }
        .cta-content h2 {
          font-size: 2.2rem;
          margin-bottom: 15px;
        }
        .cta-content p {
          font-size: 1.1rem;
          margin-bottom: 30px;
          color: var(--text-light);
        }
        .cta-content .btn-primary {
          min-width: 260px;
          display: inline-block;
        }

        .hero {
          position: relative;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .hero-image {
          object-fit: cover;
          opacity: 0.8;
        }
        .hero-container {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .hero-content {
          padding: 60px 40px;
          max-width: 800px;
          animation: fadeIn 1s ease-out;
        }
        .mascot-container {
          margin-bottom: 20px;
        }
        .mascot {
          animation: float 4s ease-in-out infinite;
        }
        .hero-title {
          font-size: 2.8rem;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-light);
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-btns {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .about-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 20px;
          }
          .about-text {
            text-align: center;
          }
          .about-text .section-title {
            text-align: center;
          }
          .about-p {
            text-align: center;
          }
          .about-visual {
            padding: 0;
            margin-top: -10px;
          }
          .about {
            padding-bottom: 30px !important;
          }
          .about-mascot {
            max-width: 100%;
            height: auto !important;
          }
          .footer-links {
            gap: 40px;
          }
          .hero-title {
            font-size: 3rem;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 20px;
            width: 100%;
            box-sizing: border-box;
          }
          .logo-img {
            width: 130px !important;
            height: auto !important;
          }
          .navbar {
            margin-top: 20px;
            margin-bottom: 20px;
          }
          section {
            padding: 50px 0;
            width: 100%;
            overflow: hidden;
          }
          .hero {
            padding: 60px 0;
            min-height: auto;
          }
          .hero-content {
             padding: 40px 20px;
             width: 100%;
             max-width: calc(100vw - 80px);
             margin: 0 auto;
          }
          .hero-title {
            font-size: 2rem;
            margin-bottom: 15px;
          }
          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 30px;
          }
          .hero-btns {
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 15px;
          }
          .hero-btns .btn-primary, .hero-btns .btn-secondary {
            min-width: 200px;
            width: auto;
            max-width: 100%;
            text-align: center;
          }
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .section-title {
            font-size: 1.8rem;
          }
          .showcase-item {
            padding: 10px;
            width: 100%;
          }
          .features-grid {
            gap: 20px;
          }
          .feature-card {
            padding: 30px 20px;
          }
          .cta-content {
            padding: 60px 20px;
          }
          .cta-content h2 {
            font-size: 1.8rem;
          }
          .cta-content .btn-primary {
            min-width: 200px;
            width: auto;
          }
          .footer-container {
            flex-direction: column;
            text-align: center;
            align-items: center;
            padding: 0 20px;
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

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.6rem;
          }
          .container {
            padding: 0 20px;
          }
          .hero-content {
             max-width: calc(100vw - 40px);
          }
        }
      `}</style>
    </main>
  );
}
