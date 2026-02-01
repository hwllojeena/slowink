"use client";
import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container ${visible ? 'visible' : ''} ${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' ? '✨' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <p className="toast-message">{message}</p>
      </div>

      <style jsx>{`
        .toast-container {
          position: fixed;
          bottom: 30px;
          left: 0;
          right: 0;
          padding: 0 20px;
          display: flex;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          transform: translateY(100px);
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          pointer-events: none;
        }

        .toast-container.visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .toast-content {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(212, 157, 179, 0.3);
          padding: 12px 25px;
          border-radius: 50px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 100%;
          text-align: center;
        }

        .toast-container.error .toast-content {
          border-color: rgba(211, 47, 47, 0.3);
          background: rgba(255, 235, 238, 0.9);
        }

        .toast-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .toast-message {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          word-break: break-word;
        }

        @media (max-width: 600px) {
          .toast-container {
            bottom: 20px;
          }
          .toast-content {
            padding: 10px 18px;
            border-radius: 20px;
            width: auto;
            min-width: unset;
          }
          .toast-message {
            font-size: 0.85rem;
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}
