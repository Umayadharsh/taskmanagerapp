import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      await api.post("/auth/register",{name,email,password});
      navigate("/login");

    }catch(err){
      alert("Registration failed");
    }
  }

  return(

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
      onSubmit={handleSubmit}
      className="bg-white p-8 shadow-lg rounded w-96"
      >

        <h2 className="text-xl font-bold mb-4">
          Register
        </h2>

        <input
        className="border p-2 w-full mb-3"
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />

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
          Register
        </button>

        <p className="mt-4 text-center">
  Already have an account?
  <span
    className="text-indigo-600 cursor-pointer ml-1"
    onClick={()=>navigate("/login")}
  >
    Login
  </span>
</p>
<div className="mb-3">
  <input
    type="password"
    placeholder="Password"
    className="w-full p-2 border rounded"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <p className="text-sm text-gray-500 mt-1">
    Password must be at least 8 characters and include:
    <br />• 1 uppercase letter
    <br />• 1 lowercase letter
    <br />• 1 number
  </p>
</div>
      </form>

    </div>

  )

}