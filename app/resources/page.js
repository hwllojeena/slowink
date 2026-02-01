"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { resources } from "@/lib/data";
import Toast from "@/components/Toast";

export default function Resources() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "100px", textAlign: "center" }}>Loading serenity...</div>}>
      <ResourcesContent />
    </Suspense>
  );
}

function ResourcesContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showNotification("Error logging out: " + error.message, 'error');
    } else {
      router.push('/login');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const resetTimer = (newMode = mode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === "focus") setTimeLeft(25 * 60);
    else if (newMode === "short") setTimeLeft(5 * 60);
    else if (newMode === "long") setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const [selectedResource, setSelectedResource] = useState(null);
  const [journalEntry, setJournalEntry] = useState("");

  const openModal = async (resource) => {
    setSelectedResource(resource);
    setJournalEntry("");
    document.body.style.overflow = 'hidden';
    // Update URL with resource ID
    router.push(`/resources?modal=${resource.id}`, { scroll: false });

    // If user is logged in, fetch their existing entry for this resource
    if (user) {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('content')
        .eq('user_id', user.id)
        .eq('resource_id', resource.id)
        .single();

      if (data) {
        setJournalEntry(data.content);
      }
    } else {
      // Fallback to localStorage for guests
      const saved = localStorage.getItem(`journal_${resource.id}`);
      if (saved) setJournalEntry(saved);
    }
  };

  const closeModal = () => {
    setSelectedResource(null);
    setJournalEntry("");
    document.body.style.overflow = 'auto';
    // Remove individual resource ID from URL
    router.push('/resources', { scroll: false });
  };

  // Effect to handle deep linking on initial load
  useEffect(() => {
    const fetchEntry = async (userId, resourceId) => {
      const { data } = await supabase
        .from('journal_entries')
        .select('content')
        .eq('user_id', userId)
        .eq('resource_id', resourceId)
        .single();

      if (data) {
        setJournalEntry(data.content);
      }
    };

    const modalId = searchParams.get('modal');
    if (modalId) {
      const resource = resources.find(r => r.id === modalId);
      if (resource) {
        setSelectedResource(resource);
        document.body.style.overflow = 'hidden';

        // Fetch entry if user is logged in
        if (user) {
          fetchEntry(user.id, resource.id);
        } else {
          // Retry logic in case user state isn't ready yet (slight delay)
          const checkUser = setInterval(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session?.user) {
                fetchEntry(session.user.id, resource.id);
                clearInterval(checkUser);
              }
            });
          }, 500);

          // Build safety valve to stop checking after 5 seconds
          setTimeout(() => clearInterval(checkUser), 5000);
        }
      }
    }
  }, [searchParams, user]);

  const saveJournal = async () => {
    if (!selectedResource) return;

    if (user) {
      // Save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .upsert({
          user_id: user.id,
          resource_id: selectedResource.id,
          content: journalEntry,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,resource_id'
        });

      if (error) {
        showNotification("Error saving your thoughts: " + error.message, 'error');
      } else {
        showNotification("Your thoughts have been safely kept in the cloud. 🐙☁️💙", 'success');
      }
    } else {
      showNotification("Please log in to save your thoughts forever in the cloud. 🐙💙", 'info');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <main className="main-content">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo">
            <Link href="/">
              <Image
                src="/assets/brand-logo.png"
                alt="Slowink logo"
                width={180}
                height={60}
                className="logo-img"
                style={{ objectFit: 'contain' }}
                priority
              />
            </Link>
          </div>

          <div className="nav-links">
            <Link href="/#about" className="nav-link">About</Link>
            <Link href="/resources" className="nav-link active">Resources</Link>
            {user ? (
              <>
                <Link href="/profile" className="nav-link">Profile</Link>
                <button onClick={handleLogout} className="nav-link btn-link">Log out</button>
              </>
            ) : (
              <Link href="/login" className="nav-link">Log in</Link>
            )}
            <Link href="https://shopee.co.id/" target="_blank" className="btn-primary">Get the Book</Link>
          </div>

          <button
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

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
      </nav>

      <section className="resources-hero">


        <div className="container">
          <div className="timer-container glass">
            {/* Swaying Mascot */}
            <div className="swaying-inky">
              <Image
                src="/assets/inky-timer.png"
                alt="Cool Inky"
                width={180}
                height={180}
                className="mascot-sway"
              />
            </div>
            <h1 className="hero-title">Coloring Timer</h1>
            <div className="timer-display">{formatTime(timeLeft)}</div>

            <div className="timer-modes">
              <button
                className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
                onClick={() => resetTimer('focus')}
              >Focus</button>
              <button
                className={`mode-btn ${mode === 'short' ? 'active' : ''}`}
                onClick={() => resetTimer('short')}
              >Short Break</button>
              <button
                className={`mode-btn ${mode === 'long' ? 'active' : ''}`}
                onClick={() => resetTimer('long')}
              >Long Break</button>
            </div>

            <div className="timer-controls">
              <button className="btn-primary" onClick={toggleTimer}>
                {isActive ? "Pause" : "Start"}
              </button>
              <button className="btn-secondary" onClick={() => resetTimer()}>
                Reset
              </button>
            </div>

            {/* Audio Toggle Button */}
            <button
              className={`audio-toggle ${isPlaying ? 'playing' : ''}`}
              onClick={toggleAudio}
              title={isPlaying ? "Pause music" : "Play calming music"}
            >
              <span className="audio-icon">{isPlaying ? "⏸️" : "🎵"}</span>
            </button>

            <audio
              ref={audioRef}
              src="https://kshdgxthmfabghipefmb.supabase.co/storage/v1/object/public/Audio/no%20ads%20music%20LoFi%20Spring%20_%20Perfect%20Background%20Music%20for%20studying%20Spring%20Vol3%20lofi%20hip%20hop.mp3"
              loop
            />
          </div>
        </div>
      </section>

      <section className="resources-grid-section">
        <div className="container">
          <div className="resources-grid">
            {resources.map((item, index) => (
              <div key={index} className="resource-card glass">
                <div className="resource-icon">{item.emoji}</div>
                <div className="resource-quote">
                  <p className="quote-text">"{item.quote}"</p>
                </div>
                <p className="resource-desc">{item.description}</p>
                <button className="btn-secondary" onClick={() => openModal(item)}>Open</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {selectedResource && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div className="modal-inner">
              <div className="modal-header">
                <span className="modal-icon">{selectedResource.emoji}</span>
                <h2>{selectedResource.quote}</h2>
                <p className="modal-desc">{selectedResource.description}</p>
              </div>

              <div className="modal-body">
                <div className="modal-section journaling">
                  <h3>✍️ Journaling Prompt</h3>
                  <p className="prompt-text">{selectedResource.prompt}</p>
                  <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="journal-input"
                  />
                  <button className="btn-primary" onClick={saveJournal}>Save Thought</button>
                </div>

                <div className="modal-section activity">
                  <h3>🧘 Mini Activity</h3>
                  <p className="activity-text">{selectedResource.activity}</p>
                </div>

                <div className="modal-section inky">
                  <div className="inky-bubble">
                    <p>“{selectedResource.inkyMessage}”</p>
                    <span className="inky-name">— Inky 🐙</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-logo">
            <Image
              src="/assets/brand-logo.png"
              alt="Slowink logo"
              width={140}
              height={45}
              className="logo-img"
              style={{ objectFit: 'contain', marginBottom: '10px' }}
            />
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
              <a href="https://www.instagram.com/slowink.id/" target="_blank">Instagram</a>
              <a href="https://www.tiktok.com/en/" target="_blank">TikTok</a>
              <a href="https://shopee.co.id/" target="_blank">Shopee</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Slowink. Handcrafted with care.</p>
        </div>
      </footer>

      <style jsx global>{`
        .resources-hero {
          position: relative;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(rgba(250, 250, 250, 0.4), rgba(250, 250, 250, 0.4)), url('/assets/timer-bg.png');
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }
        .timer-container {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeIn 1s ease-out;
        }
        .hero-title {
          font-size: 2.8rem;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .timer-display {
          font-size: 5rem;
          font-weight: 700;
          color: var(--secondary);
          margin: 0px 0 30px 0;
          font-variant-numeric: tabular-nums;
        }
        .timer-modes {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .mode-btn {
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid var(--secondary);
          color: var(--secondary);
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: var(--transition);
        }
        .mode-btn.active {
          background: var(--secondary);
          color: white;
        }
        .timer-controls {
          display: flex;
          gap: 20px;
        }
        .audio-toggle {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: var(--transition);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          z-index: 5;
        }
        .audio-toggle:hover {
          background: var(--white);
          transform: scale(1.1);
        }
        .audio-toggle.playing {
          background: var(--secondary);
          color: white;
        }
        .audio-toggle.playing .audio-icon {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .swaying-inky {
          margin: 0 0 20px 0;
          animation: swayArc 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes swayArc {
          0% { transform: translate(-20px, 0) rotate(-5deg); }
          50% { transform: translate(20px, 5px) rotate(5deg); }
          100% { transform: translate(-20px, 0) rotate(-5deg); }
        }
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: -30px;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }
        .resources-grid-section {
          padding-bottom: 20px;
        }
        .resource-card {
          padding: 40px 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          transition: var(--transition);
        }
        .resource-card:hover {
          transform: translateY(-10px);
        }
        .resource-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }
        .resource-quote {
          margin-bottom: 20px;
          flex-grow: 1;
        }
        .quote-text {
          font-family: inherit;
          font-style: italic;
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--secondary);
          margin-bottom: 10px;
          font-weight: 600;
        }
        .quote-author {
          display: block;
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 500;
        }
        .resource-desc {
          font-size: 0.95rem;
          color: var(--text);
          line-height: 1.5;
          margin-bottom: 25px;
        }
        .resource-card .btn-secondary {
          align-self: center;
        }
        .nav-link {
          font-weight: 500;
          color: var(--text);
          text-decoration: none;
          transition: var(--transition);
        }
        .nav-link:hover {
          color: var(--secondary);
        }
        .nav-link.active {
          color: var(--secondary);
          font-weight: 700;
        }
        .btn-link {
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
          padding: 0;
        }
        
        /* Navbar specific for resources */
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

        .mobile-nav.open {
          right: 0;
        }
        
        .logo-img {
          transition: var(--transition);
        }

        @media (max-width: 1200px) {
          .resources-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 20px;
          }
          .logo-img {
            width: 130px !important;
            height: auto !important;
          }
          .resources-hero {
            padding: 60px 0;
            min-height: auto;
          }
          .hero-title {
            font-size: 1.8rem;
          }
          .mascot-sway {
            width: 140px !important;
            height: auto !important;
          }
          .navbar {
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .resources-grid {
            grid-template-columns: 1fr;
            margin-top: 0;
            gap: 20px;
          }
          .resource-card {
            padding: 30px 20px;
          }
          .btn-primary, .btn-secondary {
            min-width: 150px;
            width: auto;
            text-align: center;
          }
          .timer-container {
            padding: 40px 20px;
            width: 100%;
            max-width: calc(100vw - 80px);
            margin: 0 auto;
            box-sizing: border-box;
          }
          .timer-display {
            font-size: 3rem;
          }
          .timer-controls {
            gap: 10px;
            width: 100%;
            justify-content: center;
          }
          .timer-controls .btn-primary, .timer-controls .btn-secondary {
            min-width: 100px;
            padding: 10px 20px;
          }
          .audio-toggle {
            top: 15px;
            right: 15px;
            width: 35px;
            height: 35px;
            font-size: 1.2rem;
          }
        }
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        .modal-content {
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 50px 40px;
          position: relative;
          background: rgba(255, 255, 255, 0.85) !important;
          animation: scaleUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .modal-content::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 25px;
          font-size: 2.5rem;
          background: none;
          border: none;
          color: var(--secondary);
          cursor: pointer;
          line-height: 1;
        }
        .modal-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .modal-icon {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 15px;
        }
        .modal-header h2 {
          font-size: 1.8rem;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .modal-desc {
          color: var(--accent);
          font-style: italic;
        }
        .modal-section {
          margin-bottom: 35px;
        }
        .modal-section.journaling {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .modal-section.journaling .btn-primary {
          align-self: center;
          width: auto;
          min-width: 150px;
          padding: 14px 32px;
        }
        .modal-section h3 {
          align-self: flex-start;
          font-size: 1.1rem;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .prompt-text, .activity-text {
          width: 100%;
          min-height: 80px;
          display: flex;
          align-items: center;
          font-size: 1rem;
          margin-bottom: 15px;
          color: var(--text);
          background: rgba(255, 255, 255, 0.5);
          padding: 15px;
          border-radius: 15px;
          box-sizing: border-box;
        }
        .journal-input {
          width: 100%;
          min-height: 150px;
          padding: 15px;
          border-radius: 15px;
          border: 1px solid rgba(212, 157, 179, 0.3);
          background: white;
          font-family: inherit;
          font-size: 1rem;
          margin-bottom: 15px;
          resize: none;
          box-sizing: border-box;
          outline: none;
          transition: var(--transition);
        }
        .journal-input:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 0 3px rgba(212, 157, 179, 0.1);
        }
        .inky-bubble {
          background: var(--secondary);
          color: white;
          padding: 25px;
          border-radius: 30px 30px 5px 30px;
          position: relative;
          box-shadow: 0 10px 25px rgba(212, 157, 179, 0.2);
        }
        .inky-bubble p {
          font-size: 1.1rem;
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .inky-name {
          display: block;
          text-align: right;
          font-weight: 600;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        @media (max-width: 600px) {
          .modal-content {
            padding: 40px 20px;
          }
          .modal-header h2 {
            font-size: 1.4rem;
          }
        }
      `}</style>
      <style jsx global>{`
        @media (max-width: 768px) {
          .timer-container {
             width: 100%;
             max-width: calc(100vw - 80px);
             padding: 40px 20px;
          }
        }

        @media (max-width: 480px) {
           .timer-container {
             max-width: calc(100vw - 40px);
           }
        }
      `}</style>
      {/* Toast Notification */}
      <Toast
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />
    </main>
  );
}
