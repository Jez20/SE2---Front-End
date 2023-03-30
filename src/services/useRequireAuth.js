import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export const useRequireAuth = (allowedRoles) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (!role) {
      navigate("/login");
      toast.error("Unauthorized Access. Please login again to view.");
    } else if (allowedRoles && !allowedRoles.includes(role)) {
      navigate("/");
      toast.error(`Access denied. You need to be an ${allowedRoles.join(" or ")} to access this page.`);
    }

    // prevent user from going back to login page
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, [navigate, allowedRoles]);
};