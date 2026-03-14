import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async(e)=>{
  e.preventDefault();

  try{

    const res = await api.post("/auth/login",{email,password});

    if(res.data.success){
      navigate("/");
    }

  }catch(err){
    alert("Login failed");
  }
}

  return(

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
      onSubmit={handleSubmit}
      className="bg-white p-8 shadow-lg rounded w-96"
      >

        <h2 className="text-xl font-bold mb-4">
          Login
        </h2>

        <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />

        <input
        className="border p-2 w-full mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />

        <button
        className="bg-indigo-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-center">
  Don't have an account?
  <span
    className="text-indigo-600 cursor-pointer ml-1"
    onClick={()=>navigate("/register")}
  >
    Register
  </span>
</p>

      </form>

    </div>

  )

}