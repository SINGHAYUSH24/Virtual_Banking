import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export default function SessionTimeoutHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    toast.warn("Session expired due to inactivity. Please login again.");
    navigate("/");
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const token = localStorage.getItem("token");
    const isPublicPage = location.pathname === "/" || location.pathname === "/signup";
    
    if (token && !isPublicPage) {
      timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    
    // Add event listeners to detect user activity
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    return () => {
      // Clean up event listeners and timeout
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname]); // Re-run when page changes

  return null; // This component has no visual output
}
