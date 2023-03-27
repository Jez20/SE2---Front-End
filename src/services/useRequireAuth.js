import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export const useRequireAuth = (allowedRoles) => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const role = sessionStorage.getItem("role");
      console.log("Role:", role); // Add this line to check the value of `role`
    
      if (!role) {
        navigate("/login");
        toast.error("Unauthorized Access. Please login again to view.");
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        navigate("/");
        toast.error(`Access denied. You need to have a ${allowedRoles.join(" or ")} role to access this page.`);
      }
    }, [navigate, allowedRoles]);
  };