import { useEffect, useState } from "react";
import api from "../services/api";

export default function TaskList({ refresh }) {

  const [tasks,setTasks] = useState([]);
  const [search,setSearch] = useState("");
  const [status,setStatus] = useState("");
  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);

  const updateStatus = async(id,status)=>{

await api.put(`/tasks/${id}`,{status});

loadTasks();

}

  const limit = 5;

  const loadTasks = async () => {

  try {

    const params = {
      page,
      limit
    };

    if (search.trim()) {
      params.search = search;
    }

    if (status) {
      params.status = status;
    }

    const res = await api.get("/tasks", { params });

    setTasks(res.data.data.tasks);
    setTotalPages(res.data.data.pagination.totalPages);

  } catch (err) {

    console.log(err.response?.data);

  }

};

  const deleteTask = async(id)=>{

    await api.delete(`/tasks/${id}`);
    loadTasks();

  };

  useEffect(()=>{
    loadTasks();
  },[refresh,page,search,status]);

  return(

    <div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">

        <input
        placeholder="Search tasks..."
        className="border p-2 flex-1 rounded"
        value={search}
        onChange={(e)=>{
          setPage(1);
          setSearch(e.target.value);
        }}
        />

        <select
        className="border p-2 rounded"
        value={status}
        onChange={(e)=>{
          setPage(1);
          setStatus(e.target.value);
        }}
        >

          <option value="">All</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>

        </select>

      </div>

      {/* Task Cards */}

      {tasks.map(task=>(
        <div
        key={task._id}
        className="bg-white p-4 shadow rounded mb-3 flex justify-between"
        >

          <div>

            <h3 className="font-bold text-lg">
              {task.title}
            </h3>

            <p className="text-gray-600">
              {task.description}
            </p>

            <span className={`px-2 py-1 text-xs rounded 
${task.status === "completed" ? "bg-green-200 text-green-700" :
task.status === "in-progress" ? "bg-yellow-200 text-yellow-700" :
"bg-gray-200 text-gray-700"}`}>
{task.status}
</span>

          </div>

          <button
onClick={()=>updateStatus(task._id,"completed")}
className="text-green-600"
>
Complete
</button>

          <button
          onClick={()=>deleteTask(task._id)}
          className="text-red-500"
          >
            Delete
          </button>

        </div>
      ))}

      {/* Pagination */}

      <div className="flex justify-center gap-3 mt-4">

        <button
        disabled={page===1}
        onClick={()=>setPage(page-1)}
        className="bg-gray-200 px-3 py-1 rounded"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
        disabled={page===totalPages}
        onClick={()=>setPage(page+1)}
        className="bg-gray-200 px-3 py-1 rounded"
        >
          Next
        </button>

      </div>

    </div>

  )

}