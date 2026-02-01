"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const router = useRouter();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    // Listen for the recovery event to show the "Update Password" form
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsUpdateMode(true);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        showNotification("Welcome back! Loading your serenity... 🐙✨", 'success');
        setTimeout(() => router.push('/resources'), 1500);
      }
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) throw resetError;

      showNotification("Check your email for the password reset link! 🐙✨", 'info');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      showNotification("Password updated successfully! Redirecting... 🐙✨", 'success');
      setTimeout(() => {
        setIsUpdateMode(false);
        setIsResetMode(false);
      }, 3000);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="container auth-container">
        <div className="auth-mascot-container">
          <Image
            src="/assets/inky-login-cozy.png"
            alt="Cozy Inky mascot"
            width={280}
            height={280}
            className="auth-mascot"
          />
        </div>

        <div className="auth-card glass">
          <Link href="/" className="back-home">← Back to home</Link>
          <div className="auth-header">
            <h2>{isUpdateMode ? "New Password" : isResetMode ? "Reset Password" : "Welcome Back!"}</h2>
            <p>
              {isUpdateMode
                ? "Enter your new password below."
                : isResetMode
                  ? "We'll send you a link to get back into your account."
                  : "Log in to continue your coloring journey."}
            </p>
          </div>

          {isUpdateMode ? (
            <form className="auth-form" onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          ) : !isResetMode ? (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="inky@slowink.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <div className="label-with-link">
                  <label htmlFor="password">Password</label>
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={() => setIsResetMode(true)}
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style={{ opacity: 0.6 }}>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style={{ opacity: 0.6 }}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="reset-email">Email</label>
                <input
                  type="email"
                  id="reset-email"
                  placeholder="inky@slowink.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                className="back-to-login"
                onClick={() => {
                  setIsResetMode(false);
                  setError(null);
                  setMessage(null);
                }}
              >
                Back to Login
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>Don't have an account? <Link href="/signup">Sign up</Link></p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 10px;
        }
        .auth-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          max-width: 1000px;
          width: 100%;
        }
        .back-home {
          position: absolute;
          top: -40px;
          left: 0;
          color: var(--text-light);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .back-home:hover {
          color: var(--secondary);
          transform: translateX(-5px);
        }
        .auth-card {
          position: relative;
          width: 100%;
          max-width: 450px;
          padding: 50px 40px;
          border-radius: var(--rounded);
          text-align: center;
          animation: fadeIn 0.8s ease-out;
        }
        .auth-header {
          margin-bottom: 35px;
        }
        .auth-logo {
          margin-bottom: 20px;
          cursor: pointer;
        }
        .auth-header h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: var(--secondary);
        }
        .auth-header p {
          color: var(--text-light);
          font-size: 1rem;
        }
        .auth-form {
          text-align: left;
        }
        .error-message {
          background: rgba(255, 0, 0, 0.1);
          color: #d32f2f;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
        }
        .success-message {
          background: rgba(76, 175, 80, 0.1);
          color: #2e7d32;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
        }
        .label-with-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .forgot-link {
          background: none;
          border: none;
          color: var(--secondary);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
          opacity: 0.8;
          transition: var(--transition);
        }
        .forgot-link:hover {
          opacity: 1;
          text-decoration: underline;
        }
        .back-to-login {
          width: 100%;
          background: none;
          border: none;
          color: var(--text-light);
          font-weight: 600;
          margin-top: 15px;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
        }
        .back-to-login:hover {
          color: var(--secondary);
        }
        .form-group {
          margin-bottom: 20px;
        }
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .toggle-password {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: var(--transition);
        }
        .toggle-password:hover {
          opacity: 1;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--text);
          font-size: 0.9rem;
        }
        .form-group input {
          width: 100%;
          padding: 15px 20px;
          border-radius: 15px;
          border: 1px solid rgba(212, 157, 179, 0.3);
          background: rgba(255, 255, 255, 0.8);
          font-family: inherit;
          transition: var(--transition);
          outline: none;
        }
        .form-group input:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 0 4px rgba(212, 157, 179, 0.1);
          background: var(--white);
        }
        .auth-submit {
          width: 100%;
          padding: 15px;
          margin-top: 10px;
          font-size: 1rem;
        }
        .auth-footer {
          margin-top: 25px;
          font-size: 0.95rem;
          color: #333;
        }
        .auth-footer a {
          color: #000;
          font-weight: 700;
          text-decoration: none;
        }
        .auth-footer a:hover {
          text-decoration: underline;
        }
        .auth-mascot-container {
          /* Animation removed */
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 850px) {
          .auth-container {
            flex-direction: column;
            gap: 30px;
            padding: 20px 0;
          }
          .auth-mascot {
            width: 220px !important;
            height: auto !important;
          }
          .auth-card {
            padding: 40px 20px;
            width: 95%;
          }
          .back-home {
            left: 20px;
            top: -30px;
          }
        }
      `}</style>
    </main >
  );
}
