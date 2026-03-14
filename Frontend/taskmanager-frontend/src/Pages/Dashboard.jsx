import { useState } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskStats from "../components/TaskStats";

export default function Dashboard(){

  const [refresh,setRefresh] = useState(false);

  const reload = ()=>{
    setRefresh(!refresh);
  }

  return(

    <div className="bg-gray-100 min-h-screen">

      <Navbar/>

      <div className="max-w-3xl mx-auto p-6">

        <TaskForm reload={reload}/>
        <TaskList refresh={refresh}/>
<TaskStats/>
      </div>

    </div>

  )

}