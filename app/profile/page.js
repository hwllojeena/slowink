"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { resources } from "@/lib/data";
import Toast from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [journalHistory, setJournalHistory] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const router = useRouter();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchProfileAndHistory(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const fetchProfileAndHistory = async (userId) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch journal history
      const { data: journalData, error: journalError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (journalError) throw journalError;

      // Map resource details to journal entries
      const enrichedHistory = journalData.map(entry => {
        const resource = resources.find(r => r.id === entry.resource_id);
        return {
          ...entry,
          resourceEmoji: resource?.emoji || "🗒️",
          resourcePrompt: resource?.prompt || "A quiet thought."
        };
      });

      setJournalHistory(enrichedHistory);
    } catch (err) {
      console.error("Error fetching profile data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showNotification("Password must be at least 6 characters.", "error");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      showNotification("Password updated successfully! 🐙✨", "success");
      setNewPassword("");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setUpdatingPassword(false);
    }
  };



  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showNotification("Error logging out: " + error.message, 'error');
    } else {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--secondary)',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        Loading your serenity... 🐙✨
      </div>
    );
  }

  return (
    <main className="main-content">
      <Navbar />

      <section className="profile-section">
        <div className="container">
          <div className="profile-layout">
            {/* Account Info Side */}
            <div className="account-card glass">
              <h2 className="section-title-small">Account Settings</h2>

              <div className="info-group">
                <label>Full Name</label>
                <input type="text" value={profile?.full_name || ""} readOnly className="read-only-input" />
              </div>

              <div className="info-group">
                <label>Email Address</label>
                <input type="email" value={user?.email || ""} readOnly className="read-only-input" />
              </div>

              <form onSubmit={handleChangePassword} className="password-form">
                <label htmlFor="new-password">Change Password</label>
                <div className="password-input-row">
                  <input
                    id="new-password"
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button type="submit" className="btn-secondary" disabled={updatingPassword}>
                    {updatingPassword ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>

              <div className="info-group member-since-group">
                <label>Member Since</label>
                <p className="since-text">{new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Journal History Side */}
            <div className="history-section">
              <h2 className="section-title-small">My Thoughts ({journalHistory.length})</h2>
              <div className="history-grid">
                {journalHistory.length > 0 ? (
                  journalHistory.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/resources?modal=${entry.resource_id}`}
                      className="history-card glass"
                    >
                      <div className="history-icon">{entry.resourceEmoji}</div>
                      <div className="history-content">
                        <h4>{entry.resourcePrompt}</h4>
                        <p className="history-excerpt">{entry.content}</p>
                        <span className="history-date">
                          {new Date(entry.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="empty-history glass">
                    <p>You haven't saved any thoughts yet. 🐙</p>
                    <Link href="/resources" className="btn-link">Explore prompts</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .profile-section {
          padding: 60px 0;
          min-height: calc(100vh - 80px);
          background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
        }
        .profile-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
          align-items: start;
        }
        .section-title-small {
          font-size: 1.5rem;
          margin-bottom: 25px;
          color: var(--secondary);
          font-weight: 700;
        }
        .account-card {
          padding: 35px;
          text-align: left;
        }
        .info-group {
          margin-bottom: 25px;
        }
        .info-group label {
          display: block;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-light);
          margin-bottom: 10px;
          font-weight: 600;
        }
        .read-only-input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(212, 157, 179, 0.2);
          border-radius: 12px;
          color: var(--text);
          font-size: 1rem;
          cursor: default;
          outline: none;
        }
        .since-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
        }
        .password-form {
          margin-top: 25px;
          margin-bottom: 25px;
          width: 100%;
        }
        .password-form label {
          display: block;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-light);
          margin-bottom: 15px;
          font-weight: 600;
        }
        .member-since-group {
          margin-top: 35px;
          padding-top: 30px;
          border-top: 1px solid rgba(212, 157, 179, 0.2);
          width: 100%;
        }
        .password-input-row {
          display: flex;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }
        .password-input-row input {
          flex: 1;
          min-width: 0;
          padding: 12px 15px;
          background: white;
          border: 1px solid rgba(212, 157, 179, 0.3);
          border-radius: 12px;
          outline: none;
          font-family: inherit;
        }
        .password-input-row .btn-secondary {
          padding: 0 25px;
          min-width: 100px;
          height: 48px;
          flex-shrink: 0;
        }

        /* History Styles */
        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .history-card {
          display: flex;
          gap: 20px;
          padding: 25px;
          text-align: left;
          text-decoration: none;
          transition: var(--transition);
        }
        .history-card:hover {
          transform: translateY(-5px);
          border-color: var(--secondary);
        }
        .history-icon {
          font-size: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .history-content h4 {
          font-size: 1rem;
          margin-bottom: 8px;
          color: var(--secondary);
          line-height: 1.4;
        }
        .history-excerpt {
          font-size: 1rem;
          color: var(--text);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
          line-height: 1.5;
        }
        .history-date {
          font-size: 0.8rem;
          color: var(--text-light);
          font-weight: 600;
        }
        .empty-history {
          grid-column: 1 / -1;
          padding: 60px;
          text-align: center;
          color: var(--text-light);
        }



        @media (max-width: 900px) {
          .profile-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .account-card {
            max-width: 600px;
            margin: 0 auto;
          }
          .history-section {
            width: 100%;
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
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .profile-section { padding: 40px 0; }
          .account-card { 
            padding: 25px; 
            width: 100%;
            box-sizing: border-box;
            max-width: 100%;
          }
          .navbar {
            margin-top: 20px;
            margin-bottom: 20px;
            width: 100%;
            border-radius: var(--rounded);
          }
          .history-grid {
            grid-template-columns: 1fr;
            width: 100%;
          }
          .history-card {
            width: 100%;
            box-sizing: border-box;
            flex-direction: column; /* Stack contents on mobile */
            text-align: center;
          }
          .history-icon {
            margin-bottom: 10px;
          }
        }

        @media (max-width: 480px) {
            .section-title-small {
                font-size: 1.3rem;
                text-align: center;
            }
            .info-group label, .password-form label {
                font-size: 0.8rem;
            }
            .read-only-input, .password-input-row input {
                font-size: 0.95rem;
            }
            .password-input-row {
                flex-direction: column;
            }
            .password-input-row .btn-secondary {
                width: fit-content;
                align-self: flex-start;
                margin-top: 10px;
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
