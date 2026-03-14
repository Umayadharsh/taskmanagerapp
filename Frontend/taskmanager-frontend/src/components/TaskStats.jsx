import { useEffect,useState } from "react";
import api from "../utils/api";

export default function TaskStats(){

const [stats,setStats] = useState(null);

useEffect(()=>{

loadStats();

},[])

const loadStats = async()=>{

const res = await api.get("/tasks/stats");

setStats(res.data.data);

}

if(!stats) return null;

return(

<div className="grid grid-cols-3 gap-4 mb-6">

<div className="bg-white shadow p-4 rounded text-center">
<h3 className="text-lg font-bold">{stats.total}</h3>
<p>Total Tasks</p>
</div>

<div className="bg-white shadow p-4 rounded text-center">
<h3 className="text-lg font-bold">{stats.completed}</h3>
<p>Completed</p>
</div>

<div className="bg-white shadow p-4 rounded text-center">
<h3 className="text-lg font-bold">{stats.pending}</h3>
<p>Pending</p>
</div>

</div>

)

}