import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Navbar(){

  const navigate = useNavigate();

  const logout = async()=>{
    await api.post("/auth/logout");
    navigate("/login");
  }

  return(

    <div className="bg-indigo-600 text-white p-4 flex justify-between">

      <h1 className="font-bold text-lg">
        Task Manager
      </h1>

      <button
      onClick={logout}
      className="bg-white text-indigo-600 px-4 py-1 rounded"
      >
        Logout
      </button>

    </div>

  )

}