import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export const useRequireAuth = (requiredRole) => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const role = sessionStorage.getItem("role");
  
      if (!role) {
        sessionStorage.removeItem('role');
        navigate("/login");
        toast.error("Unauthorized Access. Please login again to view.");
      } else if (requiredRole && role !== requiredRole) {
        navigate("/");
        toast.error(`Access denied. You need to have a ${requiredRole} role to access this page.`);
      }
    }, [navigate, requiredRole]);
  };