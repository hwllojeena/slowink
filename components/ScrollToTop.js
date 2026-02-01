"use client";
import { useState, useEffect } from "react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <button
                className={`scroll-to-top ${isVisible ? "visible" : ""}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 15l-6-6-6 6" />
                </svg>
            </button>

            <style jsx>{`
        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--secondary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 999;
          box-shadow: 0 4px 15px rgba(212, 157, 179, 0.4);
          pointer-events: none;
        }

        .scroll-to-top.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .scroll-to-top:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(212, 157, 179, 0.6);
        }

        :global(.footer) {
             /* Ensure footer doesn't overlap if needed, though z-index handles it */
        }
      `}</style>
        </>
    );
}
