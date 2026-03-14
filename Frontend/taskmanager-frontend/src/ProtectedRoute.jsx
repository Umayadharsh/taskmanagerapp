import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./services/api";

export default function ProtectedRoute({ children }) {

  const [loading,setLoading] = useState(true);
  const [authenticated,setAuthenticated] = useState(false);

  useEffect(()=>{

    const checkAuth = async()=>{

      try{

        await api.get("/auth/me");

        setAuthenticated(true);

      }catch{

        setAuthenticated(false);

      }

      setLoading(false);
    }

    checkAuth();

  },[])

  if(loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/login"/>;
}