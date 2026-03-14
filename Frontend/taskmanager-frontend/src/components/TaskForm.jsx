import { useState } from "react";
import api from "../utils/api";

export default function TaskForm({ reload }){

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [status,setStatus] = useState("todo");
  const [priority,setPriority] = useState("medium");

  const createTask = async(e)=>{

    e.preventDefault();

    if(!title.trim()){
      alert("Title required");
      return;
    }

    try{

      const res = await api.post("/tasks",{
        title:title.trim(),
        description:description.trim(),
        status,
        priority
      });

      console.log(res.data);

      setTitle("");
      setDescription("");

      reload();

    }catch(err){

      console.log(err.response?.data);

      alert("Failed to create task");

    }

  };

  return(

    <form
    onSubmit={createTask}
    className="bg-white p-5 shadow rounded mb-6"
    >

      <h2 className="font-bold text-lg mb-3">
        Add New Task
      </h2>

      <input
      className="border p-2 w-full mb-3 rounded"
      placeholder="Task title"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      />

      <input
      className="border p-2 w-full mb-3 rounded"
      placeholder="Description"
      value={description}
      onChange={(e)=>setDescription(e.target.value)}
      />

      <div className="flex gap-3 mb-3">

        <select
        className="border p-2 rounded flex-1"
        value={status}
        onChange={(e)=>setStatus(e.target.value)}
        >

          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>

        </select>

        <select
        className="border p-2 rounded flex-1"
        value={priority}
        onChange={(e)=>setPriority(e.target.value)}
        >

          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>

        </select>

      </div>

      <button
      type="submit"
      className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
      >
        Add Task
      </button>

    </form>

  )

}