import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const toast = useToast();
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      status: "info",
      duration: 2000,
    });
    navigate("/");
  };
};
